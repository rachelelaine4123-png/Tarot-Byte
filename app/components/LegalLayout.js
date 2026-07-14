import Nav from "../components/Nav";
import Footer from "../components/Footer";

// Reusable legal document layout — renders long-form legal text with the
// site's steampunk-cosmic aesthetic. Pass children as the prose content.
export default function LegalLayout({ title, subtitle, lastUpdated, children }) {
  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 780, paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="eyebrow">TarotByte</div>
          <h1 style={{ fontSize: "2.4rem", margin: "0.5rem 0" }}>{title}</h1>
          {subtitle && <p className="muted" style={{ maxWidth: 540, margin: "0 auto" }}>{subtitle}</p>}
          {lastUpdated && (
            <p className="muted" style={{ fontSize: "0.78rem", fontFamily: "var(--font-ui)", marginTop: "0.75rem" }}>
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        <div className="panel" style={{ padding: "2.5rem 3rem" }}>
          <div className="legal-prose">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
