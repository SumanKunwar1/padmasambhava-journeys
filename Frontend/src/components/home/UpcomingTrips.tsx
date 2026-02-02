// src/components/sections/UpcomingTrips.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api-config";


interface Trip {
  _id: string;
  name: string;
  image: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  dates: Array<{ date: string; price: number }>;
  destination: string;
  hasGoodies: boolean;
}

const categories = [
  "All",
  "Sikkim",
  "Darjeeling",
  "Tsopema Himalchal",
  "Canada",
  "USA",
  "Australia",
  "Russia",
  "UK",
  "Europe",
  "Phillipine",
  "Dubai",
  "Azerbaijan",
  "Armenia",
  "Baku",
  "Brazil",
  "South Africa",
  "Georgia",  
  "Turkey", 
  "Egypt", 
  "Saudi Arabia", 
  "Qatar", 
  "Tanzania",  
  "Mandeep", 
  "Nepal", 
  "Korea", 
  "Taiwan", 
  "Malaysia",
  "Tibet", 
  "China", 
  "Hongkong", 
  "Loas", 
  "Cambodia", 
  "Phillipines"
];

export function UpcomingTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchUpcomingTrips();
  }, []);

  const fetchUpcomingTrips = async () => {
    try {
      setLoading(true);
      // Fetch only 4 active trips, sorted by creation date (newest first)
      const response = await axios.get(`${API_BASE_URL}/trips?limit=4&sort=-createdAt`);
      
      if (response.data.status === 'success') {
        setTrips(response.data.data.trips);
      }
    } catch (error) {
      console.error("Error fetching upcoming trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    if (activeCategory === "All") return true;
    
    // Check if destination or name contains the category
    return (
      trip.destination.toLowerCase().includes(activeCategory.toLowerCase()) ||
      trip.name.toLowerCase().includes(activeCategory.toLowerCase())
    );
  });

  // Limit to maximum 4 trips
  const displayTrips = filteredTrips.slice(0, 4);

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
          <Link to="/group-trips">
            <Button variant="outline" className="self-start sm:self-center">
              See All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : displayTrips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No upcoming trips available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayTrips.map((trip, index) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/trip/${trip._id}`}
                  className="block bg-card rounded-2xl overflow-hidden card-hover group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {trip.hasGoodies && (
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
                    {trip.dates && trip.dates.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="line-clamp-1">
                          {trip.dates.slice(0, 3).map(d => d.date).join(", ")}
                          {trip.dates.length > 3 && " +more"}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}