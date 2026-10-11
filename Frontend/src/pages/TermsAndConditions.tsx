import { PolicyPage, PolicySection } from "@/components/shared/PolicyPage";

const sections: PolicySection[] = [
  {
    heading: "Acceptance of These Terms",
    paragraphs: [
      "These terms apply to your use of www.padmasambhavatrip.com and to every booking made with Padmasambhava Trip Pvt. Ltd. (\"we\", \"us\", \"our\"). By using the website or making a booking, you agree to these terms, our Privacy Policy and our Cancellation Policy. The person making a booking accepts these terms on behalf of everyone travelling on it.",
    ],
  },
  {
    heading: "Our Services",
    paragraphs: [
      "We arrange pilgrimage tours, group and customised trips, retreats, visa assistance, travel documentation and travel insurance. Many of these services are provided by independent suppliers such as hotels, airlines, transport operators and guides, and are also subject to those suppliers' own terms.",
    ],
  },
  {
    heading: "Bookings and Payment",
    bullets: [
      "A booking is confirmed only when we have received the booking amount and sent you a written confirmation.",
      "The balance must be paid by the date shown on your booking confirmation. If it is not, we may treat the booking as cancelled by you.",
      "You are responsible for giving us accurate names and details exactly as they appear on each traveller's passport or identity document.",
      "Trips offered on EMI are subject to the terms of the finance provider.",
    ],
  },
  {
    heading: "Prices",
    paragraphs: [
      "Prices are quoted in Indian Rupees. Amounts shown in other currencies are converted at the day's exchange rate and are indicative only. Prices include only what is listed under inclusions for each trip. Before you have paid in full, we may revise a price if taxes, government fees, fuel costs or exchange rates change significantly; we will tell you before any change takes effect.",
    ],
  },
  {
    heading: "Cancellations and Refunds",
    paragraphs: [
      "Cancellations, rescheduling and refunds are covered by our Cancellation Policy, which forms part of these terms.",
    ],
  },
  {
    heading: "Changes to Itineraries",
    paragraphs: [
      "We aim to run every trip as described. Weather, road conditions, local regulations, festivals, the availability of darshan or audiences, and other circumstances can require changes to routes, hotels, transport or the order of activities. Where this happens we will provide the closest suitable alternative. Dates and availability of religious audiences and ceremonies are decided by the relevant offices and cannot be guaranteed by us.",
    ],
  },
  {
    heading: "Travel Documents, Visas and Permits",
    paragraphs: [
      "You are responsible for holding a valid passport and any visas, permits and vaccination certificates needed for your trip. Where we assist with visas or permits, the decision rests entirely with the issuing authority. We are not responsible if an application is refused or delayed, and fees paid are not refundable.",
    ],
  },
  {
    heading: "Health, Fitness and Insurance",
    paragraphs: [
      "Many of our trips involve high altitude, long road journeys and basic facilities. You must make sure you are medically fit to travel and tell us in advance about any condition that may affect your trip. We strongly recommend comprehensive travel insurance covering medical treatment, evacuation, cancellation and loss of baggage.",
    ],
  },
  {
    heading: "Your Responsibilities",
    bullets: [
      "Follow the laws and customs of the places you visit, and the rules of monasteries, temples and other sacred sites.",
      "Follow the reasonable instructions of the trip leader and guides.",
      "Take care of your own belongings and valuables.",
      "Pay for any damage or loss you cause to accommodation, vehicles or other property.",
    ],
    paragraphs: [
      "We may remove a traveller from a trip, without refund, if their behaviour puts the safety or wellbeing of the group at risk.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "We act as an organiser and agent for independent suppliers and are not liable for their acts or omissions. We are not responsible for loss, injury, delay or expense caused by events outside our control, including natural disasters, weather, strikes, political unrest, government action, epidemics, and delays or cancellations by airlines or other carriers. To the extent the law allows, our total liability for any claim is limited to the amount you paid us for the booking concerned.",
    ],
  },
  {
    heading: "Website Use and Content",
    paragraphs: [
      "All text, photographs, logos and designs on this website belong to us or our licensors and may not be copied or reused without written permission. You agree not to misuse the website, attempt to gain unauthorised access to it, or submit false information. Trip descriptions and photographs are for guidance; actual conditions may differ.",
    ],
  },
  {
    heading: "Messages From Us",
    paragraphs: [
      "When you make an enquiry or booking, we will contact you about it by phone, email, SMS or WhatsApp. Promotional messages are sent only to people who have opted in, and you can opt out at any time as described in our Privacy Policy.",
    ],
  },
  {
    heading: "Governing Law and Disputes",
    paragraphs: [
      "These terms are governed by the laws of India. Any dispute will first be raised with us in writing so we can try to resolve it. If it cannot be resolved, it will be subject to the exclusive jurisdiction of the courts at Siliguri, West Bengal.",
    ],
  },
  {
    heading: "Changes to These Terms",
    paragraphs: [
      "We may update these terms from time to time. The version in force on the date of your booking confirmation applies to that booking.",
    ],
  },
];

const TermsAndConditions = () => (
  <PolicyPage
    title="Terms & Conditions"
    intro="The terms that apply when you use our website or book a trip with us."
    lastUpdated="11 October 2026"
    sections={sections}
  />
);

export default TermsAndConditions;
