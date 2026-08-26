import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Security Policy',
  description: 'How आरंभ Tours & Travels protects customer data with encryption, secure authentication, rate limiting, and PCI-DSS compliant payments.',
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-protection', label: 'Data Protection' },
  { id: 'authentication', label: 'Authentication Security' },
  { id: 'payments', label: 'Payment Security' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'access-control', label: 'Access Controls' },
  { id: 'incident-response', label: 'Incident Response' },
  { id: 'disclosure', label: 'Vulnerability Disclosure' },
];

export default function SecurityPolicyPage() {
  return (
    <LegalPageLayout
      title="Security Policy"
      subtitle="How we protect your data, payments, and account — our security commitments and practices."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Security Policy"
      toc={TOC}
    >
      <LegalSection id="overview" number={1} title="Security Overview">
        <p>Security is foundational to how आरंभ Tours & Travels operates. We process sensitive personal data including customer identities, driving licences, and payment information — and we take our responsibility to protect this data seriously.</p>
        <p>This document describes the technical and organisational security measures we have implemented to protect our systems and your data.</p>
        <LegalCallout type="info">
          If you believe you have discovered a security vulnerability in our platform, please see our <a href="/legal/responsible-disclosure" className="text-[#5266EB] underline">Responsible Disclosure Policy</a> before taking any action.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="data-protection" number={2} title="Data Protection in Transit & at Rest">
        <div className="space-y-1">
          <LegalDefinition term="HTTPS Everywhere">All traffic between your browser and our servers is encrypted using TLS 1.2 or higher. HTTP is redirected to HTTPS.</LegalDefinition>
          <LegalDefinition term="Database encryption">Customer data in MongoDB Atlas is encrypted at rest using AES-256.</LegalDefinition>
          <LegalDefinition term="Password hashing">All passwords are hashed with bcrypt at 12 salt rounds — never stored in plain text or reversible format.</LegalDefinition>
          <LegalDefinition term="Sensitive fields">Fields like password hashes, reset tokens, and verification tokens are excluded from API responses by default using Mongoose schema-level `select: false`.</LegalDefinition>
        </div>
      </LegalSection>

      <LegalSection id="authentication" number={3} title="Authentication & Session Security">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>JSON Web Tokens (JWT)</strong> — Sessions use JWTs with a 24-hour expiry. Tokens are verified against a cryptographic secret on every request.</li>
          <li><strong>Token revocation</strong> — Changing your password immediately invalidates all existing sessions across all devices via a `tokenVersion` mechanism.</li>
          <li><strong>Login rate limiting</strong> — Maximum 5 login attempts per 15 minutes per IP + email combination. Breaches are logged to our security audit trail.</li>
          <li><strong>Account registration limiting</strong> — Maximum 3 registrations per hour per IP to prevent mass account creation.</li>
          <li><strong>Email verification</strong> — New accounts require email verification using a cryptographically random 32-byte token with 24-hour expiry.</li>
          <li><strong>Password reset tokens</strong> — Single-use tokens that expire after 15 minutes. Enumeration-resistant (same response whether email exists or not).</li>
        </ul>
      </LegalSection>

      <LegalSection id="payments" number={4} title="Payment Security">
        <p>We process payments through <strong>Razorpay</strong>, a PCI-DSS Level 1 certified payment gateway. We do not store full card numbers, CVVs, or banking credentials on our servers.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>HMAC verification</strong> — All Razorpay payment callbacks are verified using constant-time HMAC-SHA256 signature comparison (`crypto.timingSafeEqual`) to prevent forgery.</li>
          <li><strong>No card data stored</strong> — Card details are handled entirely by Razorpay's PCI-DSS infrastructure.</li>
          <li><strong>UTR validation</strong> — Manual bank transfer references (UTR numbers) are stored encrypted and validated by our team before confirming bookings.</li>
        </ul>
      </LegalSection>

      <LegalSection id="infrastructure" number={5} title="Infrastructure Security">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Hosting</strong> — Backend hosted on Render.com; database on MongoDB Atlas — both with private network access controls.</li>
          <li><strong>Environment secrets</strong> — All API keys, database credentials, and JWT secrets are stored as environment variables — never committed to version control.</li>
          <li><strong>Security headers</strong> — Every HTTP response includes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Strict-Transport-Security`, and `Referrer-Policy`.</li>
          <li><strong>Bot detection</strong> — Automated scanner and known attack tools (sqlmap, nikto, masscan, etc.) are blocked at the application layer.</li>
          <li><strong>Suspicious traffic logging</strong> — Path traversal attempts, SQL injection probes, and anomalous request patterns are logged and flagged to our audit trail.</li>
        </ul>
      </LegalSection>

      <LegalSection id="access-control" number={6} title="Access Controls">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Role-based access</strong> — Admin users are assigned `superadmin` or `viewer` roles. Destructive operations (delete, status changes) are restricted to superadmin only.</li>
          <li><strong>Ownership verification (IDOR prevention)</strong> — Customers can only access their own booking data. Cross-account data access attempts are blocked with 403 Forbidden and logged.</li>
          <li><strong>Database access</strong> — MongoDB Atlas is not exposed to the public internet. Access is restricted to application server IPs only.</li>
        </ul>
      </LegalSection>

      <LegalSection id="incident-response" number={7} title="Incident Response">
        <p>In the event of a confirmed security incident involving customer data:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>We will isolate affected systems within <strong>4 hours</strong> of detection.</li>
          <li>Affected customers will be notified within <strong>72 hours</strong> of confirming a breach.</li>
          <li>Notification will include: what data was affected, what we are doing, and steps you should take.</li>
          <li>Regulatory authorities will be notified as required by applicable law.</li>
          <li>A post-incident report will be published to affected customers within 30 days.</li>
        </ol>
        <LegalCallout type="warning">
          If you suspect your आरंभ account has been compromised, change your password immediately and contact us at <strong>security@aarambhatravels.in</strong>.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="disclosure" number={8} title="Vulnerability Disclosure">
        <p>We welcome responsible security research. If you discover a vulnerability in our platform, please report it to us before public disclosure. See our <a href="/legal/responsible-disclosure" className="text-[#5266EB] underline">Responsible Disclosure Policy</a> for full details, including scope, safe harbor, and response time commitments.</p>
        <div className="space-y-1">
          <LegalDefinition term="Security email">security@aarambhatravels.in</LegalDefinition>
          <LegalDefinition term="Response time">We acknowledge all vulnerability reports within <strong>72 hours</strong>.</LegalDefinition>
        </div>
      </LegalSection>
    </LegalPageLayout>
  );
}
