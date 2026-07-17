"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateReading, rederiveCelestialLines, SPREADS } from "@/lib/readingEngine";
import { asset } from "@/lib/asset";
import { useAccount } from "@/lib/useAccount";
import { PRICING } from "@/lib/stripeConfig";

const ZODIAC_GLYPH = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

// The T / Z / D ladder definition — with the new naming:
//   T = Classic (card + meaning)
//   Z = Astral Threads (zodiac sign + ruling planet overlay)
//   D = The Decan Engine (exact 10° decan degree)
const LADDER = [
  {
    key: "T",
    name: "Classic",
    sub: "The cards & their meaning",
    tip: "The cards and their timeless meaning — the reading as tarot has always been told.",
    need: "free",
  },
  {
    key: "Z",
    name: "Astral Threads",
    sub: "Each card's sign & planet",
    tip: "Each card's zodiac sign & ruling planet, layered over the classic meaning. This is the Astral Thread — the celestial address that tells you why and when.",
    need: "member",
  },
  {
    key: "D",
    name: "The Decan Engine",
    sub: "The exact 10° celestial degree",
    tip: "The exact 10° celestial degree behind every card — the deepest, most precise layer TarotByte offers. The Decan Engine resolves each Astral Thread to its precise degree.",
    need: "subscriber",
  },
];

const DECAN_ADDON = {
  listPrice: 4,
  memberPrice: 2,
  memberFreePerMonth: 1,
  pack3Price: 5,
};

