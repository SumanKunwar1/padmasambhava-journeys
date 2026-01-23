import { useRef, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    trip: "Bhutan Pilgrimage Trip",
    rating: 5,
    review: "The most spiritual journey I've ever experienced. The team's attention to detail and deep knowledge of Buddhist sites made this trip unforgettable. Highly recommend for anyone seeking inner peace.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Rahul Verma",
    trip: "Ladakh Adventure",
    rating: 5,
    review: "From the monasteries to the mountain passes, every moment was perfectly planned. The trip captain was amazing and made sure everyone was comfortable throughout the journey.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Anjali Patel",
    trip: "Spiti Valley Backpacking",
    rating: 5,
    review: "Best decision ever! Met incredible people, visited stunning places, and created memories for a lifetime. Padmasambhava Trip truly understands what travelers need.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Vikram Singh",
    trip: "Georgia Winter Trip",
    rating: 5,
    review: "International trip with Indian comfort! The itinerary was perfect, accommodations were great, and the group vibes were amazing. Can't wait for my next adventure with them.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Meera Reddy",
    trip: "Kerala Wellness Retreat",
    rating: 5,
    review: "A transformative experience! The ayurvedic treatments, yoga sessions, and peaceful surroundings helped me reset completely. Will definitely book again.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Arjun Kapoor",
    trip: "Vietnam Discovery",
    rating: 5,
    review: "Amazing trip from start to finish. The local guides were knowledgeable, food was incredible, and the group was fantastic. Exceeded all my expectations!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset scroll when reaching the middle (since we duplicated content)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Duplicate testimonials for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-custom mb-8">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-3">
          Reviews From Our Travellers
        </h2>
        <p className="text-muted-foreground text-center">
          Real experiences from our amazing community
        </p>
      </div>

      {/* Horizontal Scrolling Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden py-4 px-4"
        style={{ cursor: "grab" }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-80 bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
              />
            </div>

            {/* Name */}
            <h3 className="text-center font-semibold text-foreground mb-1">
              {testimonial.name}
            </h3>

            {/* Trip Name */}
            <p className="text-center text-sm text-primary mb-3">
              {testimonial.trip}
            </p>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>

            {/* Review */}
            <p className="text-muted-foreground text-sm leading-relaxed text-center line-clamp-4">
              "{testimonial.review}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
