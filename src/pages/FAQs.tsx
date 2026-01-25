import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of tours does Padmasambhava Trips offer?",
    answer: "We offer a wide range of tours including pilgrimage trips, spiritual retreats, adventure tours, weekend getaways, domestic tours across India, and international packages to destinations like Bhutan, Nepal, Tibet, and more."
  },
  {
    question: "How do I book a tour with Padmasambhava Trips?",
    answer: "You can book a tour by clicking the 'Book Now' button on any trip page, filling out the inquiry form, or contacting us directly via phone or WhatsApp. Our team will get back to you within 24 hours to confirm your booking."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Our cancellation policy varies depending on the tour type and timing. Generally, cancellations made 30+ days before departure receive a full refund minus processing fees. Cancellations within 15-30 days receive 50% refund. Please check the specific tour page for detailed cancellation terms."
  },
  {
    question: "Are your tours suitable for families with children?",
    answer: "Yes! Many of our tours are family-friendly. We offer customized itineraries that can accommodate children of all ages. Please mention your requirements when booking, and our team will suggest suitable options."
  },
  {
    question: "What is included in the tour price?",
    answer: "Tour prices typically include accommodation, meals as specified, transportation, sightseeing, guide services, and applicable permits. International tours may include flights. Specific inclusions are listed on each tour page."
  },
  {
    question: "Do you offer customized or private tours?",
    answer: "Absolutely! We specialize in customized trips tailored to your preferences, schedule, and budget. Contact us with your requirements, and our experts will design a personalized itinerary for you."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, UPI, credit/debit cards (Visa, MasterCard, RuPay), and net banking. For international payments, we also accept PayPal and wire transfers."
  },
  {
    question: "Is travel insurance included in the package?",
    answer: "Travel insurance is not typically included but is highly recommended. We can help you arrange comprehensive travel insurance at an additional cost. Some international tours may require mandatory insurance."
  },
  {
    question: "What safety measures do you follow?",
    answer: "Your safety is our top priority. We work with verified hotels and transport providers, our guides are trained in first aid, and we maintain 24/7 communication during tours. For adventure activities, we ensure all safety equipment and protocols are in place."
  },
  {
    question: "How can I contact you during my trip?",
    answer: "You'll have a dedicated tour coordinator's contact number. We're available 24/7 via phone and WhatsApp. You'll also receive an emergency contact card with all necessary numbers before departure."
  }
];

export default function FAQs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Find answers to common questions about our tours, booking process, and travel policies
            </motion.p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-medium py-5 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center bg-primary/5 rounded-2xl p-8"
            >
              <h3 className="text-xl font-display font-semibold mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our travel experts are here to help you plan your perfect journey
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+918287636079"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  📞 Call Us Now
                </a>
                <a
                  href="https://wa.me/918287636079"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
