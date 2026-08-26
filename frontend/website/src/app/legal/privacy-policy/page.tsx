import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How आरंभ Tours & Travels collects, uses, stores, and protects your personal data under the Indian IT Act 2000 and GDPR.',
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-collected', label: 'Data We Collect' },
  { id: 'how-we-use', label: 'How We Use Data' },
  { id: 'sharing', label: 'Data Sharing' },
  { id: 'storage-security', label: 'Storage & Security' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'children', label: 'Children\'s Privacy' },
  { id: 'changes', label: 'Policy Changes' },
  { id: 'contact', label: 'Contact Us' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="We are committed to protecting your personal information. This policy explains exactly what we collect, why, and how you can control it."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Privacy Policy"
      toc={TOC}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>आरंभ Tours & Travels ("आरंभ", "we", "us", or "our") operates the website <strong>aarambhatravels.in</strong> and its associated booking platforms. This Privacy Policy describes how we handle personal data when you visit our website, make a booking, or contact us.</p>
        <p>This policy is governed by the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> of India. We also align with the <strong>General Data Protection Regulation (GDPR)</strong> for visitors from the European Economic Area.</p>
        <LegalCallout type="info">
          By using our website or services, you agree to the collection and use of your information as described in this policy. If you disagree, please do not use our services.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="data-collected" number={2} title="Data We Collect">
        <p>We collect data in the following categories:</p>
        <div className="mt-3 space-y-1 dl-table">
          <LegalDefinition term="Identity Data">Full name, date of birth (for license verification).</LegalDefinition>
          <LegalDefinition term="Contact Data">Email address, phone/WhatsApp number, billing address.</LegalDefinition>
          <LegalDefinition term="Booking Data">Tour package selected, travel dates, passenger count, vehicle chosen, pickup/dropoff dates, special requests.</LegalDefinition>
          <LegalDefinition term="Payment Data">Razorpay transaction IDs, UTR numbers. We do not store full card numbers — payments are processed by Razorpay (PCI-DSS Level 1 compliant).</LegalDefinition>
          <LegalDefinition term="Identity Documents">Driving licence number and photo (for self-drive rentals only), uploaded through our booking form.</LegalDefinition>
          <LegalDefinition term="Technical Data">IP address, browser type and version, device type, operating system, referring URL, pages visited, session duration (via analytics cookies).</LegalDefinition>
          <LegalDefinition term="Communications">Messages you send us via WhatsApp, email, or our contact forms.</LegalDefinition>
        </div>
        <LegalCallout type="warning">
          <strong>Sensitive personal data</strong> (driving licence, financial information) is collected only where strictly required for service delivery and is subject to enhanced protection measures.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="how-we-use" number={3} title="How We Use Your Data">
        <p>We use your personal data for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Booking fulfillment</strong> — Confirming reservations, processing payments, issuing invoices, and coordinating vehicle/tour logistics.</li>
          <li><strong>Customer communications</strong> — Sending booking confirmations, payment receipts, trip reminders, and operational updates via email and WhatsApp.</li>
          <li><strong>Account management</strong> — Creating and managing your customer account and booking history.</li>
          <li><strong>Legal compliance</strong> — Verifying driver eligibility (age 18+, valid licence), maintaining financial records as required by law.</li>
          <li><strong>Fraud prevention</strong> — Detecting and preventing fraudulent bookings, chargeback abuse, and identity misrepresentation.</li>
          <li><strong>Service improvement</strong> — Analysing website usage patterns (anonymised) to improve our platform and offerings.</li>
          <li><strong>Marketing</strong> — Sending promotional emails and offers — only with your explicit consent, from which you may unsubscribe at any time.</li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" number={4} title="Data Sharing & Third Parties">
        <p>We share your data only with trusted partners necessary to deliver our services. We never sell your personal data.</p>
        <div className="mt-3 space-y-1">
          <LegalDefinition term="Razorpay">Payment processing. Your payment data is transmitted directly to Razorpay's PCI-DSS compliant infrastructure.</LegalDefinition>
          <LegalDefinition term="Google (Analytics)">Anonymised website usage data if you consent to analytics cookies. Subject to Google's Privacy Policy.</LegalDefinition>
          <LegalDefinition term="Email / SMS Providers">Transactional communications only (booking confirmations, OTPs).</LegalDefinition>
          <LegalDefinition term="Legal Authorities">We may disclose data to law enforcement when legally required (court order, RTO verification, fraud investigation).</LegalDefinition>
        </div>
        <LegalCallout type="info">
          All third-party processors are bound by Data Processing Agreements and are required to maintain appropriate security standards.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="storage-security" number={5} title="Storage & Security">
        <p>Your data is stored on <strong>MongoDB Atlas</strong> hosted servers with data residency in India/Asia Pacific. We implement the following security measures:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>All data transmitted between your browser and our servers is encrypted using <strong>TLS 1.2+</strong> (HTTPS).</li>
          <li>Passwords are hashed using <strong>bcrypt with 12 salt rounds</strong> — never stored in plain text.</li>
          <li>Access tokens use <strong>JWT with 24-hour expiry</strong> and immediate revocation on password change.</li>
          <li>Driving licence documents and sensitive identity data are stored with access controls restricted to authorised operations staff only.</li>
          <li>API endpoints are protected by rate limiting, IDOR checks, and HMAC signature verification for payments.</li>
        </ul>
        <LegalCallout type="warning">
          Despite our best efforts, no internet transmission is 100% secure. If you suspect a data breach involving your account, please contact us immediately at <strong>security@aarambhatravels.in</strong>.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="retention" number={6} title="Data Retention">
        <div className="space-y-1">
          <LegalDefinition term="Booking records">7 years from the booking date (required for tax and legal compliance under Indian law).</LegalDefinition>
          <LegalDefinition term="Driving licences">Deleted within 90 days of rental completion, unless legally required to retain.</LegalDefinition>
          <LegalDefinition term="Account data">Retained while your account is active. Deleted within 30 days of a verified account deletion request.</LegalDefinition>
          <LegalDefinition term="Analytics data">Aggregated and anonymised after 26 months.</LegalDefinition>
          <LegalDefinition term="Marketing consent">Retained until you withdraw consent.</LegalDefinition>
        </div>
      </LegalSection>

      <LegalSection id="your-rights" number={7} title="Your Rights">
        <p>Under the IT Act 2000 Rules and GDPR (where applicable), you have the following rights:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction</strong> — Request correction of inaccurate or incomplete data.</li>
          <li><strong>Deletion</strong> — Request deletion of your personal data (subject to legal retention obligations).</li>
          <li><strong>Withdrawal of consent</strong> — Withdraw marketing consent at any time via the unsubscribe link in emails or by contacting us.</li>
          <li><strong>Portability</strong> — Request your data in a machine-readable format (GDPR users).</li>
          <li><strong>Objection</strong> — Object to processing of your data for direct marketing purposes.</li>
        </ul>
        <p>To exercise any of these rights, email <strong>support@aarambhatravels.in</strong> with the subject line "Privacy Request". We will respond within <strong>30 days</strong>.</p>
      </LegalSection>

      <LegalSection id="cookies" number={8} title="Cookies">
        <p>We use cookies to make our website function correctly and to understand how it is used. Please read our <a href="/legal/cookie-policy" className="text-[#5266EB] underline hover:opacity-80">Cookie Policy</a> for a complete description of what cookies we set and how to manage them.</p>
        <p>You can also manage your cookie preferences at any time using our Cookie Preferences panel (accessible via the banner shown on your first visit).</p>
      </LegalSection>

      <LegalSection id="children" number={9} title="Children's Privacy">
        <p>Our services are not directed to anyone under the age of <strong>18 years</strong>. We do not knowingly collect personal data from minors. Self-drive car rental requires a minimum age of 18 with a valid driving licence.</p>
        <p>If you believe a child has provided us with personal data without parental consent, please contact us and we will delete it promptly.</p>
      </LegalSection>

      <LegalSection id="changes" number={10} title="Policy Changes">
        <p>We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. When we make material changes, we will:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Update the "Last Updated" date at the top of this page.</li>
          <li>Send an email notification to registered users for significant changes.</li>
          <li>Display a prominent notice on our website for 30 days after the change.</li>
        </ul>
        <p>Continued use of our services after a policy update constitutes acceptance of the revised policy.</p>
      </LegalSection>

      <LegalSection id="contact" number={11} title="Contact Us">
        <p>For any privacy-related questions, requests, or concerns:</p>
        <div className="mt-3 space-y-1">
          <LegalDefinition term="Email">support@aarambhatravels.in</LegalDefinition>
          <LegalDefinition term="WhatsApp">Available via the booking platform (business hours: 9 AM – 8 PM IST)</LegalDefinition>
          <LegalDefinition term="Address">आरंभ Tours & Travels, Pune, Maharashtra, India</LegalDefinition>
          <LegalDefinition term="Response time">Within 30 days of receiving a verifiable request</LegalDefinition>
        </div>
        <LegalCallout type="info">
          We take all privacy concerns seriously and will acknowledge your request within <strong>3 business days</strong>.
        </LegalCallout>
      </LegalSection>
    </LegalPageLayout>
  );
}
