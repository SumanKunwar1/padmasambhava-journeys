// src/components/home/ExploreDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-config";
import axios from "axios";

type FilterType = "all" | "international" | "domestic" | "weekend";

interface Destination {
  _id: string;
  name: string;
  image: string;
  type: "international" | "domestic" | "weekend";
  url: string;
  order: number;
  isActive: boolean;
}

const filters: { label: string; value: FilterType; icon: string }[] = [
  { label: "All", value: "all", icon: "🌍" },
  { label: "International", value: "international", icon: "✈️" },
  { label: "Domestic", value: "domestic", icon: "🇮🇳" },
  { label: "Weekend", value: "weekend", icon: "🚗" },
];

export function ExploreDestinations() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/explore-destinations/active`);
        if (response.data.status === "success") {
          setDestinations(response.data.data.exploreDestinations);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        // Fallback to empty array on error
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(
    (dest) => activeFilter === "all" || dest.type === activeFilter
  );

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading destinations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no destinations
  if (destinations.length === 0) {
    return null;
  }

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
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {activeFilter === "all" ? "" : activeFilter} destinations available
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-6 pb-4 min-w-max lg:grid lg:grid-cols-8 lg:min-w-0">
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={destination.url}
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
        )}
      </div>
    </section>
  );
}