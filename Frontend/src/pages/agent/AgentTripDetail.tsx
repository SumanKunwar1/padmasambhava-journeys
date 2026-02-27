// src/pages/agent/AgentTripDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Minus,
  Plus,
  MapPin,
  Clock,
  Gift,
  DollarSign,
  TrendingUp,
  Briefcase,
  LogOut,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AgentBookingFormModal } from "@/components/shared/AgentBookingFormModal";
import { agentTripsService, AgentTrip as AgentTripType } from "@/services/agentTrips";

const TRIP_TABS = ["Itinerary", "Inclusions", "B2B Pricing", "Notes"];

// Using AgentTripType from agentTrips service (imported above)

export default function AgentTripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Itinerary");
  const [expandedDays, setExpandedDays] = useState<number[]>([0]);
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState<AgentTripType["dates"][0] | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tripData, setTripData] = useState<AgentTripType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch trip from API
  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await agentTripsService.getTrip(id);
        const trip: AgentTripType = response.data.trip;
        setTripData(trip);
        if (trip.dates && trip.dates.length > 0) {
          setSelectedDate(trip.dates[0]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load trip details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("agentLoggedIn");
    navigate("/agent/login");
  };

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const b2bPriceWithDate = tripData ? tripData.b2bPrice : 0;
  const retailPriceWithDate = selectedDate ? selectedDate.price : (tripData?.price ?? 0);
  const totalB2BAmount = b2bPriceWithDate * travelers;
  const totalRetailAmount = retailPriceWithDate * travelers;
  const yourEarning = totalRetailAmount - totalB2BAmount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Trip Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "This trip could not be loaded."}</p>
          <Button onClick={() => navigate("/agent/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Agent Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Back & Logo */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/agent/dashboard")}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-sm font-display font-bold text-foreground">
                    Agent Portal
                  </h1>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || "Agent"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.agencyName || "Travel Agency"}
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src={tripData.image}
          alt={tripData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container-custom">
            <div className="flex items-center gap-2 text-white/90 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{tripData.destination}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
              {tripData.name}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{tripData.duration}</span>
              </div>
              {tripData.hasGoodies && (
                <div className="flex items-center gap-2 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm">Free Goodies Included</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-6"
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Trip Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {tripData.description}
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
                {TRIP_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors",
                      activeTab === tab
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Itinerary Tab */}
                {activeTab === "Itinerary" && (
                  <div className="space-y-4">
                    {tripData.itinerary.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-slate-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleDay(index)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                              {day.day}
                            </div>
                            <h3 className="font-semibold text-foreground text-left">
                              {day.title}
                            </h3>
                          </div>
                          {expandedDays.includes(index) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        {expandedDays.includes(index) && (
                          <div className="p-4 bg-white">
                            <ul className="space-y-2">
                              {day.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">
                                    {highlight}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Inclusions Tab */}
                {activeTab === "Inclusions" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {tripData.inclusions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <X className="w-5 h-5 text-red-600" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {tripData.exclusions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* B2B Pricing Tab */}
                {activeTab === "B2B Pricing" && (
                  <div className="space-y-6">
                    {/* Commission Info */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-600 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-green-900">
                            {tripData.commission}% Commission Rate
                          </h3>
                          <p className="text-sm text-green-700">
                            Earn ₹{yourEarning.toLocaleString()} on this booking
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Your B2B Price
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          ₹{b2bPriceWithDate.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Per person (what you pay)
                        </p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-muted-foreground mb-1">
                          Retail Price
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          ₹{retailPriceWithDate.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Per person (suggested selling price)
                        </p>
                      </div>
                    </div>

                    {/* Occupancy Pricing */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">
                        Pricing by Occupancy Type
                      </h3>
                      {tripData.occupancyPricing && tripData.occupancyPricing.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                                  Sharing Type
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                                  B2B Price
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                                  Retail Price
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                                  Your Earning
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {tripData.occupancyPricing.map((row) => (
                                <tr key={row.type} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 text-sm text-foreground">
                                    {row.type}
                                    {row.isSupplementary && (
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        (Supplementary)
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-medium text-primary">
                                    ₹{row.b2bPrice.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-medium">
                                    ₹{row.retailPrice.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                                    ₹{(row.retailPrice - row.b2bPrice).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <p className="text-muted-foreground text-sm">
                            No occupancy pricing configured for this trip.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Terms */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Payment Terms for Agents
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>• 50% advance at time of booking</li>
                        <li>• 50% balance 15 days before departure</li>
                        <li>• Commission credited after tour completion</li>
                        <li>• Bank transfer or UPI accepted</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === "Notes" && (
                  <ul className="space-y-3">
                    {tripData.notes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-muted-foreground">{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div
              className={cn(
                "bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all",
                isSticky && "lg:sticky lg:top-24"
              )}
            >
              {/* B2B Pricing Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">B2B Price</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold">
                    ₹{b2bPriceWithDate.toLocaleString()}
                  </span>
                  <span className="text-white/80 text-sm">per person</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <span className="line-through">
                    ₹{retailPriceWithDate.toLocaleString()}
                  </span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                    {tripData.commission}% off
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Departure Date
                  </label>
                  <div className="space-y-2">
                    {tripData.dates.map((date) => (
                      <button
                        key={date.date}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          selectedDate?.date === date.date
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            {new Date(date.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {date.available} seats
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Travelers
                  </label>
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-lg">{travelers}</span>
                    </div>
                    <button
                      onClick={() => setTravelers(travelers + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">B2B Price × {travelers}</span>
                    <span className="font-medium">
                      ₹{totalB2BAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Suggested Retail</span>
                    <span className="font-medium">
                      ₹{totalRetailAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-green-600">
                        Your Earning
                      </span>
                      <span className="font-bold text-green-600 text-lg">
                        ₹{yourEarning.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  Book This Package
                </Button>

                {/* Contact Info */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <p className="text-xs text-center text-muted-foreground mb-3">
                    Need help? Contact support
                  </p>
                  <a
                    href="tel:+9779851045900"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    +977 9851045900
                  </a>
                  <a
                    href="mailto:agent-support@example.com"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    agent-support@example.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AgentBookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tripName={tripData.name}
        agentTripId={tripData._id}
        travelers={travelers}
        selectedDate={selectedDate?.date}
        selectedPrice={b2bPriceWithDate}
        totalAmount={totalB2BAmount}
      />
    </div>
  );
}