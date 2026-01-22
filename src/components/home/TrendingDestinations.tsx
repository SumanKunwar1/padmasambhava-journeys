import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import destBali from "@/assets/dest-bali.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destBhutan from "@/assets/dest-bhutan.jpg";
import destVietnam from "@/assets/dest-vietnam.jpg";

const trendingDestinations = [
  {
    name: "Bali Tour Packages",
    price: 49999,
    image: destBali,
    slug: "bali",
  },
  {
    name: "Georgia Tour Packages",
    price: 52999,
    image: destGeorgia,
    slug: "georgia",
  },
  {
    name: "Leh Ladakh Tour Packages",
    price: 22999,
    image: destLadakh,
    slug: "ladakh",
  },
  {
    name: "Spiti Valley Tour Packages",
    price: 15999,
    image: destSpiti,
    slug: "spiti",
  },
  {
    name: "Bhutan Tour Packages",
    price: 42999,
    image: destBhutan,
    slug: "bhutan",
  },
  {
    name: "Vietnam Tour Packages",
    price: 38999,
    image: destVietnam,
    slug: "vietnam",
  },
];

export function TrendingDestinations() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-display font-bold mb-8"
        >
          Trending Destinations
        </motion.h2>

        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex gap-6 pb-4" style={{ minWidth: "max-content" }}>
            {trendingDestinations.map((destination, index) => (
              <motion.div
                key={destination.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/destination/${destination.slug}`}
                  className="block relative w-64 lg:w-full aspect-[3/4] rounded-2xl overflow-hidden group"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="gradient-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
                    <h3 className="font-semibold text-lg mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-primary-foreground/80">
                      Starting ₹{destination.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
