import TripListingPage, { comboTrips } from "@/components/trips/TripListingPage";
import destCombo from "@/assets/dest-combo.jpg";

const destinations = [
  "All", "Southeast Asia", "South Asia", "East Asia", "Europe", 
  "Thailand", "Vietnam", "Singapore", "Malaysia", "Bhutan", "India", 
  "Sri Lanka", "Japan", "Korea", "Italy", "Switzerland", "France"
];

const ComboTrips = () => {
  return (
    <TripListingPage
      title="Explore all Combo Trip Packages"
      tagline="Multi-Country Adventures"
      subtitle="Experience multiple destinations in one unforgettable journey."
      description="Discover the world with our carefully curated combo packages. Travel through multiple countries in a single trip and save on time, visas, and costs. From Southeast Asian circuits to European grand tours, create memories that span continents. Perfect for travelers who want to maximize their vacation and experience diverse cultures in one seamless journey."
      heroImage={destCombo}
      filterDestinations={destinations}
      trips={comboTrips}
    />
  );
};

export default ComboTrips;