import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition, RefundRow } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Cancellation windows, refund percentages, deposit rules, and force majeure policy for आरंभ Tours, car rentals, and bus charters.',
};

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'tour-cancellation', label: 'Tour Cancellations' },
  { id: 'rental-cancellation', label: 'Self-Drive Rental Cancellations' },
  { id: 'bus-cancellation', label: 'Bus Charter Cancellations' },
  { id: 'no-show', label: 'No-Show Policy' },
  { id: 'deposit-refund', label: 'Security Deposit Refunds' },
  { id: 'force-majeure', label: 'Force Majeure' },
  { id: 'how-to-cancel', label: 'How to Cancel' },
  { id: 'refund-processing', label: 'Refund Processing' },
  { id: 'contact', label: 'Contact' },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair cancellation rules for all our services — tour packages, self-drive rentals, and bus charters."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Refund & Cancellation Policy"
      toc={TOC}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>आरंभ Tours & Travels understands that travel plans change. We have designed our cancellation policy to be fair while covering our operational costs when trips are cancelled close to the departure or pickup date.</p>
        <LegalCallout type="info">
          All cancellation requests must be made in writing via email or WhatsApp. Verbal cancellations are not accepted. The date of written notice is the date used to calculate your refund eligibility.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="tour-cancellation" number={2} title="Tour Package Cancellations">
        <p>Refunds are calculated based on the number of days before the <strong>scheduled departure date</strong> that we receive your written cancellation notice:</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#5266EB]/20">
                <th className="py-2 pr-6 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Cancellation Notice Period</th>
                <th className="py-2 pr-6 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Refund</th>
                <th className="py-2 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              <RefundRow period="More than 30 days before departure" percentage="90%" note="10% admin fee retained" />
              <RefundRow period="15 – 30 days before departure" percentage="70%" note="30% service charge retained" />
              <RefundRow period="7 – 14 days before departure" percentage="50%" note="50% cancellation charge" />
              <RefundRow period="3 – 6 days before departure" percentage="25%" note="75% cancellation charge" />
              <RefundRow period="Less than 3 days before departure" percentage="No Refund" />
            </tbody>
          </table>
        </div>
        <LegalCallout type="warning">
          <strong>Non-refundable deposits:</strong> Any deposit paid at the time of booking to secure batch seats is non-refundable regardless of cancellation timing, unless आरंभ cancels the tour.
        </LegalCallout>
        <p className="mt-2">If आरंभ cancels a tour due to insufficient bookings or operational reasons, a <strong>full 100% refund</strong> will be processed within 7 business days.</p>
      </LegalSection>

      <LegalSection id="rental-cancellation" number={3} title="Self-Drive Car Rental Cancellations">
        <p>Refunds for self-drive bookings are based on notice before the <strong>scheduled pickup date and time</strong>:</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#5266EB]/20">
                <th className="py-2 pr-6 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Notice Period</th>
                <th className="py-2 pr-6 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Rental Fee Refund</th>
                <th className="py-2 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Deposit</th>
              </tr>
            </thead>
            <tbody>
              <RefundRow period="More than 48 hours before pickup" percentage="90%" note="Deposit refunded in full" />
              <RefundRow period="24 – 48 hours before pickup" percentage="50%" note="Deposit refunded in full" />
              <RefundRow period="Less than 24 hours before pickup" percentage="No Refund" note="Deposit refunded in full" />
            </tbody>
          </table>
        </div>
        <p className="mt-3">The <strong>security deposit</strong> is always refunded separately after vehicle inspection (see §6).</p>
      </LegalSection>

      <LegalSection id="bus-cancellation" number={4} title="Bus Charter Cancellations">
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#5266EB]/20">
                <th className="py-2 pr-6 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Notice Period</th>
                <th className="py-2 text-[11px] font-black text-[#5266EB] font-['Syne',sans-serif] uppercase tracking-wider">Refund</th>
              </tr>
            </thead>
            <tbody>
              <RefundRow period="More than 7 days before trip" percentage="80%" />
              <RefundRow period="3 – 7 days before trip" percentage="50%" />
              <RefundRow period="Less than 3 days before trip" percentage="No Refund" />
            </tbody>
          </table>
        </div>
        <LegalCallout type="warning">
          Bus charter advance payments are <strong>non-refundable</strong> if cancelled within 48 hours of the trip.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="no-show" number={5} title="No-Show Policy">
        <p>If you do not arrive at the pickup point or departure location at the scheduled time without prior written cancellation:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>The booking will be treated as a <strong>no-show</strong> after a 30-minute grace period.</li>
          <li><strong>No refund</strong> will be issued for the rental/tour fee.</li>
          <li>For rentals, the security deposit will be refunded in full (as no vehicle was used).</li>
          <li>आरंभ will attempt to contact you on the registered phone number during the grace period.</li>
        </ul>
      </LegalSection>

      <LegalSection id="deposit-refund" number={6} title="Security Deposit Refunds">
        <p>For self-drive car rentals, a security deposit is collected at or before pickup. Refund timelines:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Vehicle is inspected within <strong>2 hours</strong> of return.</li>
          <li>If no damage: deposit refunded within <strong>3–5 business days</strong> via the original payment method.</li>
          <li>If damage is found: repair cost estimate is shared with you. Only the balance (deposit minus repair cost) is refunded.</li>
          <li>Disputes are handled within 7 business days with photographic evidence provided.</li>
        </ul>
        <LegalCallout type="info">
          All vehicles are photographed and video-recorded before handover. Pre-existing damage is documented in the rental agreement signed at pickup.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="force-majeure" number={7} title="Force Majeure">
        <p>आरंभ is not liable for cancellations caused by events beyond our reasonable control, including:</p>
        <ul className="list-disc pl-5 space-y-1 columns-2">
          <li>Natural disasters (floods, earthquakes, landslides)</li>
          <li>Government-imposed travel restrictions or lockdowns</li>
          <li>Severe weather making travel unsafe</li>
          <li>Strikes or civil unrest</li>
          <li>Pandemic or public health emergency</li>
          <li>Road closures by authorities</li>
        </ul>
        <p className="mt-3">In genuine force majeure situations, आरंभ will offer either:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>A <strong>travel credit</strong> valid for 12 months at full value, OR</li>
          <li>A <strong>partial refund</strong> (recoverable costs minus non-recoverable operational costs).</li>
        </ul>
      </LegalSection>

      <LegalSection id="how-to-cancel" number={8} title="How to Cancel">
        <ol className="list-decimal pl-5 space-y-2">
          <li>Email <strong>support@aarambhatravels.in</strong> with subject line: <em>"Cancellation Request – [Booking Code]"</em></li>
          <li>Or send a WhatsApp message to our support number with your booking code.</li>
          <li>Our team will acknowledge within <strong>4 hours</strong> during business hours (9 AM – 8 PM IST).</li>
          <li>You will receive a cancellation confirmation email with refund details.</li>
        </ol>
        <LegalCallout type="warning">
          Cancellations requested through social media DMs, Instagram, or third-party platforms are <strong>not valid</strong> and will not be processed.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="refund-processing" number={9} title="Refund Processing">
        <p>Approved refunds are processed as follows:</p>
        <div className="space-y-1">
          <LegalDefinition term="Online payments">Returned to original Razorpay payment method within <strong>5–7 business days</strong> after cancellation confirmation.</LegalDefinition>
          <LegalDefinition term="Bank transfer (UTR)">Returned via NEFT/IMPS within <strong>5–7 business days</strong>. Share bank details in the cancellation email.</LegalDefinition>
          <LegalDefinition term="Cash payments">Returned via bank transfer only (not cash-in-hand). Provide bank details.</LegalDefinition>
          <LegalDefinition term="Credit card delays">Bank processing may add 2–5 additional days depending on your card issuer.</LegalDefinition>
        </div>
      </LegalSection>

      <LegalSection id="contact" number={10} title="Contact for Cancellations">
        <div className="space-y-1">
          <LegalDefinition term="Email">support@aarambhatravels.in</LegalDefinition>
          <LegalDefinition term="WhatsApp">Available on the booking platform — business hours 9 AM – 8 PM IST</LegalDefinition>
          <LegalDefinition term="Response SLA">4 hours during business hours for cancellation requests</LegalDefinition>
        </div>
      </LegalSection>
    </LegalPageLayout>
  );
}
