import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Users, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Check,
  X,
  MessageCircle,
  Minus,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BookingFormModal } from "@/components/shared/BookingFormModal";
import { cn } from "@/lib/utils";

// Import data from separate file
import { 
  getTripDataById, 
  TRIP_TABS, 
  PRICING_DETAILS, 
  WHATSAPP_CONTACT,
} from "@/data/tripData";
import type { TripDetail, TripDate } from "@/data/tripData";

const tabs = TRIP_TABS;

export default function TripDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Itinerary");
  const [expandedDays, setExpandedDays] = useState<number[]>([0]);
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState<TripDate | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tripData, setTripData] = useState<TripDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load trip data
  useEffect(() => {
    if (id) {
      const data = getTripDataById(id);
      setTripData(data);
      if (data) {
        setSelectedDate(data.dates[0]);
      }
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 400;
      setIsSticky(window.scrollY > heroHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const scrollToSection = (tabName: string) => {
    setActiveTab(tabName);
    const element = document.getElementById(tabName.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground text-lg">Trip not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src={tripData.image}
          alt={tripData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            {tripData.name}
          </h1>
          <p className="text-xl text-white/90">
            {tripData.duration}
          </p>
        </div>
      </section>

      {/* Sticky Navigation Tabs */}
      {isSticky && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 shadow-md"
        >
          <div className="container mx-auto px-4">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className={cn(
                    "px-4 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 border-transparent",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Trip Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-4">
              About This Trip
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {tripData.description}
            </p>
          </section>

          {/* Itinerary Section */}
          <section id="itinerary" className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              Itinerary (Day by Day)
            </h2>
            <div className="space-y-3">
              {tripData.itinerary.map((item) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleDay(item.day)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-primary text-lg">
                        Day {item.day}
                      </span>
                      <span className="text-foreground font-medium">
                        {item.title}
                      </span>
                    </div>
                    {expandedDays.includes(item.day) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedDays.includes(item.day) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-muted/50 px-6 py-4"
                    >
                      <ul className="space-y-2">
                        {item.highlights.map((highlight, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Inclusions Section */}
          <section id="inclusions" className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              What's Included & Excluded
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Included
                </h3>
                <ul className="space-y-3">
                  {tripData.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-destructive flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Not Included
                </h3>
                <ul className="space-y-3">
                  {tripData.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-1" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Costing Section */}
          <section id="costing" className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              Pricing Details
            </h2>
            <div className="bg-muted rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold">Sharing Mode</th>
                    <th className="text-right p-4 font-semibold">Price per Person</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_DETAILS.map((detail, index) => (
                    <tr
                      key={index}
                      className={cn(
                        "border-b border-border",
                        detail.isSupplementary ? "" : ""
                      )}
                    >
                      <td className="p-4">{detail.sharing}</td>
                      <td className="p-4 text-right">
                        {detail.isSupplementary ? (
                          <span className="text-xl font-bold">
                            +₹{Math.abs(detail.priceOffset).toLocaleString()}
                          </span>
                        ) : (
                          <>
                            <span className="text-xl font-bold">
                              ₹{(tripData.price + detail.priceOffset).toLocaleString()}
                            </span>
                            {index === 0 && (
                              <span className="ml-2 price-original">
                                ₹{tripData.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Notes Section */}
          <section id="notes" className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              Important Notes
            </h2>
            <ul className="space-y-3">
              {tripData.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:w-96">
          <div className="lg:sticky lg:top-24">
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Trip Starts From</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    ₹{selectedDate?.price.toLocaleString()}
                  </span>
                  <span className="price-original">
                    ₹{tripData.originalPrice.toLocaleString()}
                  </span>
                </div>
                <span className="price-discount">
                  ₹{tripData.discount.toLocaleString()} Off
                </span>
                <p className="text-sm text-muted-foreground mt-1">Per Person</p>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Trip Dates</span>
                </div>
                <div className="space-y-2">
                  {tripData.dates.map((date, index) => (
                    <label
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                        selectedDate?.date === date.date
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="tripDate"
                          checked={selectedDate?.date === date.date}
                          onChange={() => setSelectedDate(date)}
                          className="w-4 h-4 text-primary"
                        />
                        <span>{date.date}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ₹{date.price.toLocaleString()}/Person
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Traveler Count */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium">No. of Travellers</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-border transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold">{travelers}</span>
                  <button
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-border transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="py-4 border-t border-border mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-2xl font-bold">
                    ₹{selectedDate ? (selectedDate.price * travelers).toLocaleString() : "0"}
                  </span>
                </div>
              </div>

              {/* Book Now */}
              <Button
                className="w-full h-12 text-base mb-4"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Book Now
              </Button>

              {/* WhatsApp */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Any Doubt?</span>
                <a
                  href={`https://wa.me/${WHATSAPP_CONTACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tripName={tripData.name}
      />
    </div>
  );
}