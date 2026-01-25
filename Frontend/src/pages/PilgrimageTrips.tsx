import TripListingPage, { pilgrimageTrips } from "@/components/trips/TripListingPage";
import heroPilgrimage from "@/assets/hero-pilgrimage.jpg";

const destinations = [
  "All", "Bhutan", "Nepal", "Tibet", "Varanasi", "Rishikesh", "Bodh Gaya", 
  "Dharamsala", "Amritsar", "Tirupati", "Char Dham"
];

const PilgrimageTrips = () => {
  return (
    <TripListingPage
      title="Explore all Pilgrimage Trip Packages"
      tagline="Journey to the Divine"
      subtitle="Where every step is a prayer, and every destination is sacred."
      description="Embark on a spiritual journey that transcends the ordinary. Our pilgrimage trips are designed to nurture your soul, connect you with ancient traditions, and provide a transformative experience. From the monasteries of Bhutan to the ghats of Varanasi, walk the path of enlightenment with expert guides and like-minded travelers."
      heroImage={heroPilgrimage}
      filterDestinations={destinations}
      trips={pilgrimageTrips}
    />
  );
};

export default PilgrimageTrips;
