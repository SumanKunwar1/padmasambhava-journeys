import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
              src={heroImages[currentImageIndex]}
              alt="Sacred pilgrimage destination"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Indicators */}
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
