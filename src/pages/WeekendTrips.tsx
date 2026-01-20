import TripListingPage from "@/components/trips/TripListingPage";
import destSpiti from "@/assets/dest-spiti.jpg";

const destinations = [
  "All", "Tirthan Valley", "Mcleodganj", "Chopta", "Kasol", "Manali", 
  "Rishikesh", "Nainital", "Mussoorie", "Jaipur", "Udaipur"
];

const WeekendTrips = () => {
  return (
    <TripListingPage
      title="Explore all Weekend Getaways"
      tagline="Escape the Ordinary"
      subtitle="Short trips, big memories. Because weekends are made for adventures."
      description="Need a quick escape from the daily grind? Our weekend trips are perfect for those who want to maximize their free time with unforgettable experiences. Just pack your bags and let us handle the rest. From mountain retreats to peaceful valleys..."
      heroImage={destSpiti}
      filterDestinations={destinations}
    />
  );
};

export default WeekendTrips;
