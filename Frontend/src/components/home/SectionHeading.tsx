// src/components/home/SectionHeading.tsx
import { motion } from "framer-motion";

interface SectionHeadingProps {
  /** Applied to the <h2>, for aria-labelledby on the section. */
  id?: string;
  title: string;
  description?: string;
  /** Optional second line, e.g. the programs or places covered. */
  highlights?: string;
}

/** The one heading style shared by the homepage's listing sections. */
export function SectionHeading({ id, title, description, highlights }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto text-center mb-8 md:mb-10"
    >
      <span className="block h-1 w-12 rounded-full bg-accent mx-auto mb-4" aria-hidden="true" />
      <h2 id={id} className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold [text-wrap:balance]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base sm:text-lg text-muted-foreground [text-wrap:balance]">{description}</p>
      )}
      {highlights && (
        <p className="mt-2 text-sm sm:text-base italic text-primary [text-wrap:balance]">{highlights}</p>
      )}
    </motion.div>
  );
}
