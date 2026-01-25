import TripListingPage, { domesticTrips } from "@/components/trips/TripListingPage";
import destLadakh from "@/assets/dest-ladakh.jpg";

const destinations = [
  "All", "Spiti Valley", "Ladakh", "Meghalaya", "Himachal Pradesh", "Kashmir", 
  "Rajasthan", "Kerala", "Goa", "Andaman", "Northeast"
];

const DomesticTrips = () => {
  return (
    <TripListingPage
      title="Explore all Domestic Tour Packages"
      tagline="Discover Incredible India"
      subtitle="From mountains to beaches, explore the beauty of our homeland."
      description="India is a land of diverse landscapes, rich culture, and endless adventures. Our domestic trips take you to the most breathtaking destinations across the country. Whether it's the snow-capped peaks of the Himalayas, the serene backwaters of Kerala, or the golden deserts of Rajasthan - experience the best of India."
      heroImage={destLadakh}
      filterDestinations={destinations}
      trips={domesticTrips}
    />
  );
};

export default DomesticTrips;
