// src/pages/Retreats.tsx
import TripListingPage from "@/components/trips/TripListingPage";

const destinations = [
  "All", "Rishikesh", "Dharamsala", "Bali", "Thailand", "Nepal", 
  "Sri Lanka", "Bhutan", "Kerala"
];

const Healings = () => {
  return (
    <TripListingPage
      title="Explore all Wellness & Spiritual Retreats"
      tagline="Find Your Inner Peace"
      subtitle="Disconnect to reconnect. Rejuvenate your mind, body, and soul."
      description="Step away from the chaos of everyday life and immerse yourself in transformative retreat experiences. Our curated retreats offer meditation, yoga, spiritual practices, and wellness activities designed to help you find balance and inner peace. From Ayurvedic treatments in Kerala to yoga by the Ganges in Rishikesh."
      heroImage="https://www.nomadicexpeditions.com/wp-content/uploads/2025/10/NOMADIC-BLOG-Essential-Guide-to-Wellness-and-Spiritual-Experiences-in-Bhutan-1.png"
      filterDestinations={destinations}
      tripCategory="healing"
    />
  );
};

export default Healings;