// src/components/home/DalaiLamaDarshan.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DalaiLamaDarshan() {
  const pricePerPerson = 100000;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              {/* Main Image */}
              <img
                src="https://i1.himalayas.life/c/u/f67894297b6134a6b759b3a9ec15b6cb/2019/01/30042912/dalai-lama.jpg"
                alt="His Holiness the Dalai Lama"
                className="w-full h-80 md:h-96 object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-sm font-semibold text-primary">
                  🙏 9 Days Spiritual Journey
                </p>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary rounded-full opacity-60 -z-10" />
          </motion.div>

          {/* Right: Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Tag */}
            <div className="inline-block">
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                EXCLUSIVE PILGRIMAGE
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Blessed Audience with His Holiness the 14th Dalai Lama
            </h2>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">
              Experience a transformative 9-day spiritual journey to receive
              blessings from His Holiness the Dalai Lama at Mundgod, visiting
              sacred monasteries across South and North India.
            </p>

            {/* Key Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  <strong>Dates:</strong> January 7-16, 2025 (& Multiple Dates)
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  <strong>Route:</strong> Kathmandu → Bangalore → Delhi
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>
                  <strong>Group:</strong> Limited spots | Expert guides included
                </span>
              </div>
            </div>

            {/* Price Highlight */}
            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 my-4">
              <p className="text-xs text-muted-foreground mb-1">
                Starting From
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  ₹{pricePerPerson.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">per person</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Includes flights, accommodation, meals & H.H. audience
              </p>
            </div>

            {/* Highlights - Mini cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Includes</p>
                <p className="font-semibold text-sm text-foreground">
                  H.H. Audience
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Meals</p>
                <p className="font-semibold text-sm text-foreground">
                  Pure Vegetarian
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold text-sm text-foreground">9 Days</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Support</p>
                <p className="font-semibold text-sm text-foreground">
                  24/7 Available
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/dalai-lama-darshan" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6">
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hi!%20I%27m%20interested%20in%20the%20Dalai%20Lama%20Darshan%20pilgrimage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full font-bold border-2">
                  💬 Chat on WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}