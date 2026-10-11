// src/components/home/ServicesSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, FileCheck2, ShieldCheck, Hotel, ArrowRight, type LucideIcon } from "lucide-react";

const services: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: Plane,
    title: "Flight, Train, Bus & Cab Booking",
    description: "Tickets and transfers arranged door to door.",
    href: "/contact",
  },
  {
    icon: FileCheck2,
    title: "Visa Application Assistance",
    description: "Paperwork checked and filed by our team.",
    href: "/visa-application",
  },
  {
    icon: ShieldCheck,
    title: "Travel Insurance",
    description: "Cover for your journey, sorted in minutes.",
    href: "/insurance",
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    description: "Trusted stays close to where you need to be.",
    href: "/contact",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-cream" aria-labelledby="services-heading" data-testid="services-section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Services We Offer
          </p>
          <h2 id="services-heading" className="text-3xl sm:text-4xl font-display font-bold">
            Book Everything in One Place
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={service.href}
                className="group flex h-full flex-col items-center text-center bg-card rounded-2xl border border-border p-4 sm:p-7 card-hover"
              >
                <span className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary text-primary mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </span>
                <h3 className="text-sm sm:text-lg font-semibold leading-snug mb-2">{service.title}</h3>
                <p className="hidden sm:block text-sm text-muted-foreground mb-4">{service.description}</p>
                <span className="mt-auto inline-flex items-center text-xs sm:text-sm font-medium text-primary">
                  Enquire
                  <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
