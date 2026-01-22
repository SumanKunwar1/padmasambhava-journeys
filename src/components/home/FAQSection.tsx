import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Padmasambhava Trip?",
    answer: "Padmasambhava Trip is a premier travel company specializing in pilgrimage tours, spiritual retreats, and transformative travel experiences. We curate journeys to sacred destinations across India and internationally, helping travelers find inner peace and meaningful connections.",
  },
  {
    question: "Who can join Padmasambhava Trip trips?",
    answer: "Our trips are open to everyone! Whether you're a solo traveler, couple, or group of friends, we welcome all age groups and backgrounds. Our pilgrimage trips are especially suited for those seeking spiritual growth and cultural immersion.",
  },
  {
    question: "Can solo travelers join group trips?",
    answer: "Absolutely! In fact, a large portion of our travelers are solo adventurers. Our group trips are designed to foster connections, and many travelers have made lifelong friends through our journeys. We ensure a safe and welcoming environment for everyone.",
  },
  {
    question: "What is the group size?",
    answer: "Our group sizes typically range from 12-20 travelers, depending on the destination. This ensures personalized attention from our trip captains while maintaining the vibrant group energy that makes our trips special.",
  },
  {
    question: "What is included in the trip package?",
    answer: "Our packages typically include accommodation, meals as specified, transportation, guided tours, entry fees to monuments and sacred sites, and travel insurance. Specific inclusions vary by trip and are clearly mentioned in each itinerary.",
  },
  {
    question: "Is it safe to travel with Padmasambhava Trip?",
    answer: "Safety is our top priority. All our trips are led by trained trip captains, we use verified accommodations and transportation, and we provide complimentary travel insurance. We also have 24/7 support available throughout your journey.",
  },
  {
    question: "Can I customise my trip itinerary?",
    answer: "Yes! We offer customised trip options where you can tailor the itinerary, accommodation, and experiences according to your preferences. Contact our team to discuss your requirements.",
  },
  {
    question: "What are the payment options?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and offer zero-cost EMI options. You can also secure your spot by paying just 20% of the trip cost initially and complete the payment later.",
  },
  {
    question: "How can I contact Padmasambhava Trip for help?",
    answer: "You can reach us via email at info@padmasambhavatrip.com, call us at (+91) 9876543210, or message us on WhatsApp. Our team is available to assist you with any queries.",
  },
];

export function FAQSection() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
