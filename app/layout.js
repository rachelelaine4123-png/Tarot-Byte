import "./globals.css";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL("https://www.tarotbyte.app"),
  title: {
    default: "TarotByte — Digital Tarot with a Celestial Twist",
    template: "%s — TarotByte",
  },
  description:
    "Free tarot readings, an original astrology-powered Astral Threads deck, and your signature Energy Reading. Bite-sized wisdom for the modern seeker.",
  keywords: [
    "tarot", "free tarot reading", "online tarot", "astrology tarot",
    "decan", "zodiac tarot", "celestial tarot", "astral threads",
    "yes no tarot", "past present future tarot", "energy reading",
  ],
  authors: [{ name: "TarotByte" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tarotbyte.app",
    siteName: "TarotByte",
    title: "TarotByte — Digital Tarot with a Celestial Twist",
    description:
      "Free tarot readings with a celestial twist. An original astrology-powered Astral Threads deck and your signature Energy Reading.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TarotByte — Digital Tarot with a Celestial Twist",
    description:
      "Free tarot readings with a celestial twist. Bite-sized wisdom for the modern seeker.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0a0913",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Spectral:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
