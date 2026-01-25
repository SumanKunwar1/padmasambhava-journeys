import TripListingPage from "@/components/trips/TripListingPage";
import destThailand from "@/assets/dest-thailand.jpg";

const SeasonalDeals = () => {
  return (
    <TripListingPage
      title="Seasonal Deals & Offers"
      tagline="Grab the Best Deals"
      subtitle="Limited time offers on the most amazing destinations."
      description="Don't miss out on our exclusive seasonal deals! We've handpicked the best destinations with incredible discounts just for you. Book now and save big on your next adventure. These deals won't last forever..."
      heroImage={destThailand}
    />
  );
};

export default SeasonalDeals;
