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
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Pilgrimage journey images
const pilgrimageImages = [
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615407781_25649516711325385_1794480527887579625_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=B_S_wH_epK8Q7kNvwFmZpCz&_nc_oc=AdnGMx-8GGJT2hvwKErP-neFDUjeRLIRGNSeKzWvB4O-9eDZhInpsbSP6dVj4ZWtA-s&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=7q327lB9dprI6WOcSM8-SA&oh=00_AfvjyxnvsFKtfrN8oSMgBhst7FhwyWi4ylDARsZoUDAnFg&oe=69936384",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/613281737_25649517241325332_7368243054541655567_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=v-0mAAHlXU8Q7kNvwGN_p9w&_nc_oc=AdmIWYeQAa6nEE2ReQ8EJM2Z1LEKoZZPQwJR68fl3oiKEAIENRdqBkE0DJIYGlffQzY&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=z5ozv7eNrdaIdG2Oi_723A&oh=00_AfvdI-KmrVhqJgeSypprn1MBRINXaT5By-fxxkmS0hnP2A&oe=699357FC",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615831139_25649518104658579_2217277330478332336_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dHZy0Ou5GHIQ7kNvwF6JtVR&_nc_oc=AdkHhCxR8sku2gI7DiYWBk3KbCoJK54qvXMZT9tAFzCCSasFMzNnuTIozcKUMHo9DyU&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=u7wF7OZuuRkQDXB43_sAqg&oh=00_Aft4kgblR55UJT-ReCuuyHU7UgFwZv9pxf2240w_UEkAJQ&oe=69936ED7",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615330000_25649523071324749_556856111905171096_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8b0jy2uuSdkQ7kNvwEYmBd4&_nc_oc=Adlt_C_Cfr91Q2fRRHX_65_isw8XvfppxwCwtEdWghj9E2zb5294Ax4TfYFBZS5OxnI&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=Q_FORfoZtQftZoZXbv_72A&oh=00_AfvdWe7tJFPjgDBoSk5oLRxcnyFW72YzB7w_W0Rttq2GNQ&oe=69935C57",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/614898602_25649544384655951_4647058322178075868_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=MSLJv3SW4NcQ7kNvwFzBHrE&_nc_oc=AdmHA_-BLguzKbCHUpOC8tkq5IW2K87-HETXCtJQ1c2OS9rlXpzMhsIqBCGo2sPa-0Q&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=gm7YTOuDqjqdVQWTN-xAwQ&oh=00_AfsLl1Cvyv0_lHUN9es2wTbd5JekJQC1wvF5tqjMoAaMbw&oe=69937E2B",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615749780_25649544914655898_8181865544175473920_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=95n-YVbFWLgQ7kNvwEzoT6W&_nc_oc=Adl4vmS-scu8JylsBxUJHxDEyqcTkddLRke6aKy_s4BVdH7ceUB9gggcgk8aCSnxLfk&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=m6RPFYx41u8WBUGfxrdg1Q&oh=00_AfvOVdBZ0IDe8RlW5pA3Ezr_dSDkkCDrdjAsf90gdfNzyg&oe=69937147",
  
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/614487863_25649546081322448_1741576006573135087_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=WTS-OhaX4roQ7kNvwHQULS4&_nc_oc=AdmLukbFDBUPiMI6wqtJpS0B4xirkzb-eOyQBJJfSRA4AUyu8iDFvyKHAdbAlY4Nd3k&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=mYC5EQt-c0-r4ey-mA0Vjw&oh=00_AftwZGiO0KhGobjnjPyTEP4rw5DfnVXufSGxY7u0bpwI7A&oe=699381B6",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/613773166_25649543144656075_7472832031259212044_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=RXwFs3hjKvgQ7kNvwHJhGgX&_nc_oc=AdnET8q6K8flls_nZBBGL8Vp4z6ZI8JHGti7ZaJfmhssL7074Vyg32Sh3wpo9Tiy1o0&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=_GE9JJ9zHFow4r2RUB901g&oh=00_Afva7qNq9BlH-xP3TuWTWZcknQGRhSDrZD3GXE30fw7TGA&oe=69936DAB",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615467517_25649540114656378_3282776082181225722_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=0HRVg-lSD7AQ7kNvwGdYR_f&_nc_oc=Adk_k5cpExGT__ipZKSYex8JaK5nGbAc3CR9UFcJRR3xrBHNb1FS46DbU6BHKxXSsdM&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=P6iNk54t2SeOE66EAyaa2A&oh=00_AftPCCBCSR0E2vwG-rRzMm-pRtHcRVZe2J-N7F_-gAi9og&oe=69937EBD",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615220699_25649538887989834_1016535208220875553_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dLG4-WnZjxAQ7kNvwHwFBAn&_nc_oc=AdlYzSGopwcbBRpm56ExB635Po12etnRIsVfBm-8P64yex7VOL-ceyBcWAGHQAVYg9g&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=MtDEpJ_D9JVIxvcXQbmf9w&oh=00_AfshG5u7fmJZgG8OxpxdsGc0nPNL0OtslG3AaWU4hYxfww&oe=69937077",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/614599939_25649539447989778_2042450989832947657_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=06sOc1BxyO4Q7kNvwENJYQG&_nc_oc=AdlxxiaMXNghE6t8UZho2KIFvxlcn60pceiDw4C2HFiJuKwdIJKQvktajeQ_E6blqn8&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=yQKpnoO1JiWTrEVye0qWoA&oh=00_AftKFovi6jdYtlOKjZpmL9Xs7W1aHI2Y1qsGw1Tt8SogZA&oe=6993701F",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615164896_25649531911323865_5261475497619979381_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=uRNoXv_-RFIQ7kNvwGUQoze&_nc_oc=AdkmmNOmFOfBPnRdUmPMabiBkBJ1uXtgm4FiAVchD3Lurtbqn5qF1CakhUrPPLH2Uu8&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=TjhZuc1fTFVUR5udp9C2uw&oh=00_AfvpY4X_iI8AM6LFKlnA6cPkUhlJ4yf2ZLxFiTnrpbahpQ&oe=699371A0",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615437310_25649530281324028_8075386305152341324_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=DWZMvYFo85MQ7kNvwHH0B2K&_nc_oc=Adlvull2pUgdb98g8opVRay8-4iKiIPJ64q2wSjRv1vcWGtZ5LCBqx4pzhMvuIv95sM&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=zrPxHHICwC-i-vXOlg2jfg&oh=00_AfvDDWgnLkTMf2Xw1fo21A0pO4PtrZrs_kRk7wp9K4Yj9A&oe=69935541",
  "https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/615399085_25649524354657954_2267486247401336271_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=XeOmgIOu7AwQ7kNvwHb9Q0C&_nc_oc=Adn42OyDin93RWG55uTP-FCwz8Kn3CKpjAcfZGOiIGFj2XfeP4VdtzTvaBM1ENKyYAY&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=owPjqmOJynsGo0HXjtLgdw&oh=00_AfukWI9YMbE-vOgl2rs1_iJn3JfkcI_6DMmMqbTR2uPRCw&oe=69936940",
];

