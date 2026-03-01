// src/pages/ComboTrips.tsx
import TripListingPage from "@/components/trips/TripListingPage";
import destCombo from "@/assets/dest-combo.jpg";

const destinations = [
  "All",
  "Canada",
  "USA",
  "Australia",
  "Russia",
  "UK",
  "Europe",
  "Phillipine",
  "Dubai",
  "Azerbaijan",
  "Armenia",
  "Baku",
  "Brazil",
  "South Africa",
  "Georgia",  
  "Turkey", 
  "Egypt", 
  "Saudi Arabia", 
  "Qatar", 
  "Tanzania",  
  "Mandeep", 
  "Nepal", 
  "Korea", 
  "Taiwan", 
  "Malaysia",
  "Tibet", 
  "China", 
  "Hongkong", 
  "Loas", 
  "Cambodia", 
  "Phillipines"
];

const ComboTrips = () => {
  return (
    <TripListingPage
      title="Explore all Combo Trip Packages"
      tagline="Multi-Country Adventures"
      subtitle="Experience multiple destinations in one unforgettable journey."
      description="Discover the world with our carefully curated combo packages. Travel through multiple countries in a single trip and save on time, visas, and costs. From Southeast Asian circuits to European grand tours, create memories that span continents. Perfect for travelers who want to maximize their vacation and experience diverse cultures in one seamless journey."
      heroImage="https://res.cloudinary.com/dihev9qxc/image/upload/v1772353345/9321210_cleanup_qr0eru.png"
      filterDestinations={destinations}
      tripCategory="combo-trips"
    />
  );
};

export default ComboTrips;