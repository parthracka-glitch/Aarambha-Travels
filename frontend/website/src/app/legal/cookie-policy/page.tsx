import type { Metadata } from 'next';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection, { LegalCallout, LegalDefinition } from '@/components/legal/LegalSection';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'What cookies आरंभ Tours & Travels sets, why we use them, and how to manage your cookie preferences.',
};

const TOC = [
  { id: 'what-are-cookies', label: 'What Are Cookies?' },
  { id: 'cookies-we-use', label: 'Cookies We Use' },
  { id: 'third-party', label: 'Third-Party Cookies' },
  { id: 'manage', label: 'Managing Cookies' },
  { id: 'changes', label: 'Policy Changes' },
  { id: 'contact', label: 'Contact' },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      subtitle="We use cookies to make our website work and to understand how it's used — with your consent."
      lastUpdated="August 2026"
      effectiveDate="1 September 2026"
      breadcrumb="Cookie Policy"
      toc={TOC}
    >
      <LegalSection id="what-are-cookies" number={1} title="What Are Cookies?">
        <p>Cookies are small text files placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work, improve efficiency, and provide information to website owners.</p>
        <p>We also use similar technologies such as <strong>localStorage</strong> and <strong>session storage</strong> for user preferences (e.g., cookie consent state, booking cart).</p>
      </LegalSection>

      <LegalSection id="cookies-we-use" number={2} title="Cookies We Use">
        <div className="space-y-5">
          <div>
            <p className="font-semibold text-[#111] mb-2">🔒 Essential Cookies <span className="text-xs font-normal text-gray-500 ml-1">(Always Active)</span></p>
            <div className="space-y-1">
              <LegalDefinition term="access_token">Stores your authentication JWT for logged-in sessions. Expires in 24 hours.</LegalDefinition>
              <LegalDefinition term="aarambha_cookie_consent">Stores your cookie consent choice. Expires in 6 months.</LegalDefinition>
              <LegalDefinition term="booking_draft">Preserves your booking form data across page navigations. Session-scoped.</LegalDefinition>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#111] mb-2">📊 Analytics Cookies <span className="text-xs font-normal text-gray-500 ml-1">(Requires Consent)</span></p>
            <div className="space-y-1">
              <LegalDefinition term="Google Analytics">Tracks anonymised page views, session duration, and referral sources to help us improve the site. Data is retained for 26 months.</LegalDefinition>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#111] mb-2">🎯 Marketing Cookies <span className="text-xs font-normal text-gray-500 ml-1">(Requires Consent)</span></p>
            <div className="space-y-1">
              <LegalDefinition term="Meta Pixel">Used to measure conversions from Facebook/Instagram ads. Only active with marketing consent.</LegalDefinition>
              <LegalDefinition term="Google Ads">Used for remarketing campaigns. Only active with marketing consent.</LegalDefinition>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#111] mb-2">⚙️ Preference Cookies <span className="text-xs font-normal text-gray-500 ml-1">(Requires Consent)</span></p>
            <div className="space-y-1">
              <LegalDefinition term="user_language">Remembers your language preference.</LegalDefinition>
              <LegalDefinition term="spotlight_tab">Remembers whether you were browsing tours or cars on the homepage.</LegalDefinition>
            </div>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="third-party" number={3} title="Third-Party Cookies">
        <p>Some cookies are set by third-party services embedded in our platform:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Razorpay</strong> — Sets session cookies during the payment checkout process. These are strictly necessary for payment processing and cannot be disabled during checkout.</li>
          <li><strong>Google Fonts</strong> — May log IP addresses as part of serving fonts. See Google's privacy policy.</li>
          <li><strong>YouTube (if embedded)</strong> — May set cookies if you watch embedded tour preview videos. These activate only if you interact with the video.</li>
        </ul>
        <LegalCallout type="info">
          We have no control over third-party cookies. We recommend reviewing the privacy policies of these providers for full details.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="manage" number={4} title="Managing Your Cookie Preferences">
        <p>You can manage your cookie preferences in three ways:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Our Cookie Preference Panel</strong> — Available via the banner on your first visit, or by clearing your <code>aarambha_cookie_consent</code> localStorage entry and refreshing the page.</li>
          <li><strong>Browser settings</strong> — All modern browsers allow you to block or delete cookies in Settings → Privacy. Note: blocking essential cookies may break booking functionality.</li>
          <li><strong>Opt-out links</strong> — Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-[#5266EB] underline">Google Analytics Opt-Out Browser Add-On</a>.</li>
        </ol>
        <LegalCallout type="warning">
          Blocking <strong>essential cookies</strong> will prevent you from completing bookings and logging into your account.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="changes" number={5} title="Policy Changes">
        <p>We may update this Cookie Policy when we add or change cookies. The "Last Updated" date at the top will reflect any changes. For significant changes, we will re-display the consent banner to collect fresh consent.</p>
      </LegalSection>

      <LegalSection id="contact" number={6} title="Contact">
        <p>Questions about our cookie use? Email us at <strong>support@aarambhatravels.in</strong>.</p>
        <p>See also our full <a href="/legal/privacy-policy" className="text-[#5266EB] underline">Privacy Policy</a> for how we handle your personal data.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
