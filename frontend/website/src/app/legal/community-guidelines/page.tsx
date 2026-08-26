import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description: 'Conduct standards for आरंभ Tours & Travels customers — reviews, interaction with staff, social media, and photography.',
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'reviews', label: 'Reviews & Feedback' },
  { id: 'staff-conduct', label: 'Interactions with Staff' },
  { id: 'photography', label: 'Photography & Media' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'vehicle-conduct', label: 'Vehicle Conduct' },
  { id: 'enforcement', label: 'Enforcement' },
];

export default function CommunityGuidelinesPage() {
  return (
    <LegalPageLayout
      title="Community Guidelines"
      subtitle="Standards for respectful interaction with our team, drivers, fellow travellers, and our online community."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Community Guidelines"
      toc={TOC}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>The आरंभ community includes our customers, drivers, tour guides, and staff. We are committed to creating a respectful, inclusive, and enjoyable environment for everyone.</p>
        <p>These guidelines apply to all interactions with आरंभ — in person during tours and rentals, on our website, via WhatsApp, and on social media platforms where we are active.</p>
        <LegalCallout type="success">
          Our guiding principle: treat every आरंभ team member and fellow traveller with the same respect you would want yourself.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="reviews" number={2} title="Reviews & Feedback Standards">
        <p>We encourage honest reviews — positive and negative. Good feedback helps us improve. When leaving a review:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Be honest and specific</strong> — Share what actually happened during your experience. Vague reviews help no one.</li>
          <li><strong>Be fair</strong> — Consider what was within आरंभ's control vs. external factors (weather, road conditions).</li>
          <li><strong>No profanity or hate speech</strong> — Reviews containing abusive language, slurs, or personal attacks against staff by name will be removed.</li>
          <li><strong>No fake reviews</strong> — Reviews must be based on genuine, first-hand experience. Fake or incentivised reviews violate our Acceptable Use Policy.</li>
          <li><strong>Constructive criticism</strong> — If something went wrong, describe what happened and what would have improved it. This is more valuable than a one-word score.</li>
        </ul>
      </LegalSection>

      <LegalSection id="staff-conduct" number={3} title="Interactions with Our Team & Drivers">
        <p>All आरंभ team members — including drivers, guides, office staff, and support agents — are entitled to a safe and respectful working environment.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>No harassment</strong> — Verbal abuse, threats, intimidation, or sexual harassment of any आरंभ staff member is grounds for immediate termination of service with no refund.</li>
          <li><strong>Punctuality</strong> — Please be ready at the agreed pickup time. Our drivers and guides have schedules. Excessive delays affect other customers.</li>
          <li><strong>Driver authority</strong> — Our drivers have final authority on road safety decisions (route changes, stopping, refusal to drive in unsafe conditions). Please respect their judgement.</li>
          <li><strong>Cleanliness</strong> — Return vehicles and shared tour spaces in the same condition you received them.</li>
        </ul>
      </LegalSection>

      <LegalSection id="photography" number={4} title="Photography & Media During Tours">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Personal photography</strong> — You are welcome to photograph and film during tours for personal use.</li>
          <li><strong>Consent</strong> — Always obtain consent before photographing other tour participants, drivers, or guides, especially if photos will be shared publicly.</li>
          <li><strong>No commercial photography</strong> — Using आरंभ tours or vehicles for commercial photo/video productions requires prior written permission.</li>
          <li><strong>Restricted locations</strong> — Respect photography restrictions at religious sites, government buildings, and military areas encountered during tours.</li>
          <li><strong>आरंभ branding</strong> — Do not use आरंभ's name, logo, or vehicles in commercial content without written authorisation.</li>
        </ul>
      </LegalSection>

      <LegalSection id="social-media" number={5} title="Social Media Guidelines">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Tag us</strong> — We love seeing your travel photos! Tag @aarambhatravels and use <strong>#AarambhaAdventures</strong>.</li>
          <li><strong>Be truthful</strong> — Posts about your आरंभ experience should be honest. Defamatory content based on false claims may result in legal action.</li>
          <li><strong>No personal details</strong> — Do not share other customers' personal information, booking details, or images on social media.</li>
          <li><strong>UGC permission</strong> — By tagging आरंभ in your posts, you grant us permission to reshare your content (with credit) on our own platforms. Contact us if you'd like to be unlisted.</li>
        </ul>
      </LegalSection>

      <LegalSection id="vehicle-conduct" number={6} title="Vehicle & Tour Conduct">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Smoking</strong> — Strictly prohibited inside all आरंभ vehicles. Violations result in a cleaning fee and possible forfeiture of security deposit.</li>
          <li><strong>Alcohol</strong> — No consumption of alcohol inside vehicles. Do not drive after consuming alcohol — this is illegal and will result in immediate booking cancellation, deposit forfeiture, and police reporting.</li>
          <li><strong>Pets</strong> — Pets are not permitted in vehicles unless explicitly arranged in advance.</li>
          <li><strong>Passenger limits</strong> — Never exceed the licensed passenger capacity of the vehicle. This is a legal and safety requirement.</li>
          <li><strong>Traffic laws</strong> — Follow all Indian traffic laws. Fines and penalties are the customer's sole responsibility.</li>
        </ul>
      </LegalSection>

      <LegalSection id="enforcement" number={7} title="Enforcement">
        <p>Violations of these Community Guidelines may result in:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>A formal warning</li>
          <li>Early termination of a rental or tour</li>
          <li>Account suspension</li>
          <li>Permanent ban from आरंभ services</li>
          <li>Legal action where applicable</li>
        </ul>
        <p>To report a violation or concern, contact us at <strong>support@aarambhatravels.in</strong> or via WhatsApp during business hours.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
