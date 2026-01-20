import TripListingPage from "@/components/trips/TripListingPage";
import destBali from "@/assets/dest-bali.jpg";

const destinations = [
  "All", "Philippines", "Japan", "Russia", "Vietnam", "Bali", "Thailand", 
  "Dubai", "Georgia", "Almaty", "Sri Lanka", "Northern Lights", "Bhutan", "Azerbaijan"
];

const InternationalTrips = () => {
  return (
    <TripListingPage
      title="Explore all International Tour Packages"
      tagline="Life's too short for one place"
      subtitle="Trips so good, your camera roll will never recover."
      description="Caught up in the hustling culture and trying to catch a break? You should! And everyone else, too, should plan for a little runaway. Now is the time to put your plan into action, because Padmasambhava Trip has got you all covered. Whether you're dreaming of..."
      heroImage={destBali}
      filterDestinations={destinations}
    />
  );
};

export default InternationalTrips;
