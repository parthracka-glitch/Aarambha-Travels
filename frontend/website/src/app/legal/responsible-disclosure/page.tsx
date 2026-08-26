import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Responsible Disclosure Policy',
  description: 'How to responsibly report security vulnerabilities to आरंभ Tours & Travels — safe harbor, scope, and response commitments.',
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-to-report', label: 'How to Report' },
  { id: 'scope', label: 'Scope' },
  { id: 'out-of-scope', label: 'Out of Scope' },
  { id: 'response', label: 'Our Response Commitment' },
  { id: 'safe-harbor', label: 'Safe Harbor' },
];

export default function ResponsibleDisclosurePage() {
  return (
    <LegalPageLayout
      title="Responsible Disclosure"
      subtitle="We take security seriously and welcome researchers who help us keep our customers safe."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Responsible Disclosure"
      toc={TOC}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>आरंभ Tours & Travels is committed to maintaining the security of our platform and protecting our customers' data. Security researchers play a vital role in identifying vulnerabilities we may have missed.</p>
        <p>If you have discovered a security vulnerability in any आरंभ system, we encourage you to disclose it to us responsibly before making it public. We are grateful for responsible security research.</p>
        <LegalCallout type="info">
          This policy is our public commitment to how we will treat security researchers who report vulnerabilities to us in good faith.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="how-to-report" number={2} title="How to Report a Vulnerability">
        <p>Please submit your vulnerability report via email:</p>
        <div className="space-y-1 mb-4">
          <LegalDefinition term="Email">security@aarambhatravels.in</LegalDefinition>
          <LegalDefinition term="Subject line">Use: "Security Vulnerability Report – [Brief Description]"</LegalDefinition>
          <LegalDefinition term="Encryption">PGP encryption not currently required, but strongly encouraged for sensitive reports.</LegalDefinition>
        </div>
        <p>Please include in your report:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Description of the vulnerability and its potential impact</li>
          <li>Step-by-step reproduction steps (proof-of-concept code or screenshots)</li>
          <li>Affected URL(s), parameters, or API endpoint(s)</li>
          <li>Your name/handle and contact email for follow-up (optional but appreciated)</li>
        </ul>
        <LegalCallout type="warning">
          <strong>Do not</strong> access, download, modify, or delete customer data to prove the vulnerability. A minimal proof-of-concept is sufficient.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="scope" number={3} title="In Scope">
        <p>The following आरंभ properties are in scope for responsible disclosure:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>aarambhatravels.in</strong> — Main customer website</li>
          <li><strong>admin.aarambhatravels.in</strong> — CRM admin portal</li>
          <li><strong>api.aarambhatravels.in</strong> — Backend REST API</li>
        </ul>
        <p>Priority issues we want to hear about:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Authentication bypass or privilege escalation</li>
          <li>Insecure Direct Object Reference (IDOR) allowing access to other users' data</li>
          <li>SQL injection or NoSQL injection</li>
          <li>Cross-Site Scripting (XSS) with meaningful impact</li>
          <li>Cross-Site Request Forgery (CSRF)</li>
          <li>Sensitive data exposure (API keys, customer PII)</li>
          <li>Payment flow vulnerabilities</li>
          <li>Server-Side Request Forgery (SSRF)</li>
        </ul>
      </LegalSection>

      <LegalSection id="out-of-scope" number={4} title="Out of Scope">
        <p>The following are generally not eligible for our disclosure programme:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Volumetric Denial of Service (DoS/DDoS) attacks</li>
          <li>Social engineering attacks against our staff</li>
          <li>Physical security attacks</li>
          <li>Vulnerabilities in third-party software we use (report directly to that vendor)</li>
          <li>Self-XSS that requires the victim to take deliberate unusual action</li>
          <li>Missing security headers without a demonstrated exploit</li>
          <li>SSL/TLS version or cipher suite issues without proven attack</li>
          <li>Username/email enumeration via timing (we have fixed this; please verify first)</li>
          <li>Clickjacking on pages with no sensitive actions</li>
        </ul>
      </LegalSection>

      <LegalSection id="response" number={5} title="Our Response Commitment">
        <div className="space-y-1">
          <LegalDefinition term="Acknowledgement">We will acknowledge your report within <strong>72 hours</strong> of receipt.</LegalDefinition>
          <LegalDefinition term="Triage">We will assess severity and impact within <strong>7 business days</strong> and communicate our findings.</LegalDefinition>
          <LegalDefinition term="Resolution">We target fixing critical vulnerabilities within <strong>14 days</strong> and high-severity within <strong>30 days</strong>.</LegalDefinition>
          <LegalDefinition term="Notification">We will notify you when the vulnerability is patched.</LegalDefinition>
          <LegalDefinition term="Credit">With your permission, we are happy to credit you in our security changelog.</LegalDefinition>
          <LegalDefinition term="Bounties">We currently do not offer monetary bug bounties, but we appreciate and acknowledge all valid reports.</LegalDefinition>
        </div>
        <LegalCallout type="info">
          Please give us adequate time to address the issue before any public disclosure. We ask for a minimum of <strong>90 days</strong> from our acknowledgement before publishing your findings.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="safe-harbor" number={6} title="Safe Harbor">
        <p>We consider security research and disclosure conducted in accordance with this policy to be authorised activity. आरंभ Tours & Travels will not initiate or recommend legal action against researchers who:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Report vulnerabilities to us before public disclosure</li>
          <li>Act in good faith and avoid violating privacy, causing service disruption, or destroying data</li>
          <li>Do not access or download more data than is strictly necessary to demonstrate the vulnerability</li>
          <li>Stop testing immediately upon discovering customer personal data and report it to us</li>
        </ul>
        <LegalCallout type="warning">
          This safe harbor applies only to activities covered by this policy. Any actions beyond these bounds — including unauthorized access, data exfiltration, or testing production systems in a disruptive manner — are not covered.
        </LegalCallout>
        <p className="mt-3">If you have any questions about whether your planned research is in scope, email <strong>security@aarambhatravels.in</strong> before proceeding.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
