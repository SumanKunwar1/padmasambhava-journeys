// src/pages/CruiseTrips.tsx
import TripListingPage from "@/components/trips/TripListingPage";

const destinations = [
  "All", 
  "Mediterranean", 
  "Caribbean", 
  "Alaska", 
  "Norwegian Fjords",
  "Asia Pacific", 
  "Dubai", 
  "Singapore", 
  "Thailand", 
  "Vietnam",
  "Europe", 
  "Greek Islands", 
  "South Pacific", 
  "Antarctica"
];

const CruiseTrips = () => {
  return (
    <TripListingPage
      title="Explore all Cruise Trip Packages"
      tagline="Sail Away to Paradise"
      subtitle="Luxury cruise experiences across the world's most beautiful waters"
      description="Embark on an unforgettable cruise journey across stunning destinations. Experience the ultimate luxury of sailing through crystal-clear waters while visiting multiple ports in a single trip. Our cruise packages offer all-inclusive amenities including gourmet dining, world-class entertainment, spa services, and exciting shore excursions. Whether you dream of exploring the Mediterranean coastline, Caribbean islands, or Norwegian fjords, find the perfect cruise package that combines relaxation, adventure, and unparalleled service."
      heroImage="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&h=400&fit=crop"
      filterDestinations={destinations}
      tripCategory="travel-styles"
      tripType="cruise"
    />
  );
};

export default CruiseTrips;