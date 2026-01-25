import TripListingPage, { allTripsDatabase } from "@/components/trips/TripListingPage";
import destGeorgia from "@/assets/dest-georgia.jpg";

const destinations = [
  "All", "Spiti Valley", "Meghalaya", "Himachal Pradesh", "Dubai", "Almaty", 
  "Bhutan", "Bali", "Vietnam", "Georgia", "Sri Lanka", "Japan", "Thailand"
];

const GroupTrips = () => {
  return (
    <TripListingPage
      title="Explore all Group Trip Packages"
      tagline="Adventure Together"
      subtitle="Meet new friends, create memories, travel the world."
      description="Join our fixed-departure group trips and travel with like-minded explorers. No solo-travel blues, no planning hassles - just show up and have the time of your life! Our trips are designed for young travelers who want adventure, fun, and unforgettable experiences with new friends."
      heroImage={destGeorgia}
      filterDestinations={destinations}
      trips={allTripsDatabase}
    />
  );
};

export default GroupTrips;
