import { motion } from "framer-motion";
import { Users, Sparkles, Heart, Camera, Map, Star } from "lucide-react";

const reasons = [
  {
    icon: Users,
    title: "Travel Community",
    description: "Join a family of like-minded travelers who share your passion for exploration",
  },
  {
    icon: Sparkles,
    title: "Curated Experiences",
    description: "Every trip is thoughtfully designed for meaningful memories",
  },
  {
    icon: Heart,
    title: "Soul-Stirring Journeys",
    description: "More than sightseeing—we create transformative experiences",
  },
  {
    icon: Camera,
    title: "Insta-Worthy Moments",
    description: "Picture-perfect destinations with expert photography tips",
  },
  {
    icon: Map,
    title: "Hidden Gems",
    description: "Discover offbeat locations tourists don't usually find",
  },
  {
    icon: Star,
    title: "Premium Experience",
    description: "Quality accommodations and hassle-free arrangements",
  },
];

export function VibeWithUs() {
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
            Vibe with Us
          </h2>
          <p className="text-xl text-muted-foreground">
            Reasons To Make Us Your Travel Bestie
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <reason.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {reason.title}
              </h3>
              <p className="text-muted-foreground">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
