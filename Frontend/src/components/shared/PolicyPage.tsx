import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export interface PolicySection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface PolicyPageProps {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: PolicySection[];
}

const otherPolicies = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cancellation Policy", href: "/cancellation" },
  { label: "Terms & Conditions", href: "/terms" },
];

export function PolicyPage({ title, intro, lastUpdated, sections }: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {intro}
          </motion.p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <div key={section.heading}>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              Padmasambhava Trip Pvt. Ltd., Siliguri 734001, West Bengal, India.
              <br />
              Phone / WhatsApp:{" "}
              <a href="tel:+917363933945" className="text-primary hover:underline">
                (+91) 73639 33945
              </a>
              <br />
              Email:{" "}
              <a href="mailto:info@padmasambhavatrip.com" className="text-primary hover:underline">
                info@padmasambhavatrip.com
              </a>
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm">
              {otherPolicies
                .filter((policy) => policy.label !== title)
                .map((policy) => (
                  <Link key={policy.href} to={policy.href} className="text-primary hover:underline">
                    {policy.label}
                  </Link>
                ))}
              <Link to="/contact" className="text-primary hover:underline">
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
