// src/pages/DalaiLamaDarshan.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DalaiLamaBookingModal } from "@/components/shared/DalaiLamaBookingModal";
import { ImageGallery } from "@/components/shared/ImageGallery";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Heart,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Pilgrimage journey images
const pilgrimageImages = [
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326183/615407781_25649516711325385_1794480527887579625_n_1_fllh85.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326157/615437310_25649530281324028_8075386305152341324_n_mdtrhn.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326184/613281737_25649517241325332_7368243054541655567_n_1_w9tz4c.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326184/615831139_25649518104658579_2217277330478332336_n_1_kq9wxl.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326158/615205300_25649528121324244_11936629256746867_n_aa1o9c.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326158/615205300_25649528121324244_11936629256746867_n_aa1o9c.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326153/615164896_25649531911323865_5261475497619979381_n_thyhy7.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326153/614599939_25649539447989778_2042450989832947657_n_v4cbfa.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326152/615467517_25649540114656378_3282776082181225722_n_rdook3.jpg",
  "https://res.cloudinary.com/dcsgax3ld/image/upload/v1771326152/615399085_25649524354657954_2267486247401336271_n_myj9tj.jpg",
 
];

const availableDates = [
  { id: 1, label: "Mar 7 - 16, 2026", month: "March", spots: 15 },
  { id: 2, label: "Apr 14 - 23, 2026", month: "April", spots: 18 },
  { id: 3, label: "May 7 - 16, 2026", month: "May", spots: 12 },
  { id: 4, label: "May 21 - 30, 2026", month: "May", spots: 16 },
  { id: 5, label: "Jun 11 - 20, 2026", month: "June", spots: 20 },
  { id: 6, label: "Jul 2 - 11, 2026", month: "July", spots: 14 },
];

const fullItinerary = [
  {
    day: 1,
    date: "Jan 7",
    title: "Kathmandu → Bangalore → Bylakuppe",
    activities: [
      "Departure from Tribhuvan International Airport, Kathmandu",
      "Arrival at Bangalore Airport",
      "Meet & greet by tour partner representative",
      "Drive to Bylakuppe (scenic journey through Western Ghats)",
      "Visit Namdroling Monastery (5-6 hours)",
      "Explore Tibetan settlement",
    ],
    overnight: "Bylakuppe",
  },
  {
    day: 2,
    date: "Jan 8",
    title: "Namdroling & Sera Monastery",
    activities: [
      "Visit Namdroling Monastery - Golden Temple",
      "Explore Ngagyur Nyingma Institute",
      "Visit Nyingma Retreat Center",
      "Drive to Sera Monastery (Sera Je & Sera Mey)",
      "Experience debate sessions if available",
      "Evening prayers at monastery",
    ],
    overnight: "Bylakuppe",
  },
  {
    day: 3,
    date: "Jan 9",
    title: "Mundgod - Audience Preparation",
    activities: [
      "Drive to Mundgod (preparation begins)",
      "Briefing session for H.H. Dalai Lama audience",
      "Visit Gaden Jangtse Monastery",
      "Visit Gaden Shartse Monastery",
      "Visit Drepung Gomang",
      "Visit Drepung Loseling College",
      "Evening meditation and rest",
    ],
    overnight: "Mundgod",
  },
  {
    day: 4,
    date: "Jan 10",
    title: "✨ SPECIAL AUDIENCE WITH H.H. DALAI LAMA",
    activities: [
      "Early morning preparations",
      "Receive teachings and blessings from His Holiness",
      "Group photo opportunity (if permitted)",
      "Blessed moments of presence",
      "Reflection and meditation",
      "Evening celebration dinner",
    ],
    overnight: "Mundgod",
    highlighted: true,
  },
  {
    day: 5,
    date: "Jan 11",
    title: "Bylakuppe → Bangalore → Delhi",
    activities: [
      "Early morning drive to Bangalore (260km, 5 hours)",
      "Visit local attractions if time permits",
      "Flight Bangalore → Delhi",
      "Transfer to hotel",
      "Evening exploration of Delhi",
    ],
    overnight: "Delhi",
  },
  {
    day: 6,
    date: "Jan 12",
    title: "Delhi → Tsopema (Rewalsar Lake)",
    activities: [
      "Early morning drive to Tsopema (Sacred Padmasambhava site)",
      "Arrive at Rewalsar Lake (Tsopema) - the holy lake",
      "Visit Guru Rinpoche Cave - sacred pilgrimage site",
      "Evening Kora (circumambulation) around the holy lake",
      "Spiritual meditation by the lake",
      "Prayer sessions",
    ],
    overnight: "Rewalsar",
  },
  {
    day: 7,
    date: "Jan 13",
    title: "Tsopema - Deep Spiritual Immersion",
    activities: [
      "Early morning visit to Rewalsar Lake",
      "Visit Guru Rinpoche Cave - sacred pilgrimage site",
      "Explore Tso-Pema Monasteries",
      "Visit Padmasambhava Statue Viewpoint",
      "Evening Kora around the holy lake",
      "Sunset meditation and prayers",
    ],
    overnight: "Rewalsar",
  },
  {
    day: 8,
    date: "Jan 15",
    title: "Tsopema → Amritsar (Golden Temple)",
    activities: [
      "Early morning drive to Amritsar",
      "Arrive at Sri Harmandir Sahib (Golden Temple)",
      "Langar Seva experience - serve and eat with community",
      "Circumambulation of the Golden Temple",
      "Optional: Wagah Border Flag Ceremony",
      "Evening prayers and reflection",
    ],
    overnight: "Amritsar",
  },
  {
    day: 9,
    date: "Jan 16",
    title: "Amritsar → Delhi → Kathmandu",
    activities: [
      "Early morning at Golden Temple",
      "Morning breakfast at hotel",
      "Drive to Delhi Airport",
      "Flight Delhi → Kathmandu",
      "Arrival in Kathmandu",
      "Tour ends with Blessings from His Holiness",
    ],
    overnight: "Home",
  },
];

