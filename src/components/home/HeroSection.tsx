import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingFormModal } from "@/components/shared/BookingFormModal";
import heroImage1 from "@/assets/hero-pilgrimage.jpg";
import destBhutan from "@/assets/dest-bhutan.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";

const heroImages = [
  heroImage1,
  destBhutan,
  destLadakh,
  destSpiti,
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Images with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImageIndex]}
              alt="Sacred pilgrimage destination"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/80 backdrop-blur-sm text-primary-foreground rounded-full text-sm font-medium mb-6">
                ✨ Your Journey to Spiritual Awakening
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6 drop-shadow-lg"
            >
              Transform Your Soul
              <br />
              <span className="text-accent">Through Sacred Journeys</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mb-8 drop-shadow"
            >
              Experience life-changing pilgrimage trips to the world's most sacred destinations. 
              Expert guides, seamless planning, and transformative experiences await.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/trips/pilgrimage">
                <Button size="lg" className="text-base px-8 h-14">
                  Explore Pilgrimage Trips
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 h-14 bg-primary-foreground/90 border-primary-foreground/30 text-foreground hover:bg-primary-foreground hover:text-foreground backdrop-blur-sm"
                onClick={() => setIsBookingOpen(true)}
              >
                Book Now
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-primary-foreground/20"
            >
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground drop-shadow">10K+</p>
                <p className="text-primary-foreground/80 text-sm">Happy Travellers</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground drop-shadow">50+</p>
                <p className="text-primary-foreground/80 text-sm">Sacred Destinations</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground drop-shadow">8+</p>
                <p className="text-primary-foreground/80 text-sm">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground drop-shadow">4.9★</p>
                <p className="text-primary-foreground/80 text-sm">Google Rating</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentImageIndex === index
                  ? "bg-primary-foreground w-8"
                  : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
              )}
            />
          ))}
        </div>
      </section>

      <BookingFormModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
