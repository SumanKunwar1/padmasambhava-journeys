// src/components/home/PartnerWithUs.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Handshake, Package, BadgePercent, TrendingUp, Home, Clock, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AGENT_SIGNUP_ROUTE = "/agent-signup";
const AGENT_LOGIN_ROUTE = "/agent/login";

const benefits = [
  { icon: Package, label: "Sell Our Tour Packages" },
  { icon: BadgePercent, label: "Earn Attractive Commissions" },
  { icon: TrendingUp, label: "Grow Your Business" },
  { icon: Home, label: "Work from Home" },
  { icon: Clock, label: "Flexible Opportunity" },
  { icon: Building2, label: "No Office Required" },
];

export function PartnerWithUs() {
  return (
    <section className="section-padding bg-muted" aria-labelledby="partner-heading" data-testid="partner-with-us">
      <div className="container-custom grid lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Partner With Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-dark via-primary to-emerald-dark text-primary-foreground p-7 sm:p-10 flex flex-col"
        >
          <Handshake className="absolute -right-6 -bottom-8 w-48 h-48 text-white/10" aria-hidden="true" />
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Partner With Us
          </p>
          <h2 id="partner-heading" className="text-3xl sm:text-4xl font-display font-bold mb-4 [text-wrap:balance]">
            Become Our B2B Travel Partner
          </h2>
          <p className="text-base sm:text-lg text-primary-foreground/90 mb-8 max-w-md">
            Travel agencies & tour operators are warmly invited to join our partner network.
          </p>
          <div className="relative mt-auto flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={AGENT_SIGNUP_ROUTE}>
                Become a Partner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/60 bg-white/10 text-white hover:bg-white hover:text-primary"
            >
              <Link to={AGENT_LOGIN_ROUTE}>Partner Login</Link>
            </Button>
          </div>
        </motion.div>

        {/* Turn Every Booking Into an Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-card border border-border p-7 sm:p-10 flex flex-col"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 [text-wrap:balance]">
            Turn Every Booking Into an Opportunity
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-4 mb-8">
            {benefits.map((benefit) => (
              <li key={benefit.label} className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-secondary text-primary">
                  <benefit.icon className="w-5 h-5" />
                </span>
                <span className="text-sm sm:text-base font-medium leading-snug">{benefit.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <Button asChild size="lg">
              <Link to={AGENT_SIGNUP_ROUTE}>
                Start Earning Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
