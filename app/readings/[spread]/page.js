import Nav from "../../components/Nav";
import Reading from "../../components/Reading";
import Link from "next/link";
import { SPREADS } from "@/lib/readingEngine";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(SPREADS).map((spread) => ({ spread }));
}

export async function generateMetadata({ params }) {
  const { spread: spreadId } = await params;
  const spread = SPREADS[spreadId];
  if (!spread) return {};
  const desc = spread.description || "A TarotByte tarot reading with a celestial twist.";
  return {
    title: `${spread.name} — Free Tarot Reading`,
    description: desc,
    alternates: { canonical: `https://www.tarotbyte.app/readings/${spreadId}` },
    openGraph: {
      title: `${spread.name} — TarotByte`,
      description: desc,
      url: `https://www.tarotbyte.app/readings/${spreadId}`,
    },
  };
}

export default async function SpreadPage({ params }) {
  const { spread: spreadId } = await params;
  const spread = SPREADS[spreadId];
  if (!spread) notFound();

  // Lock state for member spreads is resolved client-side (reads ?unlocked=1),
  // so the whole route can be statically exported.
  const locked = spread.tier === "member";

  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 820, paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <Link href="/readings" className="muted" style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem" }}>← All readings</Link>
        <div style={{ textAlign: "center", margin: "1.5rem 0 2rem" }}>
          <div className="eyebrow">{spread.tier === "free" ? "Free reading" : "Member reading"}</div>
          <h1 style={{ fontSize: "2.6rem", margin: "0.5rem 0" }}>{spread.name}</h1>
          <p className="muted" style={{ maxWidth: 560, margin: "0 auto" }}>{spread.description}</p>
        </div>
        <Reading spreadId={spreadId} locked={locked} />
      </main>
    </>
  );
}
