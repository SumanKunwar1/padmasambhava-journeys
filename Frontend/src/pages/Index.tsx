import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { DalaiLamaDarshan } from "@/components/home/DalaiLamaDarshan"; // ← NEW IMPORT
import { ExploreDestinations } from "@/components/home/ExploreDestinations";
import { TrendingDestinations } from "@/components/home/TrendingDestinations";
import { UpcomingTrips } from "@/components/home/UpcomingTrips";
import { TourSection } from "@/components/home/TourSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CorePartners } from "@/components/home/CorePartners";
import { PartnerWithUs } from "@/components/home/PartnerWithUs";
import { WatchOurTrip } from "@/components/home/WatchOurTrip";
import { InquirySection } from "@/components/home/InquirySection";
import { GoogleReviewCta } from "@/components/home/GoogleReviewCta";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";
import { BlogsSection } from "@/components/home/BlogsSection";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { HOME_TOUR_SECTIONS } from "@/lib/home-sections";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        {/* 🙏 NEW SECTION - DALAI LAMA DARSHAN */}
        {/* <DalaiLamaDarshan /> */}
        {/* ↑ Place this section where you want it to appear on homepage */}

        <ExploreDestinations />
        <TrendingDestinations />

        <UpcomingTrips />

        {/* Tour sections - each lists the trips ticked for it in the admin trip form */}
        {HOME_TOUR_SECTIONS.map((section, index) => (
          <TourSection key={section.id} {...section} tone={index % 2 === 0 ? "background" : "muted"} />
        ))}

        <ServicesSection />
        <CorePartners />
        <PartnerWithUs />
        <WatchOurTrip />
        <InquirySection />

        <Testimonials />
        <GoogleReviewCta />
        <FAQSection />
        <BlogsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