const inclusions = [
  "Round-trip Flights (Kathmandu-Bangalore, Bangalore-Delhi, Delhi-Kathmandu)",
  "AC Vehicles for entire ground transportation",
  "Accommodation in non-star hotels and monastery guest houses",
  "All meals (breakfast, lunch, dinner) - Pure Vegetarian",
  "Special arrangements for H.H. Dalai Lama audience",
  "Entrance fees to all monasteries and pilgrimage sites",
  "Airport transfers and assistance",
  "Expert guides and trained trip captains",
  "Spiritual briefing and preparation sessions",
  "All permits and taxes",
];

const exclusions = [
  "Personal expenses (shopping, tips, laundry)",
  "Travel insurance (recommended)",
  "Unpredictable costs due to weather or flight delays",
  "Donations to monasteries (optional but appreciated)",
  "Any items not mentioned in inclusions",
];

export default function DalaiLamaDarshanPage() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [travelers, setTravelers] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* ═══════════════════════════════════════════════════
            HERO — Full-bleed banner image at very top
        ═══════════════════════════════════════════════════ */}
        <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
          {/* Banner image */}
          <img
            src="https://peregrinetreks.com/wp-content/uploads/2024/07/Dalai-Lama.webp"
            alt="His Holiness the 14th Dalai Lama"
            className="w-full h-full object-cover object-center"
          />

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

          {/* Navbar sits on top via its own fixed/sticky positioning */}

          {/* Hero content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:pb-14">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl"
              >
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-white/50" />
                  <span className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
                    🙏 Exclusive Pilgrimage · 9 Days
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-4">
                  His Holiness the
                  <br />
                  <span className="text-primary">14th Dalai Lama</span>
                  <br />
                  Darshan Pilgrimage
                </h1>

                <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed mb-8">
                  Receive direct blessings from His Holiness, visit sacred
                  monasteries, and experience inner transformation on this
                  exclusive 9-day journey through South and North India.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={() => setIsInquiryOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-5 text-base group"
                  >
                    Inquiry Now
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <a
                    href="https://wa.me/+917363933945?text=Hi!%20I%27m%20interested%20in%20the%20Dalai%20Lama%20Darshan%20pilgrimage"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-bold px-8 py-5 text-base bg-transparent"
                    >
                      💬 WhatsApp Us
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════════════
            QUICK FACTS BAR
        ═══════════════════════════════════════════════════ */}
        <section className="bg-primary py-4 md:py-5">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/20">
              {[
                { icon: "📅", label: "Duration", value: "9 Days" },
                { icon: "✨", label: "Blessed Audience", value: "Day 4" },
                { icon: "🕌", label: "Sacred Sites", value: "8 Monasteries" },
                { icon: "🌿", label: "Meals", value: "Pure Vegetarian" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 md:px-8 py-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-white/70 font-medium">{item.label}</p>
                    <p className="text-sm font-bold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            MAIN CONTENT + INQUIRY SIDEBAR
        ═══════════════════════════════════════════════════ */}
        <section className="py-10 md:py-16 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-10 items-start">
              {/* ──────────────────────────────────────
                  MAIN CONTENT — Left (2 cols)
              ────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-12">

                {/* Itinerary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-2xl font-display font-bold text-foreground whitespace-nowrap">
                      Complete 9-Day Itinerary
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-3">
                    {fullItinerary.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.04 }}
                        className={`rounded-xl p-5 border-l-[3px] transition-all ${
                          day.highlighted
                            ? "bg-primary/8 border-l-primary shadow-sm"
                            : "bg-secondary/50 border-l-border hover:border-l-primary/40 hover:bg-secondary/80"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`text-[10px] font-black tracking-widest uppercase ${day.highlighted ? 'text-primary' : 'text-muted-foreground'}`}>
                              DAY {day.day}
                            </span>
                            <h3 className={`font-bold text-base ${day.highlighted ? 'text-primary' : 'text-foreground'}`}>
                              {day.title}
                            </h3>
                          </div>
                          {day.highlighted && (
                            <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                              ✨ HIGHLIGHT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          📅 {day.date} &nbsp;·&nbsp; Overnight: {day.overnight}
                        </p>
                        <div className="grid md:grid-cols-2 gap-1.5">
                          {day.activities.map((activity, idx) => (
                            <div key={idx} className="flex gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-2xl font-display font-bold text-foreground whitespace-nowrap">
                      Journey Highlights
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <ImageGallery images={pilgrimageImages} maxDisplay={6} />
                </motion.div>

                {/* Inclusions & Exclusions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      What's Included
                    </h2>
                    <div className="space-y-2">
                      {inclusions.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                          <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-display font-bold text-foreground">
                      Not Included
                    </h2>
                    <div className="space-y-2">
                      {exclusions.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                          <span className="text-muted-foreground mt-0.5 shrink-0">○</span>
                          <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Why This Journey */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-2xl font-display font-bold text-foreground whitespace-nowrap">
                      Why This Pilgrimage?
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: "🙏",
                        title: "Direct Blessing",
                        desc: "Receive teachings and blessings directly from His Holiness the 14th Dalai Lama",
                      },
                      {
                        icon: "🕌",
                        title: "Sacred Monasteries",
                        desc: "Visit 8 ancient Buddhist temples and pilgrimage sites across India",
                      },
                      {
                        icon: "🧭",
                        title: "Expert Guides",
                        desc: "Trained spiritual guides with deep knowledge and 24/7 support",
                      },
                      {
                        icon: "🌿",
                        title: "Pure Vegetarian",
                        desc: "All meals included — traditional pure vegetarian food throughout",
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-secondary/50 rounded-xl p-5 hover:bg-secondary transition-colors"
                      >
                        <p className="text-2xl mb-3">{item.icon}</p>
                        <h3 className="font-bold text-base text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ──────────────────────────────────────
                  INQUIRY CARD — Right (sticky)
              ────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-24 space-y-5"
              >
                {/* Inquiry Card */}
                <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
                  {/* Card header */}
                  <div className="bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 opacity-80" />
                      <p className="text-xs font-bold tracking-widest uppercase opacity-80">
                        Sacred Pilgrimage
                      </p>
                    </div>
                    <h3 className="text-xl font-display font-bold mb-1">
                      Send an Inquiry
                    </h3>
                    <p className="text-xs opacity-75">
                      We'll get back to you within 24 hours
                    </p>
                  </div>

                  {/* Card content */}
                  <div className="p-5 space-y-5">
                    {/* Date Selection */}
                    <div className="space-y-2.5">
                      <label className="block text-sm font-bold text-foreground">
                        🗓️ Preferred Date
                      </label>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {availableDates.map((date) => (
                          <motion.button
                            key={date.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setSelectedDate(date)}
                            className={`w-full p-2.5 rounded-lg border transition-all text-left text-sm ${
                              selectedDate.id === date.id
                                ? "border-primary bg-primary/8 text-foreground"
                                : "border-border bg-background hover:border-primary/40 text-muted-foreground"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className={`font-semibold ${selectedDate.id === date.id ? 'text-foreground' : ''}`}>
                                  {date.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {date.spots} spots available
                                </p>
                              </div>
                              {selectedDate.id === date.id && (
                                <span className="text-primary font-bold text-base">✓</span>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Traveler Count */}
                    <div className="space-y-2.5">
                      <label className="block text-sm font-bold text-foreground">
                        👥 Number of Travelers
                      </label>
                      <div className="flex items-center gap-3 bg-secondary rounded-lg p-2.5">
                        <button
                          onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          className="w-9 h-9 rounded-lg bg-background border border-border hover:bg-muted transition-colors flex items-center justify-center font-bold text-lg"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center font-bold text-xl text-foreground">
                          {travelers}
                        </span>
                        <button
                          onClick={() => setTravelers(Math.min(10, travelers + 1))}
                          className="w-9 h-9 rounded-lg bg-background border border-border hover:bg-muted transition-colors flex items-center justify-center font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-secondary/60 rounded-lg p-4 space-y-2">
                      {[
                        "Flights, accommodation & all meals included",
                        "Special H.H. Dalai Lama audience arrangements",
                        "Zero-cost EMI options available",
                      ].map((benefit, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2.5 pt-1 border-t border-border">
                      <Button
                        size="lg"
                        onClick={() => setIsInquiryOpen(true)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-5 group"
                      >
                        Inquiry Now
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>

                      <a
                        href={`https://wa.me/+917363933945?text=Hi!%20I%27m%20interested%20in%20the%20Dalai%20Lama%20Darshan%20pilgrimage%20for%20${selectedDate.label}.%20Total%20travelers:%20${travelers}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full font-bold border-2 text-sm py-4"
                        >
                          💬 Chat on WhatsApp
                        </Button>
                      </a>
                    </div>

                    {/* Trust */}
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">
                        <span className="text-primary font-bold">✓</span> Secure Inquiry &nbsp;·&nbsp;
                        <span className="text-primary font-bold">✓</span> 24/7 Support &nbsp;·&nbsp;
                        <span className="text-primary font-bold">✓</span> Expert Guides
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected summary pill */}
                <div className="bg-secondary rounded-xl p-4 border border-border space-y-2">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Your Selection
                  </h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong className="text-foreground">Date:</strong> {selectedDate.label}</p>
                    <p><strong className="text-foreground">Travelers:</strong> {travelers} person{travelers !== 1 ? "s" : ""}</p>
                    <p><strong className="text-foreground">Spots left:</strong> {selectedDate.spots}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Inquiry Modal */}
      <DalaiLamaBookingModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        travelers={travelers}
        selectedDate={selectedDate.label}
      />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}