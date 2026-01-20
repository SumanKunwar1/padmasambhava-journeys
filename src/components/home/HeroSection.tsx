import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-pilgrimage.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sacred pilgrimage destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm text-primary-foreground rounded-full text-sm font-medium mb-6">
              ✨ Your Journey to Spiritual Awakening
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6"
          >
            Transform Your Soul
            <br />
            <span className="text-accent">Through Sacred Journeys</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mb-8"
          >
            Experience life-changing pilgrimage trips to the world's most sacred destinations. 
            Expert guides, seamless planning, and transformative experiences await.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="text-base px-8 h-14">
              Explore Pilgrimage Trips
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 h-14 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground backdrop-blur-sm"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Our Story
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-primary-foreground/20"
          >
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">10K+</p>
              <p className="text-primary-foreground/70 text-sm">Happy Travellers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">50+</p>
              <p className="text-primary-foreground/70 text-sm">Sacred Destinations</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">8+</p>
              <p className="text-primary-foreground/70 text-sm">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">4.9★</p>
              <p className="text-primary-foreground/70 text-sm">Google Rating</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
