// src/components/agent/AgentBookingFormModal.tsx
// ⭐ DROP-IN replacement for BookingFormModal on AGENT pages only
// Uses /api/v1/agent-bookings instead of /api/v1/bookings
// Accepts agentTripId (AgentTrip._id) — no Trip lookup on backend

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { agentBookingService } from "@/services/agentBookings";

interface AgentBookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName?: string;
  agentTripId?: string;      // ⭐ AgentTrip._id — NOT the public Trip._id
  travelers?: number;
  selectedDate?: string;
  selectedPrice?: number;
  totalAmount?: number;
  occupancyType?: string;
}

export function AgentBookingFormModal({
  isOpen,
  onClose,
  tripName,
  agentTripId,
  travelers = 1,
  selectedDate,
  selectedPrice,
  totalAmount,
  occupancyType,
}: AgentBookingFormModalProps) {
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

    if (!agentTripId || !tripName) {
      toast({
        title: "Error",
        description: "Trip information is missing",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Please fill required fields",
        description: "Name, email and phone are required",
        variant: "destructive",
      });
      return;
    }

    // Pull logged-in agent info from localStorage
    const storedUser = localStorage.getItem("user");
    const agent = storedUser ? JSON.parse(storedUser) : null;

    try {
      setIsSubmitting(true);

      await agentBookingService.createBooking({
        agentTripId,
        tripName,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        travelers,
        selectedDate,
        occupancyType,
        selectedPrice,
        totalAmount: totalAmount || 0,
        // Send agent identity — backend will prefer JWT token if present
        agentName: agent?.fullName || agent?.name || "",
        agentEmail: agent?.email || "",
        agentCompany: agent?.companyName || agent?.agencyName || "",
      });

      toast({
        title: "Booking Request Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      onClose();
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Agent booking error:", error);
      toast({
        title: "Booking Failed",
        description:
          error.response?.data?.message ||
          "Failed to submit booking. Please try again.",
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

          {/* Modal */}
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
                    {tripName ? `Book: ${tripName}` : "Book This Package"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fill in your client's details below
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
                      placeholder="Client Name *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Client Email *"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Client Phone *"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Any special requests or questions?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Booking Summary */}
                  {totalAmount !== undefined && totalAmount > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Travelers:</span>
                        <span className="font-medium">{travelers}</span>
                      </div>
                      {occupancyType && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Room Type:</span>
                          <span className="font-medium">{occupancyType}</span>
                        </div>
                      )}
                      {selectedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Departure:</span>
                          <span className="font-medium">{selectedDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                        <span>B2B Total:</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Footer */}
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