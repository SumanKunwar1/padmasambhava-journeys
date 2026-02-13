// src/components/shared/DalaiLamaBookingModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
  totalAmount: number;
}

export function DalaiLamaBookingModal({ 
  isOpen, 
  onClose, 
  travelers,
  selectedDate,
  totalAmount,
}: DalaiLamaBookingModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await dalaiLamaBookingService.createBooking({
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        travelers,
        selectedDate,
        totalAmount,
      });

      toast({
        title: "Booking Request Sent! 🙏",
        description: "Thank you! We'll contact you within 24 hours to confirm your pilgrimage booking.",
      });

      onClose();
      setFormData({ name: "", email: "", phone: "", message: "" });
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
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-md max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <div>
                  <h3 className="text-xl font-display font-semibold">
                    🙏 Dalai Lama Darshan
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sacred Pilgrimage Booking
                  </p>
                </div>
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
                  <div>
                    <Textarea
                      placeholder="Any special requests or questions about the pilgrimage?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-primary/10 rounded-lg p-4 space-y-2 border border-primary/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pilgrims:</span>
                      <span className="font-medium">{travelers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-primary/20">
                      <span>Total Amount:</span>
                      <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Important Note */}
                  <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">📝 Important:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>20% down payment required to secure booking</li>
                      <li>Final confirmation subject to H.H. Dalai Lama's schedule</li>
                      <li>Zero-cost EMI options available</li>
                    </ul>
                  </div>
                </form>
              </div>

              {/* Footer with Submit Button */}
              <div className="border-t border-border p-6 shrink-0 bg-background">
                <Button 
                  onClick={handleSubmit} 
                  className="w-full bg-primary hover:bg-primary/90" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "🎉 Submit Booking Request"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}