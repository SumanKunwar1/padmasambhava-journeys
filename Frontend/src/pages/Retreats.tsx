// src/pages/Retreats.tsx
import TripListingPage from "@/components/trips/TripListingPage";
import destBhutan from "@/assets/dest-bhutan.jpg";

const destinations = [
  "All", "Rishikesh", "Dharamsala", "Nepal", 
  "Sri Lanka", "Bhutan", "Kerala"
];

const Retreats = () => {
  return (
    <TripListingPage
      title="Explore all Wellness & Spiritual Retreats"
      tagline="Find Your Inner Peace"
      subtitle="Disconnect to reconnect. Rejuvenate your mind, body, and soul."
      description="Step away from the chaos of everyday life and immerse yourself in transformative retreat experiences. Our curated retreats offer meditation, yoga, spiritual practices, and wellness activities designed to help you find balance and inner peace. From Ayurvedic treatments in Kerala to yoga by the Ganges in Rishikesh."
      heroImage="https://res.cloudinary.com/dihev9qxc/image/upload/v1772350096/WhatsApp_Image_2026-02-23_at_16.54.20_qc4oyc.jpg"
      filterDestinations={destinations}
      tripCategory="retreats"
    />
  );
};

export default Retreats;