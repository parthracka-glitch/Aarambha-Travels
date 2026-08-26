import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Data Processing Agreement',
  description: 'Data Processing Agreement (DPA) for आरंभ Tours & Travels — for B2B corporate clients and partners requiring formal data processing terms.',
};

const TOC = [
  { id: 'parties', label: 'Parties & Definitions' },
  { id: 'subject-matter', label: 'Subject Matter' },
  { id: 'obligations', label: 'Processor Obligations' },
  { id: 'sub-processors', label: 'Sub-Processors' },
  { id: 'data-transfers', label: 'Data Transfers' },
  { id: 'security', label: 'Security Measures' },
  { id: 'breach', label: 'Breach Notification' },
  { id: 'rights', label: 'Data Subject Rights' },
  { id: 'termination', label: 'Termination & Deletion' },
  { id: 'contact', label: 'Contact' },
];

export default function DataProcessingPage() {
  return (
    <LegalPageLayout
      title="Data Processing Agreement"
      subtitle="Formal data processing terms for B2B corporate clients and business partners working with आरंभ."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Data Processing Agreement"
      toc={TOC}
    >
      <LegalSection id="parties" number={1} title="Parties & Definitions">
        <LegalCallout type="info">
          This Data Processing Agreement (DPA) applies to corporate clients, travel agents, and business partners who share customer personal data with आरंभ Tours & Travels for the purpose of booking or managing tours and rentals. Individual consumers are covered by our <a href="/legal/privacy-policy" className="text-[#5266EB] underline">Privacy Policy</a>.
        </LegalCallout>
        <div className="mt-4 space-y-1">
          <LegalDefinition term="Controller">The corporate client or business partner who determines the purposes and means of processing personal data.</LegalDefinition>
          <LegalDefinition term="Processor">आरंभ Tours & Travels, which processes personal data on behalf of the Controller for service delivery.</LegalDefinition>
          <LegalDefinition term="Data Subject">The individual whose personal data is being processed (e.g., a corporate employee or client travelling with आरंभ).</LegalDefinition>
          <LegalDefinition term="Personal Data">Any information relating to an identified or identifiable natural person, as defined under IT Act 2000 Rules and GDPR.</LegalDefinition>
          <LegalDefinition term="Processing">Any operation performed on personal data — collection, storage, use, disclosure, deletion.</LegalDefinition>
        </div>
      </LegalSection>

      <LegalSection id="subject-matter" number={2} title="Subject Matter & Purpose of Processing">
        <p>आरंभ processes personal data provided by the Controller exclusively for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Booking and coordinating tour packages and vehicle rentals for the Controller's clients</li>
          <li>Issuing invoices and managing payment records</li>
          <li>Verifying driver eligibility for self-drive bookings</li>
          <li>Customer communication related to booked services</li>
          <li>Legal and regulatory compliance</li>
        </ul>
        <p>We will not use personal data received from the Controller for our own marketing purposes without separate written consent.</p>
      </LegalSection>

      <LegalSection id="obligations" number={3} title="Processor Obligations">
        <p>As a Data Processor, आरंभ commits to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Process personal data only on documented instructions from the Controller.</li>
          <li>Ensure all personnel with access to personal data are subject to confidentiality obligations.</li>
          <li>Implement appropriate technical and organisational security measures (see §6).</li>
          <li>Not engage sub-processors without prior written authorisation from the Controller (see §4).</li>
          <li>Assist the Controller in responding to data subject requests.</li>
          <li>Delete or return all personal data upon termination of the service relationship.</li>
          <li>Make available all information necessary to demonstrate compliance with this DPA.</li>
        </ul>
      </LegalSection>

      <LegalSection id="sub-processors" number={4} title="Approved Sub-Processors">
        <p>आरंभ uses the following sub-processors for service delivery. Controllers are notified of any new sub-processors with 30 days notice:</p>
        <div className="space-y-1 mt-3">
          <LegalDefinition term="MongoDB Atlas">Database hosting and storage (India/Asia Pacific region).</LegalDefinition>
          <LegalDefinition term="Razorpay">Payment processing (PCI-DSS Level 1 certified, India).</LegalDefinition>
          <LegalDefinition term="Render.com">Backend API hosting (cloud infrastructure).</LegalDefinition>
          <LegalDefinition term="Google (Analytics)">Anonymised website analytics — only if consent is obtained.</LegalDefinition>
          <LegalDefinition term="Email Provider">Transactional email for booking confirmations and communications.</LegalDefinition>
        </div>
        <LegalCallout type="warning">
          Controllers who object to a new sub-processor may terminate the service agreement in accordance with the notice period in their service contract.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="data-transfers" number={5} title="Cross-Border Data Transfers">
        <p>Personal data is primarily processed within India. Where data is transferred outside India (e.g., through cloud infrastructure with global data centres), we ensure:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Transfers are subject to standard contractual clauses or equivalent safeguards.</li>
          <li>Sub-processors maintain equivalent data protection standards.</li>
          <li>Indian IT Act 2000 SPDI Rules are complied with for all sensitive personal data.</li>
        </ul>
      </LegalSection>

      <LegalSection id="security" number={6} title="Security Measures">
        <p>आरंभ implements the following technical and organisational measures to protect personal data:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>TLS 1.2+ encryption for all data in transit</li>
          <li>AES-256 encryption for data at rest (MongoDB Atlas)</li>
          <li>bcrypt 12-round password hashing</li>
          <li>Role-based access control and least-privilege access</li>
          <li>Multi-layer authentication (JWT + token version revocation)</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Employee access logging and audit trails</li>
        </ul>
        <p>Full details are available in our public <a href="/legal/security-policy" className="text-[#5266EB] underline">Security Policy</a>.</p>
      </LegalSection>

      <LegalSection id="breach" number={7} title="Personal Data Breach Notification">
        <p>In the event of a personal data breach affecting Controller-provided data:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>आरंभ will notify the Controller within <strong>72 hours</strong> of becoming aware of the breach.</li>
          <li>Notification will include: nature of the breach, categories and volume of data affected, likely consequences, and measures taken or proposed.</li>
          <li>The Controller is responsible for notifying affected data subjects and regulatory authorities as required by applicable law.</li>
          <li>आरंभ will provide full cooperation and information to support the Controller's response.</li>
        </ul>
      </LegalSection>

      <LegalSection id="rights" number={8} title="Assisting with Data Subject Rights">
        <p>आरंभ will assist the Controller in fulfilling data subject requests (access, correction, deletion, portability) by:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Providing relevant data extracts within <strong>5 business days</strong> of a verified Controller request.</li>
          <li>Deleting or anonymising specific data records within <strong>10 business days</strong> of a Controller instruction, subject to legal retention requirements.</li>
          <li>Flagging any data subject requests received directly by आरंभ to the Controller for handling.</li>
        </ul>
      </LegalSection>

      <LegalSection id="termination" number={9} title="Termination & Data Deletion">
        <p>Upon termination of the service relationship or DPA:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>आरंभ will, at the Controller's choice, either return all personal data in a machine-readable format or securely delete it within <strong>30 days</strong> of termination.</li>
          <li>Data retained by legal obligation will be clearly documented and deleted upon expiry of the legal retention period.</li>
          <li>A written confirmation of deletion will be provided upon request.</li>
        </ul>
      </LegalSection>

      <LegalSection id="contact" number={10} title="Contact for DPA Enquiries">
        <p>To enter into a formal DPA, request a signed copy, or discuss corporate data processing arrangements:</p>
        <div className="space-y-1">
          <LegalDefinition term="Email">support@aarambhatravels.in (subject: "DPA Request")</LegalDefinition>
          <LegalDefinition term="Response time">We respond to DPA enquiries within <strong>5 business days</strong>.</LegalDefinition>
        </div>
        <LegalCallout type="info">
          This page provides a summary of our standard DPA terms. A full legally executed DPA is available upon request for corporate clients with formal data sharing requirements.
        </LegalCallout>
      </LegalSection>
    </LegalPageLayout>
  );
}
