// src/pages/EMITrips.tsx
import TripListingPage from "@/components/trips/TripListingPage";

const destinations = [
  "All", "Ladakh", "Spiti", "Bali", "Dubai", "Thailand", "Vietnam", 
  "Japan", "Maldives", "Kashmir", "Rajasthan", "Kerala", "Singapore",
  "Malaysia", "Sri Lanka", "Bhutan", "Nepal"
];

const EMITrips = () => {
  return (
    <TripListingPage
      title="Explore all EMI Trip Packages"
      tagline="Travel Now, Pay Later"
      subtitle="Book your dream vacation with flexible EMI options"
      description="Make your travel dreams come true with our easy EMI payment options. Choose from a wide range of domestic and international destinations and pay in comfortable monthly installments. No need to wait or save for months - start your journey now with zero down payment options available on select packages. Enjoy hassle-free booking with instant approval and flexible tenure options from 3 to 12 months."
      heroImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop"
      filterDestinations={destinations}
      tripCategory="emi-trips"
    />
  );
};

export default EMITrips;