// src/pages/TripListingPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Filter, ChevronDown, Clock, CalendarDays, Gift, Search } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

interface Trip {
  _id: string;
  name: string;
  destination: string;
  image: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  dates: Array<{ date: string; price: number }>;
  hasGoodies: boolean;
  tripCategory: string;
  tripType: string;
}

interface TripListingPageProps {
  title: string;
  tagline: string;
  subtitle: string;
  description: string;
  heroImage: string;
  filterDestinations?: string[];
  tripCategory?: string;
  tripType?: string;
}

const TripListingPage = ({
  title,
  tagline,
  subtitle,
  description,
  heroImage,
  filterDestinations = ["All"],
  tripCategory,
  tripType,
}: TripListingPageProps) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDestination, setActiveDestination] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>([]);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const tripTypes = ["Domestic", "International", "Pilgrimage", "Adventure", "Retreat"];
  const budgetRanges = [
    "Under ₹20,000",
    "₹20,000 - ₹40,000",
    "₹40,000 - ₹60,000",
    "₹60,000 - ₹80,000",
    "Above ₹80,000",
  ];

  useEffect(() => {
    fetchTrips();
  }, [tripCategory, tripType]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/trips?`;
      
      if (tripCategory) {
        url += `tripCategory=${tripCategory}&`;
      }
      if (tripType) {
        url += `tripType=${tripType}&`;
      }

      const response = await axios.get(url);
      
      if (response.data.status === 'success') {
        setTrips(response.data.data.trips);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTripsByBudget = (trip: Trip, budgetRange: string): boolean => {
    const price = trip.price;
    switch (budgetRange) {
      case "Under ₹20,000":
        return price < 20000;
      case "₹20,000 - ₹40,000":
        return price >= 20000 && price < 40000;
      case "₹40,000 - ₹60,000":
        return price >= 40000 && price < 60000;
      case "₹60,000 - ₹80,000":
        return price >= 60000 && price < 80000;
      case "Above ₹80,000":
        return price >= 80000;
      default:
        return true;
    }
  };

  const filterTripsByDate = (trip: Trip, selectedDate: string): boolean => {
    if (!selectedDate) return true;
    
    // Check if any of the trip dates match the selected date
    return trip.dates.some((dateObj) => {
      // Format trip date to match selected date format (YYYY-MM-DD)
      const tripDate = new Date(dateObj.date).toISOString().split('T')[0];
      return tripDate === selectedDate;
    });
  };

  const filteredTrips = trips.filter((trip) => {
    // Search filter
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

    // Destination filter
    const matchesDestination =
      activeDestination === "All" ||
      trip.destination.toLowerCase().includes(activeDestination.toLowerCase()) ||
      trip.name.toLowerCase().includes(activeDestination.toLowerCase());

    // Budget filter
    const matchesBudget =
      selectedBudgets.length === 0 ||
      selectedBudgets.some((budget) => filterTripsByBudget(trip, budget));

    // Date filter
    const matchesDate = filterTripsByDate(trip, selectedDate);

    return matchesSearch && matchesDestination && matchesBudget && matchesDate;
  });

  const handleTripTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTripTypes([...selectedTripTypes, type]);
    } else {
      setSelectedTripTypes(selectedTripTypes.filter(t => t !== type));
    }
  };

  const handleBudgetChange = (budget: string, checked: boolean) => {
    if (checked) {
      setSelectedBudgets([...selectedBudgets, budget]);
    } else {
      setSelectedBudgets(selectedBudgets.filter(b => b !== budget));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={heroImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-end justify-center pr-8 md:pr-16 text-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            {tagline}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 italic">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Title & Description */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            {description}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search trips by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Destination Filter Pills */}
        {filterDestinations.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {filterDestinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setActiveDestination(dest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeDestination === dest
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
              {/* Filters Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Filters</span>
              </div>

              {/* Check Dates */}
              <Collapsible open={isDateOpen} onOpenChange={setIsDateOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Check dates on calendar</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDateOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3">
                  <div className="space-y-3">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {selectedDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Showing trips on {new Date(selectedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        <button
                          onClick={() => setSelectedDate("")}
                          className="text-primary hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Budget */}
              <Collapsible open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isBudgetOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 space-y-3">
                  {budgetRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox 
                        id={range}
                        checked={selectedBudgets.includes(range)}
                        onCheckedChange={(checked) => handleBudgetChange(range, checked as boolean)}
                      />
                      <span className="text-sm text-muted-foreground">{range}</span>
                    </label>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </aside>

          {/* Trip Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Results count */}
                {selectedDate && (
                  <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary">
                      <strong>{filteredTrips.length}</strong> {filteredTrips.length === 1 ? 'trip' : 'trips'} available on {new Date(selectedDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTrips.map((trip) => (
                    <Link 
                      key={trip._id} 
                      to={`/trip/${trip._id}`}
                      className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                          <img 
                            src={trip.image} 
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {trip.hasGoodies && (
                            <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              Free Goodies
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          {/* Duration */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3 h-3" />
                            {trip.duration}
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {trip.name}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-foreground">
                              ₹{trip.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-destructive font-medium">
                              ₹{trip.discount.toLocaleString()} Off
                            </span>
                          </div>

                          {/* Dates */}
                          {trip.dates && trip.dates.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarDays className="w-3 h-3 text-primary" />
                              {trip.dates.slice(0, 2).map((d) => d.date).join(", ")}
                              {trip.dates.length > 2 && ` +${trip.dates.length - 2} more`}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredTrips.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {selectedDate 
                        ? `No trips found for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                        : "No trips found matching your criteria."
                      }
                    </p>
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate("")}
                        className="mt-4 text-primary hover:underline"
                      >
                        Clear date filter to see all trips
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TripListingPage;