// src/pages/HomeSectionTrips.tsx
import TripListingPage from "@/components/trips/TripListingPage";
import type { HomeTourSectionConfig } from "@/lib/home-sections";

/** The "View All" listing page behind a homepage tour section. */
const HomeSectionTrips = ({ section }: { section: HomeTourSectionConfig }) => {
  return (
    <TripListingPage
      title={section.title}
      tagline={section.title}
      subtitle={section.description}
      description={[section.description, section.highlights].filter(Boolean).join(" ")}
      heroImage="https://static.vecteezy.com/system/resources/previews/023/957/756/non_2x/website-travel-trip-header-or-banner-design-vector.jpg"
      tripRoute={section.route}
    />
  );
};

export default HomeSectionTrips;
