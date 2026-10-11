// src/components/home/CorePartners.tsx
import { motion } from "framer-motion";
import { Flower2, Tv, ExternalLink, type LucideIcon } from "lucide-react";

const partners: { icon: LucideIcon; role: string; name: string; href?: string }[] = [
  {
    icon: Flower2,
    role: "Spiritual Partner",
    name: "Buddhist Teaching & Meditation Centre",
    href: "https://btmcfoundation.org",
  },
  {
    icon: Tv,
    role: "Media Partner",
    name: "Dharma Television Channel",
  },
];

export function CorePartners() {
  return (
    <section className="py-12 md:py-16 bg-background" aria-labelledby="partners-heading" data-testid="core-partners">
      <div className="container-custom">
        <motion.h2
          id="partners-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-display font-bold text-center mb-8 md:mb-10"
        >
          Our Core Partners
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {partners.map((partner, index) => {
            const content = (
              <>
                <span className="inline-flex items-center justify-center w-14 h-14 shrink-0 rounded-full bg-secondary text-primary">
                  <partner.icon className="w-7 h-7" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-1">
                    {partner.role}
                  </span>
                  <span className="block font-display text-lg font-semibold leading-snug">{partner.name}</span>
                </span>
                {partner.href && <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground ml-auto" />}
              </>
            );
            const classes = "flex items-center gap-4 h-full bg-card rounded-2xl border border-border p-5 sm:p-6";

            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {partner.href ? (
                  <a href={partner.href} target="_blank" rel="noopener noreferrer" className={`${classes} card-hover`}>
                    {content}
                  </a>
                ) : (
                  <div className={classes}>{content}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