export default function Reading({ spreadId, locked = false }) {
  const spread = SPREADS[spreadId];
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState(spread.contexts ? spread.contexts[0] : null);
  const [tier, setTier] = useState("T");
  const [reading, setReading] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | shuffling | revealed

  const account = useAccount();
  const loading = account.loading;

  const [addonActive, setAddonActive] = useState(false);
  const [addonBusy, setAddonBusy] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  async function startCheckout(priceId) {
    setCheckoutBusy(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || "Checkout unavailable.");
        setCheckoutBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Could not reach the payment server. Please try again.");
      setCheckoutBusy(false);
    }
  }

  const [previewLevel, setPreviewLevel] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("unlocked");
      if (u === "1") setPreviewLevel(1);
      if (u === "2") setPreviewLevel(2);
      if (params.get("checkout") === "success") {
        account.refresh();
        const t1 = setTimeout(() => account.refresh(), 2500);
        const t2 = setTimeout(() => account.refresh(), 6000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
      }
    }
  }, []);

  const unlockLevel =
    !loading && account.signedIn ? account.unlockLevel : previewLevel;
  const freeCredits =
    !loading && account.signedIn ? account.freeDecanCredits : previewLevel === 1 ? DECAN_ADDON.memberFreePerMonth : 0;

  const spreadLocked = locked && unlockLevel < 1;
  const decanUnlocked = unlockLevel >= 2 || addonActive;

  function canUseTier(key) {
    if (key === "T") return true;
    if (key === "Z") return unlockLevel >= 1;
    if (key === "D") return decanUnlocked;
    return false;
  }

  // Member unlocks the Decan Engine for THIS reading — uses a credit if one
  // is available, otherwise redirects to Stripe Checkout.
  // IMPORTANT: this does NOT redraw the hand. It re-derives the celestial
  // lines on the existing drawn cards so the user keeps their cards and
  // only gains the deeper layer.
  async function activateAddon() {
    if (freeCredits > 0) {
      setAddonBusy(true);
      try {
        const res = await fetch("/api/decan/addon", { method: "POST" });
        if (res.status === 409) {
          setAddonBusy(false);
          return startCheckout(PRICING.decan.memberSingle.priceId);
        }
        // non-ok but not 409 → still optimistically proceed (network hiccup)
      } catch {
        /* optimistic: proceed regardless */
      }
      setAddonActive(true);
      setTier("D");
      setAddonBusy(false);
      account.refresh();
      if (reading) {
        // Re-derive celestial lines on EXISTING cards — no redraw.
        setReading(rederiveCelestialLines(reading, "D"));
      } else {
        // No reading yet — draw fresh at D tier now.
        setPhase("shuffling");
        setTimeout(() => {
          const result = generateReading({ spreadId, context, tier: "D" });
          setReading(result);
          setPhase("revealed");
          saveReading(result, spreadId, context, "D");
        }, 1300);
      }
      return;
    }
    // No free credits → paid checkout
    startCheckout(PRICING.decan.memberSingle.priceId);
  }

  function draw() {
    setPhase("shuffling");
    setReading(null);
    // Fallback ladder: D → needs decanUnlocked, Z → needs unlockLevel≥1, T always works
    const useTier = canUseTier(tier) ? tier
      : unlockLevel >= 1 ? "Z"
      : "T";
    setTimeout(() => {
      const result = generateReading({ spreadId, context, tier: useTier });
      setReading(result);
      setPhase("revealed");
      // Fire-and-forget save — never blocks the UI
      saveReading(result, spreadId, context, useTier);
    }, 1300);
  }

  // Silently persist Z/D readings. Guests + T tier are skipped server-side.
  function saveReading(result, sid, ctx, t) {
    try {
      fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadId: sid,
          context: ctx,
          tier: t,
          verdict: result.verdict ?? null,
          cards_json: {
            cards: result.cards,
            oracle: result.oracle ?? null,
            interpretation: result.interpretation,
            tone: result.tone ?? null,
          },
        }),
      }).catch(() => {});
    } catch {}
  }

  function selectTier(key) {
    // If the user tries to select D but hasn't activated it yet,
    // kick off activation instead of silently setting a locked tier.
    if (key === "D" && !decanUnlocked) {
      activateAddon();
      return;
    }
    setTier(key);
  }

  if (loading && spreadLocked) {
    return (
      <div className="panel" style={{ padding: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem", color: "var(--brass-bright)" }}>✦</div>
        <p className="muted" style={{ fontFamily: "var(--font-ui)" }}>Resolving your reading…</p>
      </div>
    );
  }

  if (spreadLocked) {
    return (
      <div className="panel" style={{ padding: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
        <h3 style={{ marginBottom: "0.75rem" }}>The Energy Reading is a member unlock</h3>
        <p className="muted" style={{ maxWidth: 460, margin: "0 auto 1.5rem" }}>
          {spread.description}
        </p>
        <Link href="/signup" className="btn btn-lg">Sign up free to unlock →</Link>
      </div>
    );
  }

  const cardCount = spread.cards + (spread.usesOracle ? 1 : 0);
  const showThemeBanner = context && reading && phase === "revealed";

  return (
    <div>
      <TierLadder tier={tier} unlockLevel={unlockLevel} decanUnlocked={decanUnlocked} onSelect={selectTier} />

      <div className="panel" style={{ padding: "1.75rem 2rem", marginBottom: "2rem" }}>
        <label style={labelStyle}>
          Your Question {spread.id === "yes-no" ? "(a yes-or-no question)" : "(optional)"}
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={spread.id === "yes-no" ? "e.g. Should I take the leap?" : "What's on your mind?"}
          style={{
            width: "100%", marginTop: "0.5rem", padding: "0.75rem 1rem",
            background: "var(--bg-deep)", border: "1px solid var(--border)",
            borderRadius: "10px", color: "var(--ink)", fontFamily: "var(--font-body)",
            fontSize: "1rem",
          }}
        />

        {spread.contexts && (
          <div style={{ marginTop: "1.25rem" }}>
            <label style={labelStyle}>Focus Area</label>
            <div style={{ display: "flex", gap: "0.55rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
              {spread.contexts.map((c) => {
                const active = context === c;
                const ICONS = { Love: "♡", Career: "⚙", Fortune: "✦", General: "◎" };
                const icon = ICONS[c] ?? "✦";
                return (
                  <button
                    key={c}
                    onClick={() => setContext(c)}
                    aria-pressed={active}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.45rem 1rem",
                      fontFamily: "var(--font-ui)", fontSize: "0.85rem", letterSpacing: "0.04em",
                      borderRadius: "999px", cursor: "pointer", transition: "all 0.18s ease",
                      background: active
                        ? "linear-gradient(135deg, var(--brass) 0%, var(--brass-bright) 100%)"
                        : "transparent",
                      color: active ? "#1a1408" : "var(--ink-dim)",
                      border: active ? "1px solid var(--brass-bright)" : "1px solid var(--border)",
                      boxShadow: active ? "0 0 12px rgba(212,162,76,0.4)" : "none",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    <span style={{
                      fontSize: "0.88rem",
                      color: active ? "#1a1408" : "var(--brass-bright)",
                      lineHeight: 1,
                    }}>{icon}</span>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button onClick={draw} className="btn btn-lg" style={{ marginTop: "1.5rem" }} disabled={phase === "shuffling"}>
          {phase === "shuffling" ? "Shuffling the deck…" : reading ? "Draw again" : "Draw my cards ✦"}
        </button>
        <span className="muted" style={{ marginLeft: "1rem", fontFamily: "var(--font-ui)", fontSize: "0.8rem" }}>
          Reading at: <strong className="gold-text">{
            decanUnlocked ? LADDER[2].name
            : unlockLevel >= 1 ? LADDER[1].name
            : LADDER[0].name
          }</strong>
        </span>
      </div>

      {/* Decan Engine add-on — show pre-draw for members so they can activate before drawing */}
      {unlockLevel === 1 && !addonActive && phase === "idle" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <DecanAddonCard
            freeCredits={freeCredits}
            busy={addonBusy}
            onActivate={activateAddon}
            onCheckout={startCheckout}
            checkoutBusy={checkoutBusy}
            checkoutError={checkoutError}
          />
        </div>
      )}

      {/* Card display + connected interpretation boxes */}
      {phase !== "idle" && (
        <div className="reading-board">
          {/* Card row */}
          <div className="card-row" style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(cardCount, 4)}, 1fr)`,
            gap: "1.25rem",
          }}>
            {spread.positions.map((pos, i) => (
              <CardSlot
                key={pos.key}
                label={pos.label}
                card={reading?.cards[i]}
                shuffling={phase === "shuffling"}
                delay={i * 150}
              />
            ))}
            {spread.usesOracle && (
              <OracleSlot oracle={reading?.oracle} shuffling={phase === "shuffling"} delay={spread.cards * 150} />
            )}
          </div>

          {/* Connector lines (visual) */}
          {reading && phase === "revealed" && (
            <div className="connector-row" style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(cardCount, 4)}, 1fr)`,
              gap: "1.25rem",
            }}>
              {Array.from({ length: cardCount }).map((_, i) => (
                <div key={i} className="connector-line" />
              ))}
            </div>
          )}

          {/* Interpretation boxes — one per card, connected visually */}
          {reading && phase === "revealed" && (
            <div className="interp-row" style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(cardCount, 4)}, 1fr)`,
              gap: "1.25rem",
            }}>
              {reading.interpretation
                .filter((line) => !line.position.includes("Astral Threads"))
                .map((line, i) => {
                  const card = reading.cards[i];
                  return (
                    <InterpBox
                      key={i}
                      line={line}
                      card={card}
                      celestialLines={card?.celestialLines}
                    />
                  );
                })}
              {reading.oracle && (
                <OracleInterpBox oracle={reading.oracle} />
              )}
            </div>
          )}

          {/* Summary panel below the connected boxes */}
          {reading && phase === "revealed" && (
            <div className="panel" style={{ padding: "2rem", marginTop: "2rem" }}>
              {/* Theme banner — single sentence at top, no per-card repetition */}
              {showThemeBanner && (
                <div className="theme-banner">
                  <span className="theme-banner-label">✦ Your Focus</span>
                  <p>This reading is held in the context of <strong className="gold-text">{context}</strong>. Every card below speaks to that theme — you don't need to weigh it separately for each position.</p>
                </div>
              )}

              {reading.verdict && (
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <div className="eyebrow">The Verdict</div>
                  <div className="gold-text" style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 700 }}>
                    {reading.verdict}
                  </div>
                </div>
              )}

              {/* Reading-level celestial weather */}
              {reading.tone && (
                <div className="weather-box">
                  <div className="weather-label">✦ Astral Weather</div>
                  <p>{reading.tone.text}</p>
                </div>
              )}

              {/* Guest → sign up for the Astral Threads layer */}
              {unlockLevel === 0 && (
                <>
                  <div className="divider" style={{ margin: "1.5rem 0" }} />
                  <UpsellStrip unlockLevel={0} />
                </>
              )}

              {/* Member who hasn't unlocked the Decan Engine this reading → add-on card */}
              {unlockLevel === 1 && !addonActive && (
                <>
                  <div className="divider" style={{ margin: "1.5rem 0" }} />
                  <DecanAddonCard
                    freeCredits={freeCredits}
                    busy={addonBusy}
                    onActivate={activateAddon}
                    onCheckout={startCheckout}
                    checkoutBusy={checkoutBusy}
                    checkoutError={checkoutError}
                  />
                </>
              )}

              {/* Anyone now reading at the Decan Engine layer */}
              {decanUnlocked && (
                <>
                  <div className="divider" style={{ margin: "1.5rem 0" }} />
                  <p className="muted" style={{ fontSize: "0.85rem", fontFamily: "var(--font-ui)" }}>
                    ✦ You&apos;re reading at <strong className="gold-text">The Decan Engine</strong> — the exact 10° degree behind every card.
                    {addonActive && unlockLevel < 2 && " (Unlocked for this reading.)"} Readings are for reflection & entertainment.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Interpretation box that sits below each card, connected by a line ---
function InterpBox({ line, card, celestialLines }) {
  return (
    <div className="interp-box">
      <div className="interp-position">
        {line.position} — <span className="interp-card-name">{line.card}</span>
      </div>
      <p className="interp-text">{line.text.replace(/^[^.]*\.\s*/, "")}</p>

      {/* Astral Threads layers (Z / D) for this card */}
      {celestialLines?.map((cl, j) => (
        <CelestialLine key={j} line={cl} />
      ))}
    </div>
  );
}

// --- Oracle interpretation box ---
function OracleInterpBox({ oracle }) {
  return (
    <div className="interp-box oracle-interp-box">
      <div className="interp-position">
        Astral Threads Clarifier — <span className="interp-card-name">{oracle.sign} · {oracle.keyword}</span>
      </div>
      <p className="interp-text">{oracle.energy} {oracle.clarifier}</p>
    </div>
  );
}

// --- Classic / Astral Threads / Decan Engine ladder selector ---
function TierLadder({ tier, unlockLevel, decanUnlocked, onSelect }) {
  const levelOf = { T: 0, Z: 1, D: 2 };
  return (
    <div className="tier-ladder" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
      {LADDER.map((l) => {
        const unlocked = l.key === "D" ? decanUnlocked : levelOf[l.key] <= unlockLevel;
        const active = tier === l.key;
        return (
          <button
            key={l.key}
            onClick={() => onSelect(l.key)}
            title={l.tip}
            style={{
              textAlign: "left", cursor: "pointer", position: "relative",
              padding: "0.85rem 1rem", borderRadius: "12px",
              border: `1px solid ${active ? "var(--brass-bright)" : unlocked ? "var(--brass)" : "var(--border)"}`,
              background: active ? "rgba(212,162,76,0.12)" : "var(--panel)",
              boxShadow: active ? "var(--glow-brass)" : "none",
              opacity: unlocked ? 1 : 0.72,
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: l.key === "D" ? "0.95rem" : "1.05rem", color: unlocked ? "var(--brass-bright)" : "var(--ink-dim)", lineHeight: 1.1 }}>
                {l.name}
              </span>
              <span style={{ fontSize: "0.85rem" }}>{unlocked ? "✦" : "🔒"}</span>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "var(--ink-dim)", marginTop: "0.2rem" }}>
              {l.sub}
            </div>
            {!unlocked && (
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.68rem", color: "var(--arcane)", marginTop: "0.35rem", letterSpacing: "0.06em" }}>
                {l.key === "Z" ? "Sign up to unlock" : "Add on or subscribe"}
              </div>
            )}
            <span className="tier-tip" style={{
              position: "absolute", left: "50%", bottom: "calc(100% + 8px)", transform: "translateX(-50%)",
              width: "220px", padding: "0.6rem 0.75rem", borderRadius: "10px",
              background: "var(--bg-deep)", border: "1px solid var(--brass)", boxShadow: "var(--glow-brass)",
              fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--ink)", lineHeight: 1.35,
              opacity: 0, visibility: "hidden", transition: "opacity 0.18s ease", pointerEvents: "none", zIndex: 20,
            }}>
              {l.tip}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// --- A single celestial (Z or D) line under a card ---
function CelestialLine({ line }) {
  const isD = line.tier === "D";
  return (
    <div style={{
      marginTop: "0.6rem", marginLeft: "0.25rem",
      paddingLeft: "0.85rem",
      borderLeft: `2px solid ${isD ? "var(--brass)" : "var(--arcane)"}`,
    }}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: isD ? "var(--brass-bright)" : "var(--arcane)", marginBottom: "0.1rem" }}>
        {isD ? "✦ The Decan Engine" : "✦ Astral Threads"} · {line.label}
      </div>
      {isD && line.image && (
        <div style={{ margin: "0.5rem 0 0.4rem", display: "flex", justifyContent: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(line.image)}
            alt={line.title ? `Decan art: ${line.title}` : "Decan card art"}
            style={{
              width: "180px", height: "auto", borderRadius: "10px",
              border: "1px solid var(--brass)", boxShadow: "var(--glow-brass)",
              objectFit: "cover", display: "block",
            }}
          />
        </div>
      )}
      {isD && line.title && (
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--brass-bright)", lineHeight: 1.2, marginBottom: "0.15rem" }}>
          {line.title}
        </div>
      )}
      <p style={{ color: "var(--ink-dim)", fontSize: "0.88rem", margin: 0 }}>{line.text}</p>
    </div>
  );
}

// --- Guest upsell ---
function UpsellStrip() {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "var(--ink)", marginBottom: "0.35rem" }}>
        <strong className="gold-text">There&apos;s more beneath these cards.</strong>
      </p>
      <p className="muted" style={{ fontSize: "0.88rem", maxWidth: 520, margin: "0 auto 1rem" }}>
        Every card sits at a celestial address. Sign up free to unlock the <strong>Astral Threads</strong> layer — each card&apos;s sign & ruling planet — then power up <strong>The Decan Engine</strong> to reveal the exact 10° degree behind it.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/signup" className="btn btn-lg">Sign up free →</Link>
        <Link href="/guide" className="btn" style={{ background: "transparent", border: "1px solid var(--arcane)", color: "var(--arcane)" }}>
          How does this work?
        </Link>
      </div>
    </div>
  );
}

// --- Decan Engine add-on card ---
function DecanAddonCard({ freeCredits, busy, onActivate, onCheckout, checkoutBusy, checkoutError }) {
  const hasFree = freeCredits > 0;
  return (
    <div style={{
      border: "1px solid var(--brass)", borderRadius: "14px",
      padding: "1.4rem 1.5rem", background: "rgba(212,162,76,0.06)",
      boxShadow: "var(--glow-brass)", textAlign: "center",
    }}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brass-bright)", marginBottom: "0.4rem" }}>
        ⚙ Power up
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "var(--brass-bright)", marginBottom: "0.4rem" }}>
        The Decan Engine
      </div>
      <p className="muted" style={{ fontSize: "0.88rem", maxWidth: 500, margin: "0 auto 1.1rem" }}>
        Add the exact 10° celestial degree behind every card to <strong>this reading</strong> — your cards stay the same, only the depth layer changes. Each numbered card resolves to a named decan, its ruling planet, and its calendar window.
      </p>

      <button onClick={onActivate} className="btn btn-lg" disabled={busy || checkoutBusy}>
        {busy
          ? "Engaging the engine…"
          : checkoutBusy
            ? "Redirecting to checkout…"
            : hasFree
              ? "Use my free monthly add-on ✦"
              : `Unlock for this reading — $${DECAN_ADDON.memberPrice}`}
      </button>

      <div style={{ marginTop: "0.9rem", display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => onCheckout(PRICING.decan.pack3.priceId)}
          className="btn"
          disabled={checkoutBusy}
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", background: "transparent", border: "1px solid var(--brass)", color: "var(--brass-bright)" }}
        >
          3-pack — $5 (3 readings)
        </button>
        <Link
          href="/subscribe"
          className="btn"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", background: "transparent", border: "1px solid var(--arcane)", color: "var(--arcane)" }}
        >
          Subscribe — $6.99/mo or $49/yr
        </Link>
      </div>

      {checkoutError && (
        <p style={{ marginTop: "0.7rem", color: "var(--rose)", fontSize: "0.82rem" }}>{checkoutError}</p>
      )}

      <div style={{ marginTop: "0.9rem", fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "var(--ink-dim)" }}>
        {hasFree ? (
          <>You have <strong className="gold-text">{freeCredits}</strong> decan credit{freeCredits === 1 ? "" : "s"} available · member price <strong>${DECAN_ADDON.memberPrice}</strong> after (list ${DECAN_ADDON.listPrice})</>
        ) : (
          <>Member price <strong className="gold-text">${DECAN_ADDON.memberPrice}</strong> (list ${DECAN_ADDON.listPrice}) · 3-pack saves you $1</>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: "var(--font-ui)", fontSize: "0.8rem", letterSpacing: "0.1em",
  textTransform: "uppercase", color: "var(--arcane)",
};

function CardSlot({ label, card, shuffling, delay }) {
  const revealed = card && !shuffling;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        aspectRatio: "2/3",
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${revealed ? "var(--brass-bright)" : "var(--brass)"}`,
        boxShadow: revealed ? "var(--glow-brass)" : "0 4px 20px rgba(0,0,0,0.5)",
        position: "relative",
        background: "var(--bg-deep)",
        animation: shuffling ? "pulse 0.9s ease-in-out infinite" : `float 0.5s ease ${delay}ms both`,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}>
        {revealed ? (
          card.image ? (
            /* ── Card image with overlay badges ── */
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(card.image)}
                alt={card.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  transform: card.reversed ? "rotate(180deg)" : "none",
                  transition: "transform 0.4s ease",
                }}
              />
              {/* Name overlay at bottom */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1.5rem 0.6rem 0.5rem",
                background: "linear-gradient(to top, rgba(10,8,20,0.92) 0%, transparent 100%)",
                textAlign: "center",
              }}>
                {card.celestial?.glyph && (
                  <div style={{ fontSize: "1rem", color: "var(--arcane)", lineHeight: 1, marginBottom: "0.15rem" }}>
                    {card.celestial.glyph}
                  </div>
                )}
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(0.78rem, 1.4vw, 0.98rem)",
                  color: "var(--brass-bright)",
                  lineHeight: 1.2,
                  letterSpacing: "0.02em",
                }}>
                  {card.name}
                </div>
                {card.reversed && (
                  <div style={{
                    fontSize: "0.6rem",
                    color: "var(--rose)",
                    fontFamily: "var(--font-ui)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "0.15rem",
                  }}>
                    ↺ Reversed
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Fallback text layout (no image) ── */
            <div style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "0.85rem 0.75rem",
              background: "linear-gradient(180deg, rgba(212,162,76,0.06) 0%, var(--bg-deep) 40%)",
            }}>
              {/* Top — glyph */}
              <div style={{ textAlign: "center" }}>
                {card.celestial?.glyph && (
                  <div style={{ fontSize: "1.4rem", color: "var(--arcane)", lineHeight: 1 }}>
                    {card.celestial.glyph}
                  </div>
                )}
              </div>

              {/* Middle — card name */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(0.82rem, 1.6vw, 1.05rem)",
                  color: "var(--brass-bright)",
                  lineHeight: 1.25,
                  letterSpacing: "0.02em",
                }}>
                  {card.name}
                </div>
                {card.reversed && (
                  <div style={{
                    fontSize: "0.62rem",
                    color: "var(--rose)",
                    fontFamily: "var(--font-ui)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "0.3rem",
                  }}>
                    ↺ Reversed
                  </div>
                )}
              </div>

              {/* Bottom — meaning snippet */}
              <div style={{
                fontSize: "clamp(0.68rem, 1.2vw, 0.78rem)",
                color: "var(--ink-dim)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.45,
                textAlign: "center",
                borderTop: "1px solid rgba(212,162,76,0.2)",
                paddingTop: "0.5rem",
              }}>
                {(card.reversed ? card.reversedMeaning : card.upright).slice(0, 80)}
                {(card.reversed ? card.reversedMeaning : card.upright).length > 80 ? "…" : ""}
              </div>
            </div>
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset("/oracle/card-back.png")}
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        )}
      </div>
      <div style={{
        marginTop: "0.6rem",
        fontFamily: "var(--font-ui)",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--ink-dim)",
      }}>
        {label}
      </div>
    </div>
  );
}

function OracleSlot({ oracle, shuffling, delay }) {
  const revealed = oracle && !shuffling;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        aspectRatio: "2/3",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--arcane)",
        boxShadow: "var(--glow-arcane)",
        position: "relative",
        background: "var(--bg-deep)",
        animation: shuffling ? "pulse 0.9s ease-in-out infinite" : `float 0.5s ease ${delay}ms both`,
      }}>
        {revealed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(oracle.image)}
            alt={`${oracle.sign} — ${oracle.keyword}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset("/oracle/card-back.png")}
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        )}
      </div>
      <div style={{
        marginTop: "0.6rem",
        fontFamily: "var(--font-ui)",
        fontSize: "0.78rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--arcane)",
      }}>
        Astral Threads
      </div>
      {revealed && (
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.82rem",
          color: "var(--brass-bright)",
          marginTop: "0.2rem",
        }}>
          {oracle.sign} · {oracle.keyword}
        </div>
      )}
    </div>
  );
}
