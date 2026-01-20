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
  },
  {
    id: 2,
    name: "Rahul Verma",
    trip: "Ladakh Adventure",
    rating: 5,
    review: "From the monasteries to the mountain passes, every moment was perfectly planned. The trip captain was amazing and made sure everyone was comfortable throughout the journey.",
    avatar: "RV",
  },
  {
    id: 3,
    name: "Anjali Patel",
    trip: "Spiti Valley Backpacking",
    rating: 5,
    review: "Best decision ever! Met incredible people, visited stunning places, and created memories for a lifetime. Padmasambhava Trip truly understands what travelers need.",
    avatar: "AP",
  },
  {
    id: 4,
    name: "Vikram Singh",
    trip: "Georgia Winter Trip",
    rating: 5,
    review: "International trip with Indian comfort! The itinerary was perfect, accommodations were great, and the group vibes were amazing. Can't wait for my next adventure with them.",
    avatar: "VS",
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
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {testimonial.avatar}
                </div>
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
