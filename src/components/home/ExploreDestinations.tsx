import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import destination images
import destBali from "@/assets/dest-bali.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";
import destJapan from "@/assets/dest-japan.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destBhutan from "@/assets/dest-bhutan.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import destVietnam from "@/assets/dest-vietnam.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destThailand from "@/assets/dest-thailand.jpg";

type FilterType = "all" | "international" | "domestic" | "weekend";

interface Destination {
  name: string;
  image: string;
  type: "international" | "domestic" | "weekend";
  slug: string;
}

const destinations: Destination[] = [
  { name: "Bali", image: destBali, type: "international", slug: "bali-tour" },
  { name: "Japan", image: destJapan, type: "international", slug: "japan-tour" },
  { name: "Vietnam", image: destVietnam, type: "international", slug: "vietnam-tour" },
  { name: "Thailand", image: destThailand, type: "international", slug: "thailand-tour" },
  { name: "Dubai", image: destDubai, type: "international", slug: "dubai-tour" },
  { name: "Georgia", image: destGeorgia, type: "international", slug: "georgia-tour" },
  { name: "Bhutan", image: destBhutan, type: "international", slug: "bhutan-tour" },
  { name: "Ladakh", image: destLadakh, type: "domestic", slug: "ladakh-tour" },
  { name: "Spiti Valley", image: destSpiti, type: "domestic", slug: "spiti-tour" },
  { name: "Meghalaya", image: destBali, type: "domestic", slug: "meghalaya-tour" },
  { name: "Himachal", image: destSpiti, type: "weekend", slug: "himachal-tour" },
  { name: "Manali", image: destLadakh, type: "weekend", slug: "manali-tour" },
  { name: "Kerala", image: destBali, type: "domestic", slug: "kerala-tour" },
  { name: "Rajasthan", image: destDubai, type: "domestic", slug: "rajasthan-tour" },
  { name: "Uttarakhand", image: destSpiti, type: "domestic", slug: "uttarakhand-tour" },
  { name: "Tawang", image: destBhutan, type: "domestic", slug: "tawang-tour" },
];

const filters: { label: string; value: FilterType; icon: string }[] = [
  { label: "All", value: "all", icon: "🌍" },
  { label: "International", value: "international", icon: "✈️" },
  { label: "Domestic", value: "domestic", icon: "🇮🇳" },
  { label: "Weekend", value: "weekend", icon: "🚗" },
];

export function ExploreDestinations() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredDestinations = destinations.filter(
    (dest) => activeFilter === "all" || dest.type === activeFilter
  );

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
            Explore Destinations
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "filter-pill",
                  activeFilter === filter.value && "filter-pill-active"
                )}
              >
                <span className="mr-1.5">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Destinations Grid - Clickable */}
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex gap-6 pb-4 min-w-max lg:grid lg:grid-cols-8 lg:min-w-0">
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/trip/${destination.slug}`}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div className="destination-circle w-24 h-24 lg:w-full lg:h-auto lg:aspect-square shadow-md">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {destination.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
