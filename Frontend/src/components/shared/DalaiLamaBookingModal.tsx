// src/components/shared/DalaiLamaBookingModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { dalaiLamaBookingService } from "@/services/dalaiLamaBooking";

interface DalaiLamaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelers: number;
  selectedDate: string;
  // totalAmount removed — this is now an inquiry form
}

export function DalaiLamaBookingModal({
  isOpen,
  onClose,
  travelers,
  selectedDate,
}: DalaiLamaBookingModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing details",
        description: "Please fill in your name, email, and phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await dalaiLamaBookingService.createBooking({
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        travelers,
        selectedDate,
      });

      toast({
        title: "Inquiry Sent! 🙏",
        description:
          "Thank you! Our team will reach out within 24 hours to discuss your pilgrimage.",
      });

      onClose();
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Inquiry error:", error);
      toast({
        title: "Submission Failed",
        description:
          error.response?.data?.message ||
          "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="pointer-events-auto w-full max-w-md max-h-[92vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground px-6 py-5 shrink-0 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase opacity-75 mb-1">
                    🙏 Sacred Pilgrimage
                  </p>
                  <h3 className="text-xl font-display font-bold">
                    Send an Inquiry
                  </h3>
                  <p className="text-xs opacity-70 mt-0.5">
                    We'll respond within 24 hours
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/15 rounded-lg transition-colors mt-0.5"
                  disabled={isSubmitting}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable form */}
              <div className="overflow-y-auto flex-1 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Full Name *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone / WhatsApp Number *"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Any questions or special requirements? (optional)"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Inquiry Summary */}
                  <div className="bg-secondary rounded-xl p-4 space-y-2 border border-border">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                      Your Inquiry Details
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pilgrims:</span>
                      <span className="font-semibold text-foreground">
                        {travelers} person{travelers !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preferred Date:</span>
                      <span className="font-semibold text-foreground">
                        {selectedDate}
                      </span>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="bg-primary/6 border border-primary/20 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                    <p className="font-bold text-foreground mb-1">📋 What happens next?</p>
                    <p>Our team will reach out with full pricing, itinerary details, and answer all your questions.</p>
                    <p className="mt-1 text-muted-foreground/80">Final H.H. Dalai Lama audience subject to schedule confirmation.</p>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-5 shrink-0 bg-background">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-primary hover:bg-primary/90 font-bold text-base py-5 group"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting…"
                  ) : (
                    <>
                      Send Inquiry
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}