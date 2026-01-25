import TripListingPage, { internationalTrips } from "@/components/trips/TripListingPage";
import destBali from "@/assets/dest-bali.jpg";

const destinations = [
  "All", "Philippines", "Japan", "Russia", "Vietnam", "Bali", "Thailand", 
  "Dubai", "Georgia", "Almaty", "Sri Lanka", "Northern Lights", "Bhutan", "Azerbaijan"
];

const InternationalTrips = () => {
  return (
    <TripListingPage
      title="Explore all International Tour Packages"
      tagline="Explore the World"
      subtitle="Your passport to unforgettable experiences across the globe."
      description="Discover the magic of international travel with our carefully curated packages. From the ancient temples of Japan to the vibrant streets of Thailand, the pristine beaches of Bali to the winter wonderlands of Georgia - we bring you the best of the world at your doorstep."
      heroImage={destBali}
      filterDestinations={destinations}
      trips={internationalTrips}
    />
  );
};

export default InternationalTrips;
