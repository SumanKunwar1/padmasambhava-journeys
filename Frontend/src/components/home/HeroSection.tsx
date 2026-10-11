// src/components/home/HeroSection.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BookingFormModal } from "@/components/shared/BookingFormModal";
import { HeroCtaButton } from "@/components/home/HeroCtaButton";
import { API_BASE_URL } from "@/lib/api-config";
import type { HeroImage } from "@/lib/hero-banner";
import axios from "axios";

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

// Phones get their own portrait banner. It is always framed 4:5, which also
// leaves room for a tagline and buttons that a landscape strip cannot hold.
const MOBILE_RATIO = 4 / 5;
const MOBILE_QUERY = "(max-width: 767px)";

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();

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

  // The banner this screen should show: the portrait upload on phones when
  // there is one, otherwise the desktop banner.
  const usesMobileImage = useCallback(
    (image: HeroImage) => isMobile && Boolean(image.mobileImageUrl),
    [isMobile]
  );
  const getImageSrc = useCallback(
    (image: HeroImage) => (usesMobileImage(image) ? image.mobileImageUrl! : image.imageUrl),
    [usesMobileImage]
  );

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
      loader.src = getImageSrc(image);
    });

    return () => {
      cancelled = true;
    };
  }, [heroImages, getImageSrc]);

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
  // gives the viewer a full interval before the next auto advance. It holds
  // still while someone is reading the text or reaching for a button.
  useEffect(() => {
    if (heroImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [heroImages.length, currentImageIndex, isPaused]);

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
      <section className="relative w-full aspect-[4/5] md:aspect-[16/9] max-h-[92svh] flex items-center justify-center bg-gray-100 px-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  const activeImage = heroImages[currentImageIndex];
  if (!activeImage) return null;

  const ctas = (activeImage.ctas ?? []).filter((cta) => cta.label && cta.url);

  // The banner artwork usually carries its own headline. Only dim the image and
  // lay content over it when this slide actually has something to show.
  const hasOverlayContent = Boolean(activeImage.title || activeImage.subtitle || ctas.length > 0);

  // A landscape strip on a phone is too short to hold buttons, so a slide with
  // buttons is framed 4:5 there even without a dedicated mobile banner.
  const usesMobileFrame = isMobile && (Boolean(activeImage.mobileImageUrl) || ctas.length > 0);
  const measuredRatio = ratios[activeImage._id] ?? DEFAULT_RATIO;
  const bannerRatio = usesMobileFrame
    ? MOBILE_RATIO
    : Math.min(Math.max(measuredRatio, MIN_RATIO), MAX_RATIO);

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-charcoal transition-[aspect-ratio] duration-500 max-h-[92svh]"
        style={{ aspectRatio: bannerRatio }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label="Featured destinations"
        data-testid="hero-banner"
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
              src={getImageSrc(activeImage)}
              alt={activeImage.title || "Sacred pilgrimage destination"}
              className="w-full h-full object-cover object-center select-none"
              loading={currentImageIndex === 0 ? "eager" : "lazy"}
              fetchPriority={currentImageIndex === 0 ? "high" : "auto"}
              decoding="async"
              draggable={false}
              data-testid="hero-banner-image"
            />
            {/* Scrim, only where content sits on top of the artwork: from the
                bottom on phones, from the left on wider screens. */}
            {hasOverlayContent && (
              <>
                <div
                  className="absolute inset-0 md:hidden bg-gradient-to-t from-black/85 via-black/45 to-black/5"
                  data-testid="hero-banner-scrim"
                />
                <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hero Content — absolute so it never stretches the banner's ratio */}
        {hasOverlayContent && (
          <div className="absolute inset-0 z-10 flex items-end md:items-center">
            <div className="container-custom w-full pb-14 sm:pb-16 md:pb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                  className="max-w-xl lg:max-w-2xl text-left text-white"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  data-testid="hero-banner-content"
                >
                  {activeImage.title && (
                    <>
                      <span className="block h-1 w-12 sm:w-16 rounded-full bg-accent mb-3 sm:mb-5" aria-hidden="true" />
                      <h1 className="text-[clamp(1.75rem,5.2vw,4.25rem)] leading-[1.08] font-display font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] [text-wrap:balance] break-words">
                        {activeImage.title}
                      </h1>
                    </>
                  )}
                  {activeImage.subtitle && (
                    <p className="mt-3 sm:mt-5 text-[clamp(0.9rem,1.7vw,1.3rem)] leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] [text-wrap:pretty] max-w-lg">
                      {activeImage.subtitle}
                    </p>
                  )}
                  {ctas.length > 0 && (
                    <div className="mt-5 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-4" data-testid="hero-banner-ctas">
                      {ctas.map((cta, index) => (
                        <HeroCtaButton key={cta._id || index} cta={cta} />
                      ))}
                    </div>
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
