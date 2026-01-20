import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ExploreDestinations } from "@/components/home/ExploreDestinations";
import { UpcomingTrips } from "@/components/home/UpcomingTrips";
import { BookWithConfidence } from "@/components/home/BookWithConfidence";
import { VibeWithUs } from "@/components/home/VibeWithUs";
import { TrendingDestinations } from "@/components/home/TrendingDestinations";
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
        <ExploreDestinations />
        <UpcomingTrips />
        <BookWithConfidence />
        <VibeWithUs />
        <TrendingDestinations />
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