const availableDates = [
  { id: 1, label: "Mar 7 - 16, 2026", month: "March", spots: 15 },
  { id: 2, label: "Apr 14 - 23, 2026", month: "April", spots: 18 },
  { id: 3, label: "May 7 - 16, 2026", month: "May", spots: 12 },
  { id: 4, label: "May 21 - 30, 2026", month: "May", spots: 16 },
  { id: 5, label: "Jun 11 - 20, 2026", month: "June", spots: 20 },
  { id: 6, label: "Jul 2 - 11, 2026", month: "July", spots: 14 },
];

// FULL 9-DAY ITINERARY
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
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [travelers, setTravelers] = useState(1);

  const pricePerPerson = 100000;
  const totalPrice = pricePerPerson * travelers;

  const handleBookNow = () => {
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero Section with Image */}
        <section className="relative pt-20 pb-0 overflow-hidden">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-8"
            >
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary">
                  🙏 EXCLUSIVE PILGRIMAGE
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                His Holiness the 14th Dalai Lama
                <br />
                <span className="text-primary">Darshan Pilgrimage</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Experience a transformative 9-day spiritual journey. Receive
                blessings directly from His Holiness the 14th Dalai Lama,
                visit sacred monasteries, and experience inner transformation.
              </p>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative h-96 md:h-[480px] w-full overflow-hidden"
          >
            <img
              src="https://peregrinetreks.com/wp-content/uploads/2024/07/Dalai-Lama.webp"
              alt="His Holiness the 14th Dalai Lama"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-8 pt-16">
              <p className="text-white text-sm font-semibold">
                
              </p>
            </div>
          </motion.div>
        </section>

        {/* Main Content Section */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Main Content - Left */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Facts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[
                    { label: "Duration", value: "9 Days" },
                    { label: "Blessed Audience", value: "Day 4" },
                    { label: "Monasteries", value: "8 Sites" },
                    { label: "Group Type", value: "Limited" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="font-bold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* FULL 9-DAY ITINERARY */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Complete 9-Day Itinerary
                  </h2>

                  <div className="space-y-3">
                    {fullItinerary.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-lg p-4 border-l-4 transition-all ${
                          day.highlighted
                            ? "bg-primary/15 border-l-primary"
                            : "bg-white border-l-secondary"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-primary">
                              DAY {day.day}
                            </span>
                            <h3 className="font-semibold text-foreground">
                              {day.title}
                            </h3>
                          </div>
                          {day.highlighted && (
                            <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">
                              ✨ SPECIAL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          📅 {day.date} • Overnight: {day.overnight}
                        </p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {day.activities.map((activity, idx) => (
                            <div key={idx} className="flex gap-2">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {activity}
                              </span>
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
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Journey Highlights
                  </h2>

                  <ImageGallery images={pilgrimageImages} maxDisplay={6} />
                </motion.div>

                {/* Inclusions & Exclusions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {/* Inclusions */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      What's Included
                    </h2>
                    <div className="space-y-2">
                      {inclusions.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-white rounded-lg">
                          <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Not Included
                    </h2>
                    <div className="space-y-2">
                      {exclusions.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-white rounded-lg">
                          <span className="text-2xl">○</span>
                          <span className="text-sm text-muted-foreground">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* BOOKING CARD - Right (Sticky) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-24 space-y-6"
              >
                {/* Price Card */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-primary/20 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                    <p className="text-sm font-semibold opacity-90 mb-2">
                      Per Person Price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        ₹{pricePerPerson.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 mt-2">
                      Including all flights, accommodation & meals
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Date Selection */}
                    <div className="space-y-3">
                      <label className="block font-semibold text-foreground">
                        🗓️ Select Your Date
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableDates.map((date) => (
                          <motion.button
                            key={date.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedDate(date)}
                            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                              selectedDate.id === date.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-white hover:border-primary/50"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-foreground">
                                  {date.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {date.spots} spots left
                                </p>
                              </div>
                              {selectedDate.id === date.id && (
                                <span className="text-primary font-bold">✓</span>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Traveler Count */}
                    <div className="space-y-3">
                      <label className="block font-semibold text-foreground">
                        👥 Number of Travelers
                      </label>
                      <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                        <button
                          onClick={() =>
                            setTravelers(Math.max(1, travelers - 1))
                          }
                          className="w-10 h-10 rounded-lg bg-white border border-border hover:bg-muted transition-colors flex items-center justify-center font-bold"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center font-bold text-lg text-foreground">
                          {travelers}
                        </span>
                        <button
                          onClick={() =>
                            setTravelers(Math.min(10, travelers + 1))
                          }
                          className="w-10 h-10 rounded-lg bg-white border border-border hover:bg-muted transition-colors flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="bg-secondary rounded-lg p-4 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Amount
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {travelers} × ₹{pricePerPerson.toLocaleString()}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2 bg-primary/10 rounded-lg p-4">
                      <div className="flex gap-2">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground font-semibold">
                          20% Down Payment to Secure Spot
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground font-semibold">
                          Zero-Cost EMI Available
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground font-semibold">
                          Free Cancellation on Groups
                        </span>
                      </div>
                    </div>

                    {/* CTA BUTTONS */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <Button
                        size="lg"
                        onClick={handleBookNow}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6"
                      >
                        BOOK NOW
                      </Button>

                      <a
                        href={`https://wa.me/919876543210?text=Hi!%20I%27m%20interested%20in%20the%20Dalai%20Lama%20Darshan%20pilgrimage%20for%20${selectedDate.label}.%20Total%20travelers:%20${travelers},%20Amount:%20₹${totalPrice.toLocaleString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full font-bold border-2"
                        >
                          💬 Chat Now
                        </Button>
                      </a>
                    </div>

                    {/* Trust Badge */}
                    <div className="pt-4 border-t border-border text-center">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">✓</span> Secure
                        Booking • <span className="font-semibold text-primary">✓</span> 24/7 Support
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/30 space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Selected Details
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="text-foreground">
                      <strong>Date:</strong> {selectedDate.label}
                    </p>
                    <p className="text-foreground">
                      <strong>Travelers:</strong> {travelers} person
                      {travelers !== 1 ? "s" : ""}
                    </p>
                    <p className="text-foreground">
                      <strong>Total:</strong>{" "}
                      <span className="font-bold text-primary">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why This Journey */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Why This Pilgrimage?
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Direct Blessing",
                    desc: "Receive teachings from His Holiness the 14th Dalai Lama",
                  },
                  {
                    title: "Sacred Monasteries",
                    desc: "Visit 8 ancient Buddhist temples and spiritual sites",
                  },
                  {
                    title: "Expert Guides",
                    desc: "Trained spiritual guides with 24/7 support",
                  },
                  {
                    title: "Pure Vegetarian",
                    desc: "All meals included - traditional pure vegetarian food",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-secondary rounded-lg p-6"
                  >
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      <DalaiLamaBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        travelers={travelers}
        selectedDate={selectedDate.label}
        totalAmount={totalPrice}
      />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}