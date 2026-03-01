// src/pages/SeasonalDeals.tsx
import TripListingPage from "@/components/trips/TripListingPage";
import destThailand from "@/assets/dest-thailand.jpg";

const SeasonalDeals = () => {
  return (
    <TripListingPage
      title="Seasonal Deals & Offers"
      tagline="Grab the Best Deals"
      subtitle="Limited time offers on the most amazing destinations."
      description="Don't miss out on our exclusive seasonal deals! We've handpicked the best destinations with incredible discounts just for you. Book now and save big on your next adventure. These deals won't last forever..."
      heroImage="https://res.cloudinary.com/dihev9qxc/image/upload/v1772357854/f9b7a60c-3000-4447-ade9-12a71b5c9cee-Photoroom_z6b6zf.png"
      tripCategory="deals"
    />
  );
};

export default SeasonalDeals;