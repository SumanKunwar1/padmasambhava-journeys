// src/components/home/TourGrid.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { BookingFormModal } from "@/components/shared/BookingFormModal";
import { TourCard, type TourTrip } from "@/components/home/TourCard";

interface TourGridProps {
  trips: TourTrip[];
  imageShape?: "landscape" | "square";
}

/** A row of tour cards plus the booking form their "Book Now" buttons open. */
export function TourGrid({ trips, imageShape }: TourGridProps) {
  const [bookingTrip, setBookingTrip] = useState<TourTrip | null>(null);

  return (
    <>
      {/* Two per row on phones keeps a seven-section homepage from becoming an
          endless single column, and nothing needs sideways scrolling. */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {trips.map((trip, index) => (
          <motion.div
            key={trip._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <TourCard trip={trip} imageShape={imageShape} onBookNow={setBookingTrip} />
          </motion.div>
        ))}
      </div>

      <BookingFormModal
        isOpen={bookingTrip !== null}
        onClose={() => setBookingTrip(null)}
        tripId={bookingTrip?._id}
        tripName={bookingTrip?.name}
        selectedPrice={bookingTrip?.price}
        // One traveller at the trip's price, so the booking reaches the admin
        // panel with the real amount instead of 0.
        totalAmount={bookingTrip?.price}
        priceUSD={bookingTrip?.priceUSD}
      />
    </>
  );
}
