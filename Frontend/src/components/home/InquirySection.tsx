// src/components/home/InquirySection.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { customTripService } from "@/services/customTrips";

type InquiryType = "Inquiry" | "Suggestion";

const emptyForm = { name: "", email: "", phone: "", message: "" };

export function InquirySection() {
  const { toast } = useToast();
  const [type, setType] = useState<InquiryType>("Inquiry");
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Lands in the admin panel under Custom Trips, tagged so the team can
      // tell a homepage message from a tailor-made trip request.
      await customTripService.submitRequest({
        ...formData,
        destination: `Website ${type}`,
      });

      toast({
        title: type === "Inquiry" ? "Inquiry sent!" : "Thank you for your suggestion!",
        description: "Our team will get back to you within 24 hours.",
      });
      setFormData(emptyForm);
    } catch (error) {
      const serverMessage = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast({
        title: "Could not send your message",
        description: serverMessage || "Please try again, or reach us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-muted" aria-labelledby="inquiry-heading" data-testid="inquiry-section">
      <div className="container-custom grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <h2 id="inquiry-heading" className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Inquiry & Suggestions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Planning a journey, or have an idea to make ours better? Write to us — we read every message.
          </p>
          <ul className="space-y-3 text-sm sm:text-base">
            <li>
              <a href="tel:+917363933945" className="inline-flex items-center gap-3 hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                (+91) 73639 33945
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/917363933945"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <a
                href="mailto:info@padmasambhavatrip.com"
                className="inline-flex items-center gap-3 hover:text-primary transition-colors break-all"
              >
                <Mail className="w-5 h-5 text-primary shrink-0" />
                info@padmasambhavatrip.com
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-card rounded-2xl border border-border p-5 sm:p-8 space-y-4"
        >
          <div className="flex gap-2" role="radiogroup" aria-label="Message type">
            {(["Inquiry", "Suggestion"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={type === option}
                onClick={() => setType(option)}
                className={`filter-pill ${type === option ? "filter-pill-active" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inquiry-name" className="text-sm font-medium mb-1 block">
                Your Name *
              </label>
              <Input
                id="inquiry-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="inquiry-phone" className="text-sm font-medium mb-1 block">
                Phone / WhatsApp *
              </label>
              <Input
                id="inquiry-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-email" className="text-sm font-medium mb-1 block">
              Email Address *
            </label>
            <Input
              id="inquiry-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="inquiry-message" className="text-sm font-medium mb-1 block">
              Your {type} *
            </label>
            <Textarea
              id="inquiry-message"
              rows={4}
              required
              placeholder={
                type === "Inquiry"
                  ? "Tell us about the trip or service you are interested in..."
                  : "Tell us what we could do better..."
              }
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Sending..." : `Send ${type}`}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
