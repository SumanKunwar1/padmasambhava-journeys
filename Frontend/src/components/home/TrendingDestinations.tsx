// src/components/TrendingDestinations.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api-config";
import axios from "axios";

interface TrendingDestination {
  _id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  order: number;
  isActive: boolean;
}

export function TrendingDestinations() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/trending-destinations/active`);
      
      if (response.data.status === 'success' && response.data.data?.trendingDestinations) {
        setDestinations(response.data.data.trendingDestinations);
      } else {
        setDestinations([]);
      }
    } catch (error: any) {
      console.error('Error loading trending destinations:', error);
      
      setError(error.message);
      
      // Only show toast in development for debugging
      if (import.meta.env.DEV) {
        toast({
          title: "Failed to load destinations",
          description: `Backend might not be running. ${error.message}`,
          variant: "destructive",
        });
      }
      
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="bg-muted py-8 border-b border-border">
        <div className="container-custom">
          <h2 className="text-xl font-display font-bold mb-4">Trending Destinations</h2>
          <div className="flex gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-48 aspect-[3/4] bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error && destinations.length === 0) {
    return (
      <section className="bg-muted py-8 border-b border-border">
        <div className="container-custom">
          <h2 className="text-xl font-display font-bold mb-4">Trending Destinations</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Destinations will be available soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show the section if there are no destinations
  if (destinations.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted py-8 border-b border-border">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-display font-bold mb-4"
        >
          Trending Destinations
        </motion.h2>

        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 scrollbar-smooth">
          <div className="flex gap-6" style={{ minWidth: "max-content" }}>
            {destinations.map((destination, index) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0"
              >
                <Link
                  to={destination.url}
                  className="block relative w-48 aspect-[3/4] rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="gradient-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-primary-foreground">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-primary-foreground/80 font-semibold">
                      ₹{destination.price.toLocaleString('en-IN')}
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