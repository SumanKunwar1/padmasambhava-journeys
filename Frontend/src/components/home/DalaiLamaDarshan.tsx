// src/components/home/DalaiLamaDarshan.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DalaiLamaDarshan() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle mandala background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, hsl(var(--primary)) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="container-custom relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px w-10 bg-primary/40" />
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Exclusive Pilgrimage
          </span>
          <div className="h-px w-10 bg-primary/40" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-0 items-stretch">
          {/* Left: Image - takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 relative"
          >
            {/* Main large image */}
            <div className="relative h-[420px] md:h-[540px] rounded-2xl overflow-hidden group">
              <img
                src="https://res.cloudinary.com/dcsgax3ld/image/upload/v1771570455/WhatsApp_Image_2026-02-20_at_11.49.23_vtyqxm.jpg"
                alt="His Holiness the Dalai Lama"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Layered gradients for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Bottom overlay info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-semibold tracking-wider uppercase mb-1">
                      Sacred Journey
                    </p>
                    <p className="text-white text-xl md:text-2xl font-bold leading-tight">
                      His Holiness<br />the 14th Dalai Lama
                    </p>
                  </div>
                  {/* Duration badge */}
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                    <p className="text-white font-black text-2xl leading-none">7</p>
                    <p className="text-white/80 text-xs font-semibold tracking-wide">DAYS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating info chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-5 left-6 flex gap-2"
            >
              <div className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Limited Spots
              </div>
              <div className="bg-white border border-border rounded-full px-4 py-2 text-xs font-bold shadow-lg text-foreground">
                🙏 Audience Included
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content - takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-2 lg:pl-10 pt-10 lg:pt-0 flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-4xl xl:text-[2.6rem] font-display font-bold text-foreground leading-tight mb-5">
              Blessed Audience with
              <span className="block text-primary mt-1">His Holiness</span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-7">
              A once-in-a-lifetime 7-day spiritual pilgrimage through Dharamshala,
              the holy lake of Tsopema, and the Golden Temple of Amritsar —
              culminating in a personal blessing from His Holiness the 14th Dalai Lama.
            </p>

            {/* Journey stats */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { icon: "🕌", label: "Sacred Sites", value: "5+ Sites" },
                { icon: "🗺️", label: "Route", value: "3 States" },
                { icon: "🌿", label: "Meals", value: "Pure Veg" },
              ].map((stat, i) => (
                <div key={i} className="bg-secondary/80 rounded-xl p-3 text-center">
                  <p className="text-lg mb-0.5">{stat.icon}</p>
                  <p className="font-bold text-sm text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Key details */}
            <div className="space-y-2.5 mb-8">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Multiple departures — March through July 2026</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Kathmandu → Delhi → Dharamshala → Tsopema → Amritsar</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Expert spiritual guides · 24/7 support included</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Flights, accommodation & all meals included</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/dalai-lama-darshan" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-5 group">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a
                href="https://wa.me/9704502011?text=Hi!%20I%27m%20interested%20in%20the%20Dalai%20Lama%20Darshan%20pilgrimage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full font-bold border-2 text-sm py-5">
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