// src/pages/GroupTrips.tsx
import TripListingPage from "@/components/trips/TripListingPage";
import destGeorgia from "@/assets/dest-georgia.jpg";

const destinations = [
  "All",
  "Sikkim",
  "Darjeeling",
  "Tsopema Himalchal",
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

const GroupTrips = () => {
  return (
    <TripListingPage
      title="Explore all Group Trip Packages"
      tagline="Adventure Together"
      subtitle="Meet new friends, create memories, travel the world."
      description="Join our fixed-departure group trips and travel with like-minded explorers. No solo-travel blues, no planning hassles - just show up and have the time of your life! Our trips are designed for young travelers who want adventure, fun, and unforgettable experiences with new friends."
      heroImage="https://static.vecteezy.com/system/resources/previews/023/957/756/non_2x/website-travel-trip-header-or-banner-design-vector.jpg"
      filterDestinations={destinations}
      tripCategory="group-trips"
    />
  );
};

export default GroupTrips;