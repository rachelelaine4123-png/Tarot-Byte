// POST /api/interpret — Claude-powered reading interpretation.
//
// Body: { reading, question }
// Returns: { cards: [{keywords, overview}], threadLine, synthesis, source }
//
// This route is intentionally FAIL-SOFT. If the API key is missing, the model
// errors, or the response isn't valid JSON, we return the deterministic
// templated fallback with status 200 so the reading UI never breaks.

import { NextResponse } from "next/server";
import {
  buildInterpretationPrompt,
  fallbackInterpretation,
} from "@/lib/interpretPrompt";

// Overridable via env so the model can be upgraded without a code change.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";
const MAX_TOKENS = 1600;
const TIMEOUT_MS = 20000;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const { reading, question } = body || {};
  if (!reading?.cards?.length) {
    return NextResponse.json({ error: "missing_reading" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackInterpretation(reading));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "user", content: buildInterpretationPrompt(reading, question) },
          // Prefill forces the model straight into JSON, no preamble.
          { role: "assistant", content: "{" },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn("[interpret] anthropic error", res.status, detail.slice(0, 300));
      return NextResponse.json(fallbackInterpretation(reading));
    }

    const data = await res.json();
    const raw = "{" + (data?.content?.[0]?.text ?? "");
    const parsed = safeParse(raw);

    const validated = validate(parsed, reading);
    if (!validated) {
      console.warn("[interpret] response failed validation, using fallback");
      return NextResponse.json(fallbackInterpretation(reading));
    }

    return NextResponse.json({ ...validated, source: "ai" });
  } catch (err) {
    clearTimeout(timer);
    console.warn("[interpret] request failed:", err?.message);
    return NextResponse.json(fallbackInterpretation(reading));
  }
}

/** Tolerant JSON parse — strips code fences and trailing prose if present. */
function safeParse(text) {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to salvage the outermost JSON object.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Enforce the contract: one entry per card, 3 keywords each, non-empty text.
 * Returns a normalized object, or null if unusable.
 */
function validate(parsed, reading) {
  if (!parsed || !Array.isArray(parsed.cards)) return null;
  if (parsed.cards.length !== reading.cards.length) return null;

  const cards = parsed.cards.map((c) => {
    const kw = Array.isArray(c?.keywords)
      ? c.keywords.filter((k) => typeof k === "string" && k.trim()).slice(0, 3)
      : [];
    const overviewRaw = typeof c?.overview === "string" ? c.overview.trim() : "";
    return {
      keywords: kw.map((k) => k.trim().toLowerCase()),
      // Hard cap at 2 sentences regardless of what the model returned —
      // guarantees the "top 3 words + <=2 sentences" contract every time.
      overview: capSentences(overviewRaw, 2),
    };
  });

  if (cards.some((c) => c.keywords.length === 0 || !c.overview)) return null;
  if (typeof parsed.synthesis !== "string" || parsed.synthesis.trim().length < 40) return null;

  // threadLine must be present when an oracle card was drawn.
  const threadLine =
    typeof parsed.threadLine === "string" && parsed.threadLine.trim()
      ? parsed.threadLine.trim()
      : null;
  if (reading.oracle && !threadLine) return null;

  return { cards, threadLine, synthesis: parsed.synthesis.trim() };
}

/**
 * Trim text to at most `max` sentences. Abbreviations are rare in this copy,
 * so a simple terminator split is sufficient and predictable.
 */
function capSentences(text, max) {
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g);
  if (!sentences || sentences.length <= max) return text;
  return sentences.slice(0, max).join("").trim();
}
