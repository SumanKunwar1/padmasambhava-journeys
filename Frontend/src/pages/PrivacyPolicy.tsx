import { PolicyPage, PolicySection } from "@/components/shared/PolicyPage";

const sections: PolicySection[] = [
  {
    heading: "Who We Are",
    paragraphs: [
      "Padmasambhava Trip Pvt. Ltd. (\"we\", \"us\", \"our\") is a travel company based in Siliguri, West Bengal, India. We arrange pilgrimage tours, group and customised trips, retreats, visa assistance, travel documentation and travel insurance. This policy explains what personal information we collect through www.padmasambhavatrip.com and our other channels, and how we use and protect it.",
    ],
  },
  {
    heading: "Information We Collect",
    bullets: [
      "Contact details: your name, email address, mobile number and postal address.",
      "Booking details: the trip you choose, travel dates, number of travellers, room and meal preferences, and any special requests.",
      "Travel documents: passport details, visa information, photographs and other identity documents you upload for visa, documentation or insurance services.",
      "Health and emergency information you choose to share, such as medical conditions, dietary needs or an emergency contact, where it is needed to run a trip safely.",
      "Account details: your login email and an encrypted password if you create an account.",
      "Payment details: the amount, date and reference of your payment. Card, UPI and net-banking details are handled by our payment partners and are not stored on our servers.",
      "Messages you send us through forms, email, phone or WhatsApp.",
      "Basic technical information such as your browser type and the pages you visit.",
    ],
  },
  {
    heading: "How We Use Your Information",
    bullets: [
      "To respond to enquiries and prepare quotations.",
      "To make and manage bookings with hotels, transport operators, guides and other suppliers.",
      "To process visa, documentation and insurance requests on your behalf.",
      "To send booking confirmations, itineraries, payment receipts, reminders and important trip updates.",
      "To send offers and news, only where you have opted in to receive them.",
      "To improve our website and services, and to prevent fraud or misuse.",
      "To meet our legal, tax and accounting obligations.",
    ],
  },
  {
    heading: "Consent to Communication",
    paragraphs: [
      "We collect personal details like your name, email address, and phone number etc. By sharing your information, you authorize Padmasambhava Trip to contact you via SMS, RCS, WhatsApp, Email, and other communication channels. This consent overrides any NDNC/DND registration as per TRAI regulations.",
    ],
  },
  {
    heading: "Messaging Consent (WhatsApp, SMS, RCS and Email)",
    paragraphs: [
      "We send promotional messages only to people who have opted in, for example through our opt-in page. Message frequency varies, and message and data rates may apply. Consent is not a condition of purchase.",
      "You can opt out at any time by replying STOP to a WhatsApp or SMS message, using the unsubscribe link in an email, or writing to info@padmasambhavatrip.com. We may still send you essential messages about a booking you have made.",
      "We do not sell, rent or share your mobile number or your messaging consent with third parties or affiliates for their marketing.",
    ],
  },
  {
    heading: "Who We Share Information With",
    paragraphs: [
      "We share only what is needed, and only with:",
    ],
    bullets: [
      "Travel suppliers who deliver your trip, such as hotels, airlines, transport operators, guides and our partner offices in the destination country.",
      "Embassies, consulates, visa centres and government authorities, where required for visas and permits.",
      "Insurance providers, when you ask us to arrange travel insurance.",
      "Payment gateways and banks that process your payment.",
      "Service providers who host our website, store files and deliver our messages, under confidentiality obligations.",
      "Authorities, when the law requires us to disclose information.",
    ],
  },
  {
    heading: "Cookies and Local Storage",
    paragraphs: [
      "Our website stores a small amount of information in your browser to keep you signed in and to remember preferences such as your chosen currency. You can clear this at any time through your browser settings, although some features may then stop working.",
    ],
  },
  {
    heading: "How Long We Keep Information",
    paragraphs: [
      "We keep booking and payment records for as long as the law requires for tax and accounting purposes. Travel documents uploaded for a visa or permit are kept only as long as needed to complete the service and handle any follow-up. Enquiries that do not lead to a booking are deleted or anonymised after a reasonable period.",
    ],
  },
  {
    heading: "How We Protect Information",
    paragraphs: [
      "We use encrypted connections, access controls and trusted service providers to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we will tell you and the relevant authorities if a breach affecting your information occurs, as required by law.",
    ],
  },
  {
    heading: "Your Rights",
    bullets: [
      "Ask for a copy of the personal information we hold about you.",
      "Ask us to correct information that is wrong or out of date.",
      "Ask us to delete your information, where we are not required by law to keep it.",
      "Withdraw your consent to marketing messages at any time.",
      "Raise a complaint with us about how your information has been handled.",
    ],
    paragraphs: [
      "You can do any of the following by writing to info@padmasambhavatrip.com. We will reply within a reasonable time.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Our services are not directed at children. Bookings for travellers under 18 must be made by a parent or guardian, who provides the child's details on their behalf.",
    ],
  },
  {
    heading: "Changes to This Policy",
    paragraphs: [
      "We may update this policy from time to time. The latest version will always be on this page with the date it was last updated.",
    ],
  },
];

const PrivacyPolicy = () => (
  <PolicyPage
    title="Privacy Policy"
    intro="How Padmasambhava Trip Pvt. Ltd. collects, uses and protects your personal information."
    lastUpdated="12 October 2026"
    sections={sections}
  />
);

export default PrivacyPolicy;
