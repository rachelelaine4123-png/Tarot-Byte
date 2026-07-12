"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateReading, SPREADS } from "@/lib/readingEngine";
import { asset } from "@/lib/asset";
import { useAccount } from "@/lib/useAccount";

const ZODIAC_GLYPH = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

// The T / Z / D ladder definition — steampunk-flavoured tier names with hover tooltips.
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
    name: "Celestial",
    sub: "Each card's sign & planet",
    tip: "Each card's zodiac sign & ruling planet, layered over the classic meaning.",
    need: "member",
  },
  {
    key: "D",
    name: "The Decan Engine",
    sub: "The exact 10° celestial degree",
    tip: "The exact 10° celestial degree behind every card — the deepest, most precise layer TarotByte offers.",
    need: "subscriber",
  },
];

// Add-on economics for the Decan Engine (à la carte + member perks). Stripe stubbed for now.
const DECAN_ADDON = {
  listPrice: 4,        // à la carte, USD
  memberPrice: 2,      // member discount price, USD
  memberFreePerMonth: 1, // members get one free Decan add-on each month
};

export default function Reading({ spreadId, locked = false }) {
  const spread = SPREADS[spreadId];
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState(spread.contexts ? spread.contexts[0] : null);
  const [tier, setTier] = useState("T");
  const [reading, setReading] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | shuffling | revealed

  // Account state from Supabase (primary source of truth).
  const account = useAccount();
  const loading = account.loading;

  // Add-on state (per-reading Decan Engine unlock for MEMBERS who aren't full subscribers).
  const [addonActive, setAddonActive] = useState(false);   // Decan Engine unlocked for THIS reading
  const [addonBusy, setAddonBusy] = useState(false);         // "charging" spinner (Stripe stub)

  // unlockLevel: real account (0/1/2) is the source of truth. The ?unlocked= query
  // param is kept ONLY as a preview fallback so the demo links on /signup still work
  // when no account is signed in. Real account always wins over the demo param.
  const [previewLevel, setPreviewLevel] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const u = params.get("unlocked");
      if (u === "1") setPreviewLevel(1);
      if (u === "2") setPreviewLevel(2);
    }
  }, []);

  const unlockLevel =
    !loading && account.signedIn ? account.unlockLevel : previewLevel;
  const freeCredits =
    !loading && account.signedIn ? account.freeDecanCredits : previewLevel === 1 ? DECAN_ADDON.memberFreePerMonth : 0;

  const spreadLocked = locked && unlockLevel < 1;

  // Effective D access = full subscriber (level 2) OR member who unlocked the add-on this reading.
  const decanUnlocked = unlockLevel >= 2 || addonActive;

  function canUseTier(key) {
    if (key === "T") return true;
    if (key === "Z") return unlockLevel >= 1;
    if (key === "D") return decanUnlocked;
    return false;
  }

  // Member unlocks the Decan Engine for THIS reading — uses a free credit if available,
  // otherwise "charges" the member price. Stripe is stubbed for now; the free-credit
  // decrement is synced to Supabase so it persists across sessions.
  async function activateAddon() {
    setAddonBusy(true);
    // If they have a free credit, burn it on the server so the count persists.
    if (account.signedIn && freeCredits > 0) {
      try {
        await fetch("/api/decan/addon", { method: "POST" });
      } catch {
        /* optimistic: proceed regardless */
      }
    }
    setTimeout(() => {
      setAddonActive(true);
      setTier("D"); // jump them straight into the deepest layer
      setAddonBusy(false);
      // Re-sync account state (free credits may have changed) + re-run the reading at D tier.
      account.refresh();
      if (reading) {
        const result = generateReading({ spreadId, context, tier: "D" });
        setReading(result);
      }
    }, 1100);
  }

  function draw() {
    setPhase("shuffling");
    setReading(null);
    const useTier = canUseTier(tier) ? tier : "T";
    setTimeout(() => {
      const result = generateReading({ spreadId, context, tier: useTier });
      setReading(result);
      setPhase("revealed");
    }, 1300);
  }

  // If someone picks a tier they can't use, snap the draw back to what they can.
  function selectTier(key) {
    setTier(key);
  }

  // While we're resolving the account, don't flash a locked screen to a signed-in member.
  if (loading && spreadLocked) {
    return (
      <div className="panel" style={{ padding: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem", color: "var(--brass-bright)" }}>\u2726</div>
        <p className="muted" style={{ fontFamily: "var(--font-ui)" }}>Resolving your reading\u2026</p>
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

  return (
    <div>
      {/* --- Classic / Celestial / Decan Engine Ladder --- */}
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
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              {spread.contexts.map((c) => (
                <button
                  key={c}
                  onClick={() => setContext(c)}
                  className="btn"
                  style={{
                    padding: "0.5rem 1.1rem", fontSize: "0.85rem",
                    background: context === c ? undefined : "transparent",
                    color: context === c ? undefined : "var(--ink-dim)",
                    border: context === c ? undefined : "1px solid var(--border)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={draw} className="btn btn-lg" style={{ marginTop: "1.5rem" }} disabled={phase === "shuffling"}>
          {phase === "shuffling" ? "Shuffling the deck…" : reading ? "Draw again" : "Draw my cards ✦"}
        </button>
        <span className="muted" style={{ marginLeft: "1rem", fontFamily: "var(--font-ui)", fontSize: "0.8rem" }}>
          Reading at: <strong className="gold-text">{LADDER.find(l => l.key === (canUseTier(tier) ? tier : "T")).name}</strong>
        </span>
      </div>

      {/* Card display */}
      {phase !== "idle" && (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(spread.cards + (spread.usesOracle ? 1 : 0), 4)}, 1fr)`,
            gap: "1.25rem", marginBottom: "2rem",
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

          {reading && phase === "revealed" && (
            <div className="panel" style={{ padding: "2rem" }}>
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
                <div style={{
                  border: "1px solid var(--arcane)", borderRadius: "12px",
                  padding: "0.9rem 1.1rem", marginBottom: "1.5rem",
                  background: "rgba(92,225,230,0.06)",
                }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--arcane)", marginBottom: "0.25rem" }}>
                    ✦ Celestial Weather
                  </div>
                  <p style={{ color: "var(--ink)", fontSize: "0.92rem", margin: 0 }}>{reading.tone.text}</p>
                </div>
              )}

              <h3 style={{ marginBottom: "1.25rem" }}>Your Reading</h3>
              {reading.interpretation
                .filter((line) => !line.position.includes("Astral Threads")) // oracle handled below
                .map((line, i) => {
                  const card = reading.cards[i];
                  return (
                    <div key={i} style={{ marginBottom: "1.4rem" }}>
                      <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--arcane)", marginBottom: "0.15rem" }}>
                        {line.position} — <span style={{ color: "var(--brass-bright)" }}>{line.card}</span>
                      </div>
                      <p style={{ color: "var(--ink)" }}>{line.text.replace(/^[^.]*\.\s*/, "")}</p>

                      {/* Celestial layers (Z / D) for this card */}
                      {card?.celestialLines?.map((cl, j) => (
                        <CelestialLine key={j} line={cl} />
                      ))}
                    </div>
                  );
                })}

              {/* Oracle clarifier (energy reading only) */}
              {reading.oracle && (
                <div style={{ marginBottom: "1.1rem" }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--arcane)", marginBottom: "0.15rem" }}>
                    Astral Threads Clarifier — <span style={{ color: "var(--brass-bright)" }}>{reading.oracle.sign} · {reading.oracle.keyword}</span>
                  </div>
                  <p style={{ color: "var(--ink)" }}>{reading.oracle.energy} {reading.oracle.clarifier}</p>
                </div>
              )}

              {/* Guest → sign up for the Celestial layer */}
              {unlockLevel === 0 && (
                <>
                  <div className="divider" style={{ margin: "1.5rem 0" }} />
                  <UpsellStrip unlockLevel={0} />
                </>
              )}

              {/* Member (Celestial) who hasn't unlocked the Decan Engine this reading → add-on card */}
              {unlockLevel === 1 && !addonActive && (
                <>
                  <div className="divider" style={{ margin: "1.5rem 0" }} />
                  <DecanAddonCard
                    freeCredits={freeCredits}
                    busy={addonBusy}
                    onActivate={activateAddon}
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

// --- Classic / Celestial / Decan Engine ladder selector (with hover tooltips) ---
function TierLadder({ tier, unlockLevel, decanUnlocked, onSelect }) {
  const levelOf = { T: 0, Z: 1, D: 2 };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
      {LADDER.map((l) => {
        // D is "unlocked" if they're a subscriber OR have activated the per-reading add-on.
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
            {/* hover tooltip (steampunk brass card) */}
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
        {isD ? "✦ The Decan Engine" : "✦ Celestial"} · {line.label}
      </div>
      {/* Decan title — ownable TarotByte IP, the name of this 10° degree */}
      {isD && line.title && (
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--brass-bright)", lineHeight: 1.2, marginBottom: "0.15rem" }}>
          {line.title}
        </div>
      )}
      <p style={{ color: "var(--ink-dim)", fontSize: "0.88rem", margin: 0 }}>{line.text}</p>
    </div>
  );
}

// --- Guest upsell: sign up free to unlock the Celestial layer ---
function UpsellStrip() {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "var(--ink)", marginBottom: "0.35rem" }}>
        <strong className="gold-text">There&apos;s more beneath these cards.</strong>
      </p>
      <p className="muted" style={{ fontSize: "0.88rem", maxWidth: 520, margin: "0 auto 1rem" }}>
        Every card sits at a celestial address. Sign up free to unlock the <strong>Celestial layer</strong> — each card&apos;s sign & ruling planet — then power up <strong>The Decan Engine</strong> to reveal the exact 10° degree behind it.
      </p>
      <Link href="/signup" className="btn btn-lg">Sign up free → unlock the Celestial layer</Link>
    </div>
  );
}

// --- Decan Engine add-on card (shown to members who haven't unlocked it this reading) ---
function DecanAddonCard({ freeCredits, busy, onActivate }) {
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
        Add the exact 10° celestial degree behind every card to <strong>this reading</strong> — each numbered card resolves to a named decan, its ruling planet, and its calendar window.
      </p>

      <button onClick={onActivate} className="btn btn-lg" disabled={busy}>
        {busy
          ? "Engaging the engine…"
          : hasFree
            ? "Use my free monthly add-on ✦"
            : `Unlock for this reading — $${DECAN_ADDON.memberPrice}`}
      </button>

      <div style={{ marginTop: "0.9rem", fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "var(--ink-dim)" }}>
        {hasFree ? (
          <>You have <strong className="gold-text">{freeCredits}</strong> free member add-on{freeCredits === 1 ? "" : "s"} this month · member price <strong>${DECAN_ADDON.memberPrice}</strong> after (list ${DECAN_ADDON.listPrice})</>
        ) : (
          <>Member price <strong className="gold-text">${DECAN_ADDON.memberPrice}</strong> (list ${DECAN_ADDON.listPrice}) · or <Link href="/signup?upgrade=decan">subscribe</Link> for unlimited Decan readings</>
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
        aspectRatio: "0.57", borderRadius: "12px", overflow: "hidden",
        border: "1px solid var(--brass)", boxShadow: "var(--glow-brass)",
        position: "relative", background: "var(--bg-deep)",
        animation: shuffling ? "pulse 0.9s ease-in-out infinite" : `float 0.5s ease ${delay}ms both`,
      }}>
        {revealed ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0.75rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--brass-bright)", lineHeight: 1.2 }}>
              {card.name}
            </div>
            {card.reversed && (
              <div style={{ fontSize: "0.7rem", color: "var(--rose)", fontFamily: "var(--font-ui)", letterSpacing: "0.1em", marginTop: "0.35rem" }}>
                ⟲ REVERSED
              </div>
            )}
            {card.celestial?.glyph && (
              <div style={{ fontSize: "1.1rem", color: "var(--arcane)", marginTop: "0.4rem" }}>
                {card.celestial.glyph}
              </div>
            )}
            <div style={{ fontSize: "0.8rem", color: "var(--ink-dim)", marginTop: "0.5rem", fontFamily: "var(--font-body)" }}>
              {card.reversed ? card.reversedMeaning : card.upright}
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset("/oracle/card-back.png")} alt="card back" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div style={{ marginTop: "0.6rem", fontFamily: "var(--font-ui)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
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
        aspectRatio: "0.57", borderRadius: "12px", overflow: "hidden",
        border: "1px solid var(--arcane)", boxShadow: "var(--glow-arcane)",
        position: "relative", background: "var(--bg-deep)",
        animation: shuffling ? "pulse 0.9s ease-in-out infinite" : `float 0.5s ease ${delay}ms both`,
      }}>
        {revealed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(oracle.image)} alt={oracle.sign} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset("/oracle/card-back.png")} alt="card back" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div style={{ marginTop: "0.6rem", fontFamily: "var(--font-ui)", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--arcane)" }}>
        Astral Threads
      </div>
    </div>
  );
}
