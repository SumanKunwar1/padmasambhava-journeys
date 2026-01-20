import { motion } from "framer-motion";
import { 
  Shield, 
  Percent, 
  CreditCard, 
  Heart, 
  XCircle, 
  RefreshCw, 
  Headphones 
} from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "Solo is Safe",
    description: "Travel safely with verified groups",
  },
  {
    icon: Percent,
    title: "Secure Your Spot by Paying 20%",
    description: "Reserve now, pay later",
  },
  {
    icon: CreditCard,
    title: "Zero-Cost EMI Available",
    description: "Easy monthly payments",
  },
  {
    icon: Heart,
    title: "Free Travel Insurance",
    description: "Complimentary coverage included",
  },
  {
    icon: XCircle,
    title: "Free Cancellation on Group Trips",
    description: "Cancel worry-free",
  },
  {
    icon: RefreshCw,
    title: "Reschedule at No Extra Cost",
    description: "Flexibility guaranteed",
  },
  {
    icon: Headphones,
    title: "24×7 Support & Trained Trip Captains",
    description: "Expert assistance always",
  },
];

export function BookWithConfidence() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Book with Confidence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We prioritize your peace of mind with flexible policies and comprehensive support
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="trust-badge"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-right text-sm text-muted-foreground mt-6"
        >
          *T&C Applied
        </motion.p>
      </div>
    </section>
  );
}
