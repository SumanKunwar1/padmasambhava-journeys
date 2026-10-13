import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { useToast } from "@/hooks/use-toast";
import { customTripService } from "@/services/customTrips";

const channels = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "sms", label: "SMS" },
  { id: "rcs", label: "RCS" },
  { id: "email", label: "Email" },
] as const;

type ChannelId = (typeof channels)[number]["id"];

const emptyForm = { name: "", email: "", phone: "" };
const noChannels: Record<ChannelId, boolean> = {
  whatsapp: false,
  sms: false,
  rcs: false,
  email: false,
};

const OptIn = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [selected, setSelected] = useState(noChannels);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const chosen = channels.filter((channel) => selected[channel.id]);
  const canSubmit = consent && chosen.length > 0 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      // Lands in the admin panel under Custom Trips, tagged so the team can
      // tell an opt-in from a tailor-made trip request. The message keeps a
      // record of what the person agreed to and when.
      await customTripService.submitRequest({
        ...formData,
        destination: "Website Opt-In",
        message: `Opted in to receive messages via ${chosen
          .map((channel) => channel.label)
          .join(", ")}. Consent given on ${new Date().toISOString()} at ${window.location.href}.`,
      });
      setIsDone(true);
    } catch (error) {
      const serverMessage = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast({
        title: "Could not save your opt-in",
        description: serverMessage || "Please try again, or reach us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
          >
            Stay Updated With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Opt in to receive trip updates, booking information and offers from Padmasambhava Trip
            Pvt. Ltd.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-5 sm:p-8"
        >
          {isDone ? (
            <div className="text-center py-6" role="status">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold mb-2">You are opted in</h2>
              <p className="text-muted-foreground mb-6">
                Thank you. You will now receive messages from us on the channels you selected. You
                can opt out at any time.
              </p>
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="optin-name" className="text-sm font-medium mb-1 block">
                  Full Name *
                </label>
                <Input
                  id="optin-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="optin-phone" className="text-sm font-medium mb-1 block">
                    Mobile Number (with country code) *
                  </label>
                  <Input
                    id="optin-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="optin-email" className="text-sm font-medium mb-1 block">
                    Email Address *
                  </label>
                  <Input
                    id="optin-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium mb-2">
                  How would you like to hear from us? *
                </legend>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {channels.map((channel) => (
                    <label
                      key={channel.id}
                      htmlFor={`optin-${channel.id}`}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        id={`optin-${channel.id}`}
                        checked={selected[channel.id]}
                        onCheckedChange={(checked) =>
                          setSelected({ ...selected, [channel.id]: checked === true })
                        }
                        disabled={isSubmitting}
                      />
                      {channel.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label
                htmlFor="optin-consent"
                className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer"
              >
                <Checkbox
                  id="optin-consent"
                  className="mt-0.5"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  disabled={isSubmitting}
                />
                <span>
                  I agree to receive messages from Padmasambhava Trip Pvt. Ltd. on the channels
                  selected above, including booking confirmations, trip updates, reminders and
                  promotional offers. Message frequency varies. Message and data rates may apply.
                  Consent is not a condition of purchase. I have read the{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms &amp; Conditions
                  </Link>
                  .
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!canSubmit}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Opt In"}
              </Button>
            </form>
          )}
        </motion.div>

        <div className="max-w-2xl mx-auto mt-8 text-sm text-muted-foreground space-y-2">
          <h2 className="text-base font-display font-bold text-foreground">How to opt out</h2>
          <p>
            You can stop receiving messages at any time. Reply <strong>STOP</strong> to any
            WhatsApp, SMS or RCS message, use the unsubscribe link in any email, or write to{" "}
            <a href="mailto:info@padmasambhavatrip.com" className="text-primary hover:underline">
              info@padmasambhavatrip.com
            </a>
            . Reply <strong>HELP</strong> for assistance, or call (+91) 73639 33945.
          </p>
          <p>We do not sell or share your mobile number with third parties for marketing.</p>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default OptIn;
