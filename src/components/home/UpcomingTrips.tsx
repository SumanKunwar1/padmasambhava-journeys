import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import destSpiti from "@/assets/dest-spiti.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";
import destBhutan from "@/assets/dest-bhutan.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import destVietnam from "@/assets/dest-vietnam.jpg";
import destBali from "@/assets/dest-bali.jpg";

interface Trip {
  id: string;
  name: string;
  image: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  dates: string[];
  category: string;
  freeGoodies: boolean;
}

const trips: Trip[] = [
  {
    id: "spiti-holi",
    name: "Spiti Backpacking with Sangla Holi",
    image: destSpiti,
    duration: "6N/7D",
    price: 22999,
    originalPrice: 24999,
    discount: 2000,
    dates: ["Feb 28", "Mar 7", "Mar 14"],
    category: "Spiti Valley",
    freeGoodies: true,
  },
  {
    id: "ladakh-winter",
    name: "Winter Ladakh Adventure Trip",
    image: destLadakh,
    duration: "5N/6D",
    price: 18999,
    originalPrice: 20999,
    discount: 2000,
    dates: ["Jan 24", "Jan 31", "Feb 7"],
    category: "Leh",
    freeGoodies: true,
  },
  {
    id: "bhutan-spiritual",
    name: "Bhutan Spiritual Pilgrimage",
    image: destBhutan,
    duration: "6N/7D",
    price: 42999,
    originalPrice: 45999,
    discount: 3000,
    dates: ["Feb 15", "Mar 1", "Mar 15"],
    category: "Bhutan",
    freeGoodies: true,
  },
  {
    id: "georgia-winter",
    name: "Georgia Winter Group Trip",
    image: destGeorgia,
    duration: "7N/8D",
    price: 52999,
    originalPrice: 56999,
    discount: 4000,
    dates: ["Jan 20", "Feb 5", "Feb 20"],
    category: "Georgia",
    freeGoodies: true,
  },
  {
    id: "vietnam-explorer",
    name: "Vietnam Explorer Adventure",
    image: destVietnam,
    duration: "6N/7D",
    price: 38999,
    originalPrice: 41999,
    discount: 3000,
    dates: ["Feb 10", "Feb 25", "Mar 10"],
    category: "Vietnam",
    freeGoodies: false,
  },
  {
    id: "bali-retreat",
    name: "Bali Wellness Retreat",
    image: destBali,
    duration: "5N/6D",
    price: 49999,
    originalPrice: 53999,
    discount: 4000,
    dates: ["Mar 1", "Mar 15", "Apr 1"],
    category: "Bali",
    freeGoodies: true,
  },
];

const categories = [
  "All",
  "Spiti Valley",
  "Meghalaya",
  "Himachal Pradesh",
  "Dubai",
  "Almaty",
  "Bhutan",
  "Bali",
  "Vietnam",
  "Russia",
  "Georgia",
  "Sri Lanka",
  "Japan",
  "Northern Lights",
  "Leh",
  "Thailand",
];

export function UpcomingTrips() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTrips = trips.filter(
    (trip) => activeCategory === "All" || trip.category === activeCategory
  );

  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Upcoming Group Trips
          </h2>
          <Button variant="outline" className="self-start sm:self-center">
            See All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        {/* Category Pills */}
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 mb-8">
          <div className="flex gap-2 pb-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "filter-pill",
                  activeCategory === category && "filter-pill-active"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/trip/${trip.id}`}
                className="block bg-card rounded-2xl overflow-hidden card-hover group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {trip.freeGoodies && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium">
                      <Gift className="w-3 h-3" />
                      Free Goodies
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-charcoal/80 backdrop-blur-sm text-primary-foreground px-2.5 py-1 rounded-md text-xs font-medium">
                    🗓 {trip.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                    {trip.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-foreground">
                      ₹{trip.price.toLocaleString()}
                    </span>
                    <span className="price-original">
                      ₹{trip.originalPrice.toLocaleString()}
                    </span>
                    <span className="price-discount">
                      ₹{trip.discount.toLocaleString()} Off
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="line-clamp-1">{trip.dates.join(", ")}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
