import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ExploreDestinations } from "@/components/home/ExploreDestinations";
import { TrendingDestinations } from "@/components/home/TrendingDestinations";
import { UpcomingTrips } from "@/components/home/UpcomingTrips";
import { BookWithConfidence } from "@/components/home/BookWithConfidence";
import { VibeWithUs } from "@/components/home/VibeWithUs";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";
import { BlogsSection } from "@/components/home/BlogsSection";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TrendingDestinations />
        <ExploreDestinations />
        <UpcomingTrips />
        <BookWithConfidence />
        <VibeWithUs />
        <Testimonials />
        <FAQSection />
        <BlogsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
