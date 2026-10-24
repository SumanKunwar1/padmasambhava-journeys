// src/components/shared/BookingFormModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { bookingService } from "@/services/bookings";
import { Price } from "@/components/shared/Price";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName?: string;
  tripId?: string;
  travelers?: number;
  selectedDate?: string;
  selectedPrice?: number;
  totalAmount?: number;
  /** The trip's manual USD price, so the total shown matches the trip card. */
  priceUSD?: number;
  /** Set per trip in admin: also ask for WhatsApp, pick-up location and meditation. */
  showRetreatFields?: boolean;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  pickupLocation: "",
  meditationRequired: "",
  message: "",
};

export function BookingFormModal({
  isOpen, 
  onClose, 
  tripName,
  tripId,
  travelers = 1,
  selectedDate,
  selectedPrice,
  totalAmount,
  priceUSD,
  showRetreatFields = false,
}: BookingFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The submit button sits outside the <form>, so browser validation never runs.
    const missing = !formData.name || !formData.email || !formData.phone ||
      (showRetreatFields && (!formData.pickupLocation || !formData.meditationRequired));
    if (missing) {
      toast({
        title: "Missing details",
        description: "Please fill in all fields marked with *",
        variant: "destructive",
      });
      return;
    }

    if (!tripId || !tripName) {
      toast({
        title: "Error",
        description: "Trip information is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await bookingService.createBooking({
        tripId,
        tripName,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        ...(showRetreatFields && {
          whatsapp: formData.whatsapp,
          pickupLocation: formData.pickupLocation,
          meditationRequired: formData.meditationRequired === "yes",
        }),
        travelers,
        selectedDate,
        selectedPrice,
        totalAmount: totalAmount || 0,
      });

      toast({
        title: "Booking Request Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      onClose();
      setFormData(emptyForm);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "Failed to submit booking. Please try again.",
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal Container - Uses Flexbox for True Centering */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-md max-h-[90svh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <h3 className="text-xl font-display font-semibold">
                  {tripName ? `Book: ${tripName}` : "Book Your Trip"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {showRetreatFields && (
                    <>
                      <div>
                        <Input
                          type="tel"
                          placeholder="WhatsApp Number"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Pick-up Location *"
                          value={formData.pickupLocation}
                          onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <fieldset disabled={isSubmitting}>
                        <legend className="text-sm font-medium mb-2">Meditation Required? *</legend>
                        <div className="flex gap-3">
                          {(["yes", "no"] as const).map((option) => (
                            <label
                              key={option}
                              className="flex flex-1 items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                            >
                              <input
                                type="radio"
                                name="meditationRequired"
                                value={option}
                                checked={formData.meditationRequired === option}
                                onChange={(e) => setFormData({ ...formData, meditationRequired: e.target.value })}
                              />
                              {option === "yes" ? "Yes" : "No"}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </>
                  )}
                  <div>
                    <Textarea
                      placeholder="Any special requests or questions?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Booking Summary */}
                  {totalAmount && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {showRetreatFields ? "Total Adults:" : "Travelers:"}
                        </span>
                        <span className="font-medium">{travelers}</span>
                      </div>
                      {selectedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{selectedDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                        <span>Total Amount:</span>
                        <Price amount={totalAmount} priceUSD={priceUSD} />
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Footer with Submit Button - Sticky at Bottom */}
              <div className="border-t border-border p-6 shrink-0 bg-background">
                <Button 
                  onClick={handleSubmit} 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}