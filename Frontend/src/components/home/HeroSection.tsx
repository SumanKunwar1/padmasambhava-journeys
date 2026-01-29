// src/components/home/HeroSection.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingFormModal } from "@/components/shared/BookingFormModal";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface HeroImage {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
}

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hero images from API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/hero-images/active`);
        if (response.data.status === "success" && response.data.data.heroImages.length > 0) {
          setHeroImages(response.data.data.heroImages);
        } else {
          // Fallback to default images if no active images found
          setHeroImages([
            {
              _id: "1",
              imageUrl: "/assets/hero-pilgrimage.jpg",
              title: "Sacred Pilgrimages",
              subtitle: "Journey to Divine Destinations",
              order: 1,
              isActive: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
        // Fallback to default images on error
        setHeroImages([
          {
            _id: "1",
            imageUrl: "/assets/hero-pilgrimage.jpg",
            title: "Sacred Pilgrimages",
            subtitle: "Journey to Divine Destinations",
            order: 1,
            isActive: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  if (isLoading) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Images with Ken Burns Animation */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: [1, 1.08],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 5, ease: "linear" }
            }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImageIndex].imageUrl}
              alt={heroImages[currentImageIndex].title || "Sacred pilgrimage destination"}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              {heroImages[currentImageIndex].title && (
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-2xl">
                  {heroImages[currentImageIndex].title}
                </h1>
              )}
              {heroImages[currentImageIndex].subtitle && (
                <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
                  {heroImages[currentImageIndex].subtitle}
                </p>
              )}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Your Journey
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
                  currentImageIndex === index
                    ? "bg-white w-10 shadow-lg"
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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