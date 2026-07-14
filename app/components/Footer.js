import Link from "next/link";

// Site footer — appears on every page via the layout.
// Legal links, quick nav, and the entertainment disclaimer (important for a
// tarot product — keeps the "for reflection & entertainment" framing visible).
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <div className="footer-brand">
            Tarot<span className="gold-text">Byte</span>
          </div>
          <p className="footer-tag">
            Free tarot readings with a celestial twist. Bite-sized wisdom for the modern seeker.
          </p>
        </div>

        <div className="footer-col">
          <h4>Readings</h4>
          <Link href="/readings">All readings</Link>
          <Link href="/readings/yes-no">Yes / No</Link>
          <Link href="/readings/past-present-future">Past · Present · Future</Link>
          <Link href="/readings/energy-reading">Energy Reading</Link>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link href="/oracle">Astral Threads</Link>
          <Link href="/subscribe">Subscribe</Link>
          <Link href="/signup">Sign up free</Link>
          <Link href="/signin">Sign in</Link>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="mailto:hello@tarotbyte.app">hello@tarotbyte.app</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="disclaimer">
          © {year} TarotByte. Readings are for reflection &amp; entertainment purposes only.
        </span>
        <span>Made with ✦ &amp; clockwork.</span>
      </div>
    </footer>
  );
}
