import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How TarotByte collects, uses, and protects your data — account information, reading history, email, and payment processing.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" subtitle="Your data, your readings, your privacy." lastUpdated="July 2025">
      <p>
        TarotByte (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website
        <a href="https://www.tarotbyte.app"> tarotbyte.app</a> and the TarotByte reading platform. This
        Privacy Policy explains what information we collect, how we use it, and the choices you have. By
        creating an account or using our readings, you agree to the practices described here.
      </p>

      <div className="legal-callout">
        <p><strong>The short version:</strong> We collect the minimum needed to run your account and readings — your email, your reading history, and (if you pay) Stripe-processed payment details. We never sell your data. You can delete your account and all associated data at any time by emailing us.</p>
      </div>

      <h2>1. Information We Collect</h2>

      <h3>Account information</h3>
      <p>When you sign up, we collect your email address and a password (stored as a secure hash, never in plain text). We use Supabase for authentication, which manages credentials on our behalf. Your email is used to confirm your account, send you reading-related notifications, and deliver The Weekly Byte newsletter if you opt in.</p>

      <h3>Reading history</h3>
      <p>The questions you ask, the cards you draw, and the interpretations generated are stored so you can revisit past readings from your account. This data is tied to your account and is not visible to other users. We may use anonymized, aggregated reading data (e.g., &ldquo;the most drawn card this month&rdquo;) for marketing or product insights, but never in a way that identifies you.</p>

      <h3>Payment information</h3>
      <p>If you purchase a Decan Engine add-on or subscribe, payment is processed by Stripe. We never see or store your full card number, CVV, or other raw payment details — Stripe handles that securely. We receive your Stripe customer ID, subscription status, and the email associated with your payment method so we can link your purchase to your TarotByte account and fulfill your order.</p>

      <h3>Technical data</h3>
      <p>Like most websites, we automatically collect basic technical information: your IP address, browser type, device type, and pages visited. This is used for security, abuse prevention, and understanding how the site is used in aggregate. We may use analytics tools to measure traffic patterns; any such tools are configured to respect do-not-track signals where applicable.</p>

      <h3>Email marketing</h3>
      <p>If you opt in to The Weekly Byte newsletter, we will send you periodic emails with tarot insights and product updates. You can unsubscribe at any time via the link in every email. Transactional emails (account confirmation, payment receipts) are sent regardless of newsletter preference and are necessary for the service to function.</p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To create and manage your account and authenticate your sessions</li>
        <li>To generate, store, and display your tarot readings</li>
        <li>To process payments and manage subscriptions and add-on credits</li>
        <li>To send transactional emails (confirmation links, receipts, security notices)</li>
        <li>To send The Weekly Byte newsletter if you have opted in</li>
        <li>To prevent fraud, abuse, and unauthorized access</li>
        <li>To improve our readings, features, and user experience in aggregate</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p><strong>We do not sell your personal data.</strong> We share information only with the service providers that power TarotByte, and only as necessary to operate the platform:</p>
      <ul>
        <li><strong>Supabase</strong> — authentication, account data, and reading history storage (servers in the United States / region you select)</li>
        <li><strong>Stripe</strong> — payment processing and subscription management</li>
        <li><strong>Resend</strong> — transactional and newsletter email delivery</li>
        <li><strong>Vercel</strong> — website hosting and content delivery</li>
      </ul>
      <p>We may disclose information if required by law, court order, or to protect our rights, your safety, or the safety of others. In the event of a merger, acquisition, or asset sale, user data may be transferred as a business asset, and we would notify you before that happens.</p>

      <h2>4. Data Retention</h2>
      <p>We retain your account data and reading history for as long as your account is active. If you delete your account, we will remove your personal data from our active systems within 30 days, except where retention is required by law (e.g., financial records related to payments). Stripe retains payment records according to its own policies and applicable financial regulations.</p>

      <h2>5. Your Privacy Rights</h2>
      <p>Depending on your location (particularly if you are in the EU, UK, California, or other jurisdictions with privacy laws), you may have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Correct</strong> inaccurate or incomplete data</li>
        <li><strong>Delete</strong> your account and associated data</li>
        <li><strong>Export</strong> a copy of your data in a portable format</li>
        <li><strong>Object to</strong> or restrict certain processing</li>
        <li><strong>Withdraw consent</strong> for marketing emails at any time</li>
      </ul>
      <p>To exercise any of these rights, email <a href="mailto:hello@tarotbyte.app">hello@tarotbyte.app</a>. We will respond within 30 days. You can also delete your account directly through the Supabase auth flow or by contacting us.</p>

      <h2>6. Cookies</h2>
      <p>TarotByte uses essential cookies to maintain your authenticated session. These cookies allow you to stay signed in between page loads and are necessary for the service to function. We do not use third-party advertising cookies. If we add analytics cookies in the future, we will update this policy and provide appropriate consent mechanisms.</p>

      <h2>7. Data Security</h2>
      <p>We take reasonable measures to protect your data. Authentication is handled by Supabase using industry-standard practices. Payment data is handled by Stripe, which is PCI-DSS compliant. Our service role keys and API secrets are stored as environment variables and never exposed to the browser. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

      <h2>8. Children&rsquo;s Privacy</h2>
      <p>TarotByte is not directed at children under 13 (or the minimum age in your jurisdiction). We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will promptly delete it.</p>

      <h2>9. International Users</h2>
      <p>TarotByte is hosted in the United States. If you access the service from outside the US, your data will be transferred to and processed in the US. By using TarotByte, you consent to this transfer. We aim to comply with applicable data protection laws including the GDPR and CCPA.</p>

      <h2>10. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email or a notice on the site. The &ldquo;last updated&rdquo; date above reflects the most recent revision. Continued use of TarotByte after changes take effect constitutes acceptance of the updated policy.</p>

      <h2>11. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or your data, please contact us at <a href="mailto:hello@tarotbyte.app">hello@tarotbyte.app</a>.</p>
    </LegalLayout>
  );
}
