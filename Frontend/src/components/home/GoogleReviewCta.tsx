// src/components/home/GoogleReviewCta.tsx
import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOOGLE_REVIEWS_URL } from "@/lib/home-sections";

export function GoogleReviewCta() {
  return (
    <section className="pb-16 md:pb-20 bg-background" aria-labelledby="google-review-heading" data-testid="google-review">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-3xl border border-border bg-card p-7 sm:p-10 text-center"
        >
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-accent text-accent" />
            ))}
          </div>
          <h2 id="google-review-heading" className="text-2xl sm:text-3xl font-display font-bold mb-3">
            Google Reviews
          </h2>
          <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto">
            Read what fellow travellers say about us on Google, and share your own experience after your journey.
          </p>
          <Button asChild size="lg">
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              Read & Write a Google Review
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
