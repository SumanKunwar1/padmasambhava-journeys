// src/pages/InternationalTrips.tsx
import TripListingPage from "@/components/trips/TripListingPage";
import destBali from "@/assets/dest-bali.jpg";

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

const InternationalTrips = () => {
  return (
    <TripListingPage
      title="Explore all International Tour Packages"
      tagline="Explore the World"
      subtitle="Your passport to unforgettable experiences across the globe."
      description="Discover the magic of international travel with our carefully curated packages. From the ancient temples of Japan to the vibrant streets of Thailand, the pristine beaches of Bali to the winter wonderlands of Georgia - we bring you the best of the world at your doorstep."
      heroImage="https://static.vecteezy.com/system/resources/thumbnails/038/908/604/small/aerial-view-of-the-iconic-tower-bridge-connecting-londong-with-southwark-photo.jpg"
      filterDestinations={destinations}
      tripCategory="international-trips"
    />
  );
};

export default InternationalTrips;