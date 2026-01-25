import { motion } from "framer-motion";

const trustBadges = [
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="28" height="32" rx="2" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
        <path d="M14 20L20 26L32 14" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/>
        <text x="14" y="36" fontSize="10" fill="#22C55E" fontWeight="bold">20%</text>
        <text x="34" y="28" fontSize="14" fill="#EF4444" fontWeight="bold">₹</text>
      </svg>
    ),
    title: "Secure Your Spot by Paying 20% of the Trip",
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="12" width="32" height="20" rx="2" fill="#86EFAC"/>
        <circle cx="34" cy="22" r="10" fill="#FBBF24"/>
        <path d="M32 22L36 26" stroke="white" strokeWidth="2"/>
        <text x="10" y="26" fontSize="10" fill="#22C55E" fontWeight="bold">0%</text>
        <path d="M30 6L38 6" stroke="#1F2937" strokeWidth="2"/>
        <text x="36" y="18" fontSize="8" fill="#1F2937">₹</text>
      </svg>
    ),
    title: "Book Your Trip on Easy Zero-Cost EMI",
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="28" height="36" rx="2" fill="#FEE2E2"/>
        <path d="M8 12H28M8 20H28M8 28H20" stroke="#EF4444" strokeWidth="2"/>
        <path d="M28 8L36 4V12L28 8Z" fill="#EF4444"/>
        <text x="30" y="10" fontSize="6" fill="white" fontWeight="bold">FREE</text>
        <circle cx="32" cy="28" r="10" fill="#22C55E"/>
        <path d="M28 28L31 31L37 25" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    title: "Free Travel Insurance on Every Trip",
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="28" height="32" rx="2" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
        <circle cx="18" cy="18" r="6" fill="#22C55E"/>
        <path d="M15 18L17 20L21 16" stroke="white" strokeWidth="2"/>
        <path d="M30 14L38 6" stroke="#1F2937" strokeWidth="2"/>
        <circle cx="38" cy="6" r="4" fill="#22C55E"/>
        <path d="M36 6L40 6M38 4L38 8" stroke="white" strokeWidth="1"/>
      </svg>
    ),
    title: "Free Cancellation on Group Trips",
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="28" height="28" rx="4" fill="#86EFAC"/>
        <circle cx="18" cy="22" r="8" fill="white" stroke="#22C55E" strokeWidth="2"/>
        <path d="M18 18V22H22" stroke="#EF4444" strokeWidth="2"/>
        <text x="34" y="28" fontSize="14" fill="#22C55E" fontWeight="bold">₹</text>
      </svg>
    ),
    title: "Reschedule at No Extra Charges",
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="#86EFAC"/>
        <path d="M20 20C20 16 28 16 28 20C28 24 24 24 24 28" stroke="#22C55E" strokeWidth="2"/>
        <rect x="30" y="16" width="12" height="16" rx="2" fill="white" stroke="#22C55E" strokeWidth="2"/>
        <text x="34" y="28" fontSize="8" fill="#22C55E" fontWeight="bold">24/7</text>
      </svg>
    ),
    title: "24*7 Support & Trained Trip Captains",
  },
];

export function BookWithConfidence() {
  return (
    <section className="py-12 bg-cream-warm">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            Book with Confidence
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="shrink-0">
                {badge.icon}
              </div>
              <p className="text-sm font-medium text-foreground">
                {badge.title}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-right text-sm text-muted-foreground mt-6"
        >
          *T&C Applied
        </motion.p>
      </div>
    </section>
  );
}
