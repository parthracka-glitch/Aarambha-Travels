import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers and liability limitations for आरंभ Tours & Travels website, tour itineraries, and vehicle rentals.',
};

const TOC = [
  { id: 'general', label: 'General Disclaimer' },
  { id: 'itineraries', label: 'Tour Itineraries' },
  { id: 'vehicles', label: 'Vehicle Information' },
  { id: 'third-party', label: 'Third-Party Links' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'accuracy', label: 'Content Accuracy' },
];

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      subtitle="Important limitations and disclaimers regarding our website content, tour itineraries, and rental services."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Disclaimer"
      toc={TOC}
    >
      <LegalSection id="general" number={1} title="General Disclaimer">
        <p>The information on the आरंभ Tours & Travels website is provided for general informational purposes only. While we make every effort to keep information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, services, or related content.</p>
        <LegalCallout type="warning">
          Use of our website and services is entirely at your own risk. आरंभ Tours & Travels is not liable for any loss or damage arising from use of our website or reliance on information published here.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="itineraries" number={2} title="Tour Itineraries & Package Content">
        <p>Tour itineraries, day-by-day schedules, meal inclusions, accommodation details, and activity descriptions are indicative and subject to change without prior notice due to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Weather conditions and road closures</li>
          <li>Accommodation availability changes</li>
          <li>Government restrictions or special events at destinations</li>
          <li>Force majeure events</li>
          <li>Group size and logistical adjustments</li>
        </ul>
        <p>आरंभ reserves the right to modify itineraries with equivalent alternatives. We are not liable for consequences of such changes, though we will always communicate changes as early as possible.</p>
      </LegalSection>

      <LegalSection id="vehicles" number={3} title="Vehicle Information & Availability">
        <p>Vehicle photographs, specifications, features, and condition descriptions on our website are for reference purposes. Actual vehicles may vary due to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Fleet maintenance schedules</li>
          <li>Seasonal availability</li>
          <li>Unforeseen mechanical issues</li>
        </ul>
        <p>In the event the booked vehicle is unavailable, आरंभ will offer a comparable substitute or a full refund at the customer's choice.</p>
        <LegalCallout type="critical">
          आरंभ Tours & Travels is <strong>not liable</strong> for accidents, injuries, traffic violations, penalties, or damages incurred during self-drive rentals. Customers are solely responsible for complying with all traffic laws and driving safely.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="third-party" number={4} title="Third-Party Links & Services">
        <p>Our website may contain links to third-party websites, hotel booking partners, or activity providers. These links are provided for convenience and informational purposes only. आरंभ:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Does not endorse or guarantee the content of any linked site.</li>
          <li>Has no control over and accepts no responsibility for third-party content, privacy policies, or practices.</li>
          <li>Is not liable for any loss or damage arising from your use of linked third-party services.</li>
        </ul>
      </LegalSection>

      <LegalSection id="liability" number={5} title="Limitation of Liability">
        <p>To the maximum extent permitted by applicable Indian law, आरंभ Tours & Travels shall not be liable for:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Personal injury, accident, or death during self-drive rentals</li>
          <li>Property damage or theft of personal belongings during tours or rentals</li>
          <li>Loss of business opportunity, profit, revenue, or data</li>
          <li>Indirect, consequential, special, or punitive damages</li>
          <li>Losses arising from acts of God, natural disasters, or civil unrest</li>
          <li>Health issues arising during tours (though we strongly recommend travel insurance)</li>
        </ul>
        <LegalCallout type="info">
          We strongly recommend all customers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, and personal accident before travelling.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="accuracy" number={6} title="Content Accuracy & Pricing">
        <p>While prices displayed on our website are kept current, they may not reflect real-time availability or last-minute changes. Prices are confirmed only upon booking completion and receipt of a written confirmation from आरंभ.</p>
        <p>In case of a pricing error on our website, आरंभ reserves the right to cancel the booking and offer a refund or the corrected price. We will notify you promptly of any such situation.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
