import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'आरंभ Tours & Travels commitment to web accessibility, WCAG 2.1 compliance status, and alternative contact methods.',
};

const TOC = [
  { id: 'commitment', label: 'Our Commitment' },
  { id: 'standards', label: 'Standards We Follow' },
  { id: 'status', label: 'Current Status' },
  { id: 'known-issues', label: 'Known Issues' },
  { id: 'alternatives', label: 'Alternative Access' },
  { id: 'feedback', label: 'Feedback & Contact' },
];

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      subtitle="आरंभ is committed to making our website usable by everyone — including people with disabilities."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Accessibility Statement"
      toc={TOC}
    >
      <LegalSection id="commitment" number={1} title="Our Commitment">
        <p>आरंभ Tours & Travels is committed to ensuring that our website is accessible to the widest possible audience, regardless of technology or ability. We believe that every customer deserves equal access to our tours, rentals, and booking services.</p>
        <p>We continuously work to improve the accessibility of our website in conformance with accepted standards and user feedback.</p>
        <LegalCallout type="success">
          If you encounter any accessibility barrier on our site, please tell us. We take all reports seriously and will work to resolve issues promptly.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="standards" number={2} title="Standards We Aim to Follow">
        <p>Our website aims to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1</strong> at <strong>Level AA</strong>. These guidelines explain how to make web content more accessible to people with disabilities including:</p>
        <ul className="list-disc pl-5 space-y-1.5 columns-2">
          <li>Visual impairments (blindness, low vision, colour blindness)</li>
          <li>Hearing impairments</li>
          <li>Motor impairments (limited hand/arm use)</li>
          <li>Cognitive and learning disabilities</li>
          <li>Photosensitivity (seizure disorders)</li>
          <li>Speech impairments</li>
        </ul>
      </LegalSection>

      <LegalSection id="status" number={3} title="Current Conformance Status">
        <p>आरंभ's website is <strong>partially conformant</strong> with WCAG 2.1 Level AA. This means some content does not fully conform to the standard. We are actively addressing identified gaps.</p>
        <p><strong>What we have implemented:</strong></p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Semantic HTML5 structure with proper heading hierarchy</li>
          <li>All images have descriptive alt text</li>
          <li>Sufficient colour contrast ratios on primary UI elements</li>
          <li>Keyboard navigability for core booking flows</li>
          <li>Skip-to-content links on main pages</li>
          <li>ARIA labels on interactive elements and form fields</li>
          <li>Responsive design for mobile and tablet devices</li>
        </ul>
      </LegalSection>

      <LegalSection id="known-issues" number={4} title="Known Accessibility Issues">
        <div className="space-y-1">
          <LegalDefinition term="PDF invoices">Generated invoices are not fully screen-reader accessible. We are working on HTML alternatives.</LegalDefinition>
          <LegalDefinition term="Image galleries">Vehicle and destination galleries lack full keyboard navigation. Expected fix: Q4 2026.</LegalDefinition>
          <LegalDefinition term="Map embeds">Google Maps embeds may not be fully accessible to screen reader users. Contact us for text-based directions.</LegalDefinition>
          <LegalDefinition term="Video content">Tour preview videos do not currently have captions. Captions are planned for Q4 2026.</LegalDefinition>
        </div>
      </LegalSection>

      <LegalSection id="alternatives" number={5} title="Alternative Ways to Access Our Services">
        <p>If you are unable to access any part of our website due to a disability, we offer the following alternatives:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>WhatsApp Booking</strong> — Make a booking entirely via WhatsApp at our support number. Our team will walk you through the process.</li>
          <li><strong>Phone Assistance</strong> — Call us during business hours (9 AM – 8 PM IST) for verbal booking assistance.</li>
          <li><strong>Email Booking</strong> — Email <strong>support@aarambhatravels.in</strong> with your requirements and we will handle the booking manually.</li>
          <li><strong>Large-print invoices</strong> — Available on request via email.</li>
        </ul>
      </LegalSection>

      <LegalSection id="feedback" number={6} title="Feedback & Contact">
        <p>We welcome your feedback on the accessibility of the आरंभ website. Please let us know if you encounter any barriers:</p>
        <div className="space-y-1">
          <LegalDefinition term="Email">support@aarambhatravels.in (subject: "Accessibility Feedback")</LegalDefinition>
          <LegalDefinition term="Response time">We aim to respond within <strong>5 business days</strong> to accessibility reports.</LegalDefinition>
          <LegalDefinition term="Formal complaints">If you are dissatisfied with our response, you may contact the relevant national disability rights authority in India.</LegalDefinition>
        </div>
      </LegalSection>
    </LegalPageLayout>
  );
}
