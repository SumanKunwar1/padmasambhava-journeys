// src/components/home/HeroSection.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BookingFormModal } from "@/components/shared/BookingFormModal";
import { API_BASE_URL } from "@/lib/api-config";
import axios from "axios";

interface HeroImage {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
}

const FALLBACK_IMAGES: HeroImage[] = [
  {
    _id: "1",
    imageUrl: "/assets/hero-pilgrimage.jpg",
    title: "Sacred Pilgrimages",
    subtitle: "Journey to Divine Destinations",
    order: 1,
    isActive: true,
  },
];

const SLIDE_DURATION = 5000;
const SWIPE_THRESHOLD = 50;

// Hero banners are landscape promo artwork with the headline baked into the
// image, so cropping them eats the message. The section takes its shape from
// the banner itself at every width — upload 16:9 and every screen shows it
// whole. The clamp only guards against a freak panorama collapsing into a
// sliver, or a portrait upload swallowing the page.
const DEFAULT_RATIO = 16 / 9;
const MIN_RATIO = 0.75;
const MAX_RATIO = 2;

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const prefersReducedMotion = useReducedMotion();

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Fetch hero images from API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/hero-images/active`);
        if (response.data.status === "success" && response.data.data.heroImages.length > 0) {
          setHeroImages(response.data.data.heroImages);
        } else {
          // Fallback to default images if no active images found
          setHeroImages(FALLBACK_IMAGES);
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
        // Fallback to default images on error
        setHeroImages(FALLBACK_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Measure every banner up front. This doubles as a preload, so swipes and
  // auto-advances never flash an empty frame, and the mobile height is known
  // before a slide is shown instead of snapping after it loads.
  useEffect(() => {
    if (heroImages.length === 0) return;
    let cancelled = false;

    heroImages.forEach((image) => {
      const loader = new Image();
      loader.onload = () => {
        if (cancelled || !loader.naturalWidth || !loader.naturalHeight) return;
        setRatios((prev) => ({
          ...prev,
          [image._id]: loader.naturalWidth / loader.naturalHeight,
        }));
      };
      loader.src = image.imageUrl;
    });

    return () => {
      cancelled = true;
    };
  }, [heroImages]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentImageIndex((prev) => {
        const total = heroImages.length;
        if (total === 0) return prev;
        return ((index % total) + total) % total;
      });
    },
    [heroImages.length]
  );

  // Auto-slide effect. Restarts whenever the slide changes, so a tap or swipe
  // gives the viewer a full interval before the next auto advance.
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [heroImages.length, currentImageIndex]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Ignore mostly-vertical gestures so page scrolling still feels natural.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;

    goToSlide(currentImageIndex + (deltaX < 0 ? 1 : -1));
  };

  if (isLoading) {
    return (
      <section className="relative w-full aspect-[16/9] max-h-[92svh] flex items-center justify-center bg-gray-100 px-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  const activeImage = heroImages[currentImageIndex];
  if (!activeImage) return null;

  const measuredRatio = ratios[activeImage._id] ?? DEFAULT_RATIO;
  const bannerRatio = Math.min(Math.max(measuredRatio, MIN_RATIO), MAX_RATIO);

  // The banner artwork usually carries its own headline. Only dim the image and
  // lay type over it when this slide actually has text to show.
  const hasOverlayText = Boolean(activeImage.title || activeImage.subtitle);

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-charcoal transition-[aspect-ratio] duration-500 max-h-[92svh]"
        style={{ aspectRatio: bannerRatio }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label="Featured destinations"
      >
        {/* Background banners. Crossfade only — any zoom would push the
            artwork past the edges and clip the headline baked into it. */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeImage.imageUrl}
              alt={activeImage.title || "Sacred pilgrimage destination"}
              className="w-full h-full object-cover object-center select-none"
              loading={currentImageIndex === 0 ? "eager" : "lazy"}
              fetchPriority={currentImageIndex === 0 ? "high" : "auto"}
              decoding="async"
              draggable={false}
            />
            {/* Gradient overlay, only where type sits on top of the artwork */}
            {hasOverlayText && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/25 sm:from-black/65 sm:via-black/30 sm:to-black/10 md:from-black/60 md:via-black/20 md:to-transparent" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hero Content — absolute so it never stretches the banner's ratio */}
        {hasOverlayText && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-full text-center text-white px-5 sm:px-8 pb-12 sm:pb-16 md:pb-20 max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                >
                  {activeImage.title && (
                    <h1 className="text-[clamp(1.5rem,7vw,4.5rem)] leading-[1.15] font-display font-bold mb-2 sm:mb-4 md:mb-6 drop-shadow-2xl [text-wrap:balance] break-words">
                      {activeImage.title}
                    </h1>
                  )}
                  {activeImage.subtitle && (
                    <p className="text-[clamp(0.875rem,3.5vw,1.5rem)] leading-relaxed drop-shadow-lg [text-wrap:balance] max-w-2xl mx-auto">
                      {activeImage.subtitle}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Slide indicators. Parked bottom-right in a frosted capsule: these
            banners run their headline across the bottom-centre, so a centred
            row of dots lands straight on top of the artwork's own type. The
            capsule also keeps the markers legible over light scenery. */}
        {heroImages.length > 1 && (
          <div
            className="absolute z-20 bottom-2.5 right-2.5 sm:bottom-4 sm:right-5 md:bottom-6 md:right-8 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/30 ring-1 ring-white/15 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            {heroImages.map((image, index) => (
              <button
                key={image._id || index}
                onClick={() => goToSlide(index)}
                /* py-4/-my-4 grows the tap area well past the slim bar
                   without making the capsule any taller. */
                className="group py-4 -my-4 px-1 -mx-1 touch-manipulation focus-visible:outline-none"
                aria-label={`Go to slide ${index + 1} of ${heroImages.length}`}
                aria-current={currentImageIndex === index}
              >
                <span
                  className={cn(
                    "block h-1 sm:h-1.5 rounded-full transition-all duration-500 ease-out",
                    "group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black/40",
                    currentImageIndex === index
                      ? "w-6 sm:w-8 bg-white"
                      : "w-1.5 sm:w-2 bg-white/50 group-hover:bg-white/90"
                  )}
                />
              </button>
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
