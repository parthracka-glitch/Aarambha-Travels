import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description: 'Prohibited uses of आरंभ Tours & Travels platform, age requirements, and consequences of violations.',
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'prohibited', label: 'Prohibited Uses' },
  { id: 'booking-misuse', label: 'Booking Misuse' },
  { id: 'consequences', label: 'Consequences' },
  { id: 'reporting', label: 'Reporting Abuse' },
];

export default function AcceptableUsePage() {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      subtitle="Rules governing how our website and services may be used — to protect all our customers."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Acceptable Use Policy"
      toc={TOC}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>This Acceptable Use Policy ("AUP") sets out the rules governing use of the आरंभ Tours & Travels website, booking platform, and associated services. By using our platform, you agree to this policy.</p>
        <p>We have designed this policy to protect the integrity of our service, the security of our systems, and the experience of all our customers.</p>
      </LegalSection>

      <LegalSection id="eligibility" number={2} title="Eligibility Requirements">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>You must be at least <strong>18 years of age</strong> to make bookings or register an account.</li>
          <li>For <strong>self-drive rentals</strong>: You must hold a valid Indian driving licence (for the vehicle category booked) that has been held for at least 1 year.</li>
          <li>For <strong>tour packages</strong>: Minors may participate if accompanied by a responsible adult who is the account holder and booking customer.</li>
          <li>You must provide accurate personal information during registration and booking. False identity information is a violation of this AUP and Indian law.</li>
        </ul>
        <LegalCallout type="warning">
          Providing false identity documents (e.g., fake driving licence) is a criminal offence under the Indian Penal Code and will be reported to law enforcement.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="prohibited" number={3} title="Prohibited Uses of Our Platform">
        <p>You must not use our website or services to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Scrape or harvest</strong> — Automated scraping, crawling, or data extraction of vehicle listings, pricing, tour packages, or customer data.</li>
          <li><strong>Spam</strong> — Submit fake inquiries, test bookings, or flood our contact forms.</li>
          <li><strong>Impersonate</strong> — Book in someone else's name without authorisation, or misrepresent your identity.</li>
          <li><strong>Reverse-engineer</strong> — Attempt to decompile, disassemble, or otherwise reverse-engineer any part of our software.</li>
          <li><strong>Attack</strong> — Conduct vulnerability scanning, penetration testing, DoS attacks, or inject malicious code into our systems without explicit written authorisation.</li>
          <li><strong>Commercial resale</strong> — Resell, sublet, or re-rent आरंभ vehicles to third parties without written permission.</li>
          <li><strong>Illegal use</strong> — Use our vehicles or tours for any purpose prohibited by Indian law, including carrying illegal goods, persons, or substances.</li>
          <li><strong>Circumvention</strong> — Attempt to bypass rate limits, CAPTCHA, or other access controls on our platform.</li>
        </ul>
      </LegalSection>

      <LegalSection id="booking-misuse" number={4} title="Booking & Review Misuse">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Fake bookings</strong> — Submitting bookings with no intention to travel or to artificially block availability is strictly prohibited.</li>
          <li><strong>Chargeback abuse</strong> — Filing false chargeback disputes for genuine transactions is fraud and will be contested with payment networks and reported to authorities.</li>
          <li><strong>Review manipulation</strong> — Submitting fake reviews, incentivised reviews, or reviews designed to harm competitors is prohibited.</li>
          <li><strong>Voucher/promo abuse</strong> — Creating multiple accounts to claim single-use promotional offers multiple times.</li>
        </ul>
        <LegalCallout type="critical">
          Fraudulent bookings and chargeback abuse will result in immediate account termination and may be referred to the Cyber Crime Cell under IT Act 2000.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="consequences" number={5} title="Consequences of Violations">
        <p>आरंभ reserves the right to take the following actions for violations of this AUP:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Immediate suspension or termination of your account</li>
          <li>Cancellation of existing bookings without refund</li>
          <li>Permanent ban from using आरंभ services</li>
          <li>Legal action and reporting to law enforcement for criminal violations</li>
          <li>Civil action for damages and losses</li>
        </ul>
      </LegalSection>

      <LegalSection id="reporting" number={6} title="Reporting Abuse">
        <p>If you witness abuse of our platform (fake bookings, impersonation, scraping), please report it to us at <strong>support@aarambhatravels.in</strong> with the subject line "Abuse Report".</p>
        <p>We investigate all abuse reports seriously and take action where violations are confirmed. You may report anonymously.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
