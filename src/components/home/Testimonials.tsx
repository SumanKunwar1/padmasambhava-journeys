import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    trip: "Bhutan Pilgrimage Trip",
    rating: 5,
    review: "The most spiritual journey I've ever experienced. The team's attention to detail and deep knowledge of Buddhist sites made this trip unforgettable. Highly recommend for anyone seeking inner peace.",
    avatar: "PS",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Rahul Verma",
    trip: "Ladakh Adventure",
    rating: 5,
    review: "From the monasteries to the mountain passes, every moment was perfectly planned. The trip captain was amazing and made sure everyone was comfortable throughout the journey.",
    avatar: "RV",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Anjali Patel",
    trip: "Spiti Valley Backpacking",
    rating: 5,
    review: "Best decision ever! Met incredible people, visited stunning places, and created memories for a lifetime. Padmasambhava Trip truly understands what travelers need.",
    avatar: "AP",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Vikram Singh",
    trip: "Georgia Winter Trip",
    rating: 5,
    review: "International trip with Indian comfort! The itinerary was perfect, accommodations were great, and the group vibes were amazing. Can't wait for my next adventure with them.",
    avatar: "VS",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Reviews From Our Travellers
          </h2>
          <p className="text-muted-foreground">
            Real experiences from our amazing community
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">
                "{testimonial.review}"
              </p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.trip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
