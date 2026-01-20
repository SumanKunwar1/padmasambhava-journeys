import TripListingPage from "@/components/trips/TripListingPage";
import destBhutan from "@/assets/dest-bhutan.jpg";

const destinations = [
  "All", "Rishikesh", "Dharamsala", "Bali", "Thailand", "Nepal", 
  "Sri Lanka", "Bhutan", "Kerala"
];

const Retreats = () => {
  return (
    <TripListingPage
      title="Explore all Wellness & Spiritual Retreats"
      tagline="Find Your Inner Peace"
      subtitle="Disconnect to reconnect. Rejuvenate your mind, body, and soul."
      description="Step away from the chaos of everyday life and immerse yourself in transformative retreat experiences. Our curated retreats offer meditation, yoga, spiritual practices, and wellness activities designed to help you find balance and inner peace..."
      heroImage={destBhutan}
      filterDestinations={destinations}
    />
  );
};

export default Retreats;
