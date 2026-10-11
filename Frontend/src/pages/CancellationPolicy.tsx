import { PolicyPage, PolicySection } from "@/components/shared/PolicyPage";

const sections: PolicySection[] = [
  {
    heading: "How to Cancel",
    paragraphs: [
      "All cancellation requests must be made in writing by the person who made the booking, by email to info@padmasambhavatrip.com or by WhatsApp to (+91) 73639 33945. The cancellation takes effect on the date we receive your written request, and charges are calculated from that date.",
    ],
  },
  {
    heading: "Cancellation Charges",
    paragraphs: [
      "Unless your booking confirmation states otherwise, the following charges apply, counted in days before the trip departure date:",
    ],
    bullets: [
      "30 days or more before departure: the booking amount is retained and the balance is refunded.",
      "29 to 15 days before departure: 50% of the total trip cost is charged.",
      "14 to 8 days before departure: 75% of the total trip cost is charged.",
      "7 days or less before departure, or no-show: 100% of the total trip cost is charged.",
    ],
  },
  {
    heading: "Group Trips",
    paragraphs: [
      "On fixed-departure group trips, you may cancel free of charge up to 30 days before departure and receive a full refund of the amount paid, less any non-refundable costs listed below. After that, the charges in the section above apply.",
    ],
  },
  {
    heading: "Rescheduling",
    paragraphs: [
      "You may move your booking to another departure date of the same trip at no extra charge from us, if you ask at least 15 days before departure and seats are available. Any difference in trip price, and any charges made by airlines, hotels or other suppliers, are payable by you. Requests made later than this are treated as a cancellation.",
    ],
  },
  {
    heading: "Non-Refundable Costs",
    paragraphs: ["The following are non-refundable once paid or issued, whenever you cancel:"],
    bullets: [
      "Visa fees, permit fees and documentation service charges.",
      "Travel insurance premiums.",
      "Flight, train and cruise tickets, which follow the cancellation rules of the carrier.",
      "Hotel or supplier bookings made on a non-refundable basis, including peak-season and festival dates.",
      "Payment gateway and bank charges.",
    ],
  },
  {
    heading: "If We Cancel or Change a Trip",
    paragraphs: [
      "If we cancel a trip before departure, for example because the minimum group size is not reached, you may choose between a full refund of the amount paid to us and a transfer to another date or trip.",
      "If a trip is cancelled or cut short because of events outside our control, such as natural disasters, severe weather, road closures, strikes, government restrictions or epidemics, we will refund the amounts we are able to recover from our suppliers, or offer a credit towards a future trip. We are not liable for other costs you may have incurred, such as flights booked separately.",
    ],
  },
  {
    heading: "Unused Services",
    paragraphs: [
      "No refund is given for services you choose not to use after the trip has started, including missed meals, sightseeing, transfers or hotel nights, or for leaving a trip early.",
    ],
  },
  {
    heading: "Customised and International Trips",
    paragraphs: [
      "Customised trips, international trips, cruises and trips during peak season may carry different cancellation terms set by our suppliers. Where they do, the terms in your quotation or booking confirmation apply in place of the charges above.",
    ],
  },
  {
    heading: "Refund Process",
    paragraphs: [
      "Approved refunds are paid to the original payment method within 7 to 14 working days of our confirming the cancellation. Your bank may take additional time to credit the amount. Refunds are made in Indian Rupees.",
    ],
  },
];

const CancellationPolicy = () => (
  <PolicyPage
    title="Cancellation Policy"
    intro="What happens if you, or we, need to cancel or reschedule a trip."
    lastUpdated="11 October 2026"
    sections={sections}
  />
);

export default CancellationPolicy;
