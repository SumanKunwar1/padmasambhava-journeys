import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Filter, ChevronDown, Clock, CalendarDays, Gift } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

// Assets
import destBali from "@/assets/dest-bali.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import destThailand from "@/assets/dest-thailand.jpg";
import destVietnam from "@/assets/dest-vietnam.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destJapan from "@/assets/dest-japan.jpg";
import destBhutan from "@/assets/dest-bhutan.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";

interface Trip {
  id: string;
  name: string;
  destination: string;
  image: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  dates: string[];
  hasGoodies: boolean;
  category: string[];
}

interface TripListingPageProps {
  title: string;
  tagline: string;
  subtitle: string;
  description: string;
  heroImage: string;
  filterDestinations?: string[];
  trips?: Trip[];
}

// All available trips database
const allTripsDatabase: Trip[] = [
  {
    id: "georgia-winter",
    name: "Georgia Winter Trip",
    destination: "Georgia",
    image: destGeorgia,
    duration: "7 days / 6 nights",
    price: 52999,
    originalPrice: 62999,
    discount: 10000,
    dates: ["Jan 23", "Feb 21", "Mar 4"],
    hasGoodies: true,
    category: ["international", "group", "winter"],
  },
  {
    id: "thailand-full-moon",
    name: "Full Moon Party Thailand Package",
    destination: "Thailand",
    image: destThailand,
    duration: "7 days / 6 nights",
    price: 46999,
    originalPrice: 51999,
    discount: 5000,
    dates: ["Jan 31", "Mar 1", "Mar 31"],
    hasGoodies: false,
    category: ["international", "group", "party"],
  },
  {
    id: "vietnam-8days",
    name: "Vietnam 8 Days Tour Package",
    destination: "Vietnam",
    image: destVietnam,
    duration: "8 days / 7 nights",
    price: 49999,
    originalPrice: 54999,
    discount: 5000,
    dates: ["Feb 10", "Mar 15", "Apr 5"],
    hasGoodies: true,
    category: ["international", "group"],
  },
  {
    id: "bali-adventure",
    name: "Bali Adventure & Culture Trip",
    destination: "Bali",
    image: destBali,
    duration: "6 days / 5 nights",
    price: 45999,
    originalPrice: 52999,
    discount: 7000,
    dates: ["Feb 5", "Mar 10", "Apr 1"],
    hasGoodies: true,
    category: ["international", "group", "adventure"],
  },
  {
    id: "dubai-luxury",
    name: "Dubai Luxury Experience",
    destination: "Dubai",
    image: destDubai,
    duration: "5 days / 4 nights",
    price: 55999,
    originalPrice: 65999,
    discount: 10000,
    dates: ["Jan 28", "Feb 15", "Mar 20"],
    hasGoodies: false,
    category: ["international", "group", "luxury"],
  },
  {
    id: "japan-cherry-blossom",
    name: "Japan Cherry Blossom Tour",
    destination: "Japan",
    image: destJapan,
    duration: "10 days / 9 nights",
    price: 125999,
    originalPrice: 145999,
    discount: 20000,
    dates: ["Mar 25", "Apr 5", "Apr 15"],
    hasGoodies: true,
    category: ["international", "group", "seasonal"],
  },
  {
    id: "bhutan-pilgrimage",
    name: "Bhutan Spiritual Pilgrimage",
    destination: "Bhutan",
    image: destBhutan,
    duration: "7 days / 6 nights",
    price: 75999,
    originalPrice: 85999,
    discount: 10000,
    dates: ["Feb 1", "Mar 8", "Apr 12"],
    hasGoodies: true,
    category: ["international", "pilgrimage", "spiritual"],
  },
  {
    id: "spiti-valley",
    name: "Spiti Valley Winter Expedition",
    destination: "Spiti Valley",
    image: destSpiti,
    duration: "8 days / 7 nights",
    price: 22999,
    originalPrice: 27999,
    discount: 5000,
    dates: ["Jan 20", "Feb 15", "Mar 10"],
    hasGoodies: true,
    category: ["domestic", "group", "adventure", "weekend"],
  },
  {
    id: "ladakh-adventure",
    name: "Ladakh Adventure Trip",
    destination: "Ladakh",
    image: destLadakh,
    duration: "7 days / 6 nights",
    price: 28999,
    originalPrice: 34999,
    discount: 6000,
    dates: ["Jun 5", "Jul 10", "Aug 15"],
    hasGoodies: true,
    category: ["domestic", "group", "adventure"],
  },
];

// Category-specific trip sets
const pilgrimageTrips: Trip[] = [
  {
    id: "bhutan-pilgrimage",
    name: "Bhutan Spiritual Pilgrimage",
    destination: "Bhutan",
    image: destBhutan,
    duration: "7 days / 6 nights",
    price: 75999,
    originalPrice: 85999,
    discount: 10000,
    dates: ["Feb 1", "Mar 8", "Apr 12"],
    hasGoodies: true,
    category: ["pilgrimage", "spiritual"],
  },
  {
    id: "varanasi-kashi",
    name: "Varanasi Kashi Darshan",
    destination: "Varanasi",
    image: destGeorgia,
    duration: "4 days / 3 nights",
    price: 15999,
    originalPrice: 19999,
    discount: 4000,
    dates: ["Every Weekend"],
    hasGoodies: false,
    category: ["pilgrimage", "domestic"],
  },
  {
    id: "char-dham-yatra",
    name: "Char Dham Yatra Package",
    destination: "Char Dham",
    image: destSpiti,
    duration: "12 days / 11 nights",
    price: 45999,
    originalPrice: 55999,
    discount: 10000,
    dates: ["May 1", "Jun 15", "Sep 5"],
    hasGoodies: true,
    category: ["pilgrimage", "domestic"],
  },
  {
    id: "tibet-kailash",
    name: "Kailash Mansarovar Yatra",
    destination: "Tibet",
    image: destLadakh,
    duration: "15 days / 14 nights",
    price: 185999,
    originalPrice: 210000,
    discount: 24001,
    dates: ["Jun 1", "Jul 10"],
    hasGoodies: true,
    category: ["pilgrimage", "international"],
  },
];

const weekendTrips: Trip[] = [
  {
    id: "mcleodganj-weekend",
    name: "Mcleodganj Weekend Escape",
    destination: "Mcleodganj",
    image: destSpiti,
    duration: "3 days / 2 nights",
    price: 8999,
    originalPrice: 11999,
    discount: 3000,
    dates: ["Every Fri-Sun"],
    hasGoodies: false,
    category: ["weekend", "domestic"],
  },
  {
    id: "kasol-kheerganga",
    name: "Kasol & Kheerganga Trek",
    destination: "Kasol",
    image: destLadakh,
    duration: "3 days / 2 nights",
    price: 6999,
    originalPrice: 8999,
    discount: 2000,
    dates: ["Every Fri-Sun"],
    hasGoodies: true,
    category: ["weekend", "adventure"],
  },
  {
    id: "rishikesh-rafting",
    name: "Rishikesh Rafting Adventure",
    destination: "Rishikesh",
    image: destBali,
    duration: "2 days / 1 night",
    price: 4999,
    originalPrice: 6499,
    discount: 1500,
    dates: ["Every Weekend"],
    hasGoodies: false,
    category: ["weekend", "adventure"],
  },
  {
    id: "nainital-relaxation",
    name: "Nainital Lake Getaway",
    destination: "Nainital",
    image: destVietnam,
    duration: "3 days / 2 nights",
    price: 9999,
    originalPrice: 12999,
    discount: 3000,
    dates: ["Every Sat-Mon"],
    hasGoodies: false,
    category: ["weekend", "domestic"],
  },
];

const retreatTrips: Trip[] = [
  {
    id: "rishikesh-yoga",
    name: "Rishikesh Yoga Retreat",
    destination: "Rishikesh",
    image: destBali,
    duration: "7 days / 6 nights",
    price: 32999,
    originalPrice: 39999,
    discount: 7000,
    dates: ["Jan 15", "Feb 20", "Mar 25"],
    hasGoodies: true,
    category: ["retreat", "yoga"],
  },
  {
    id: "bali-wellness",
    name: "Bali Wellness Retreat",
    destination: "Bali",
    image: destBali,
    duration: "8 days / 7 nights",
    price: 65999,
    originalPrice: 79999,
    discount: 14000,
    dates: ["Feb 1", "Mar 15", "Apr 20"],
    hasGoodies: true,
    category: ["retreat", "wellness", "international"],
  },
  {
    id: "dharamsala-meditation",
    name: "Dharamsala Meditation Retreat",
    destination: "Dharamsala",
    image: destBhutan,
    duration: "5 days / 4 nights",
    price: 22999,
    originalPrice: 28999,
    discount: 6000,
    dates: ["Every Month"],
    hasGoodies: false,
    category: ["retreat", "meditation"],
  },
  {
    id: "kerala-ayurveda",
    name: "Kerala Ayurveda Experience",
    destination: "Kerala",
    image: destThailand,
    duration: "10 days / 9 nights",
    price: 55999,
    originalPrice: 69999,
    discount: 14000,
    dates: ["Jan 10", "Feb 25", "Mar 30"],
    hasGoodies: true,
    category: ["retreat", "wellness"],
  },
];

const domesticTrips: Trip[] = [
  {
    id: "spiti-valley",
    name: "Spiti Valley Winter Expedition",
    destination: "Spiti Valley",
    image: destSpiti,
    duration: "8 days / 7 nights",
    price: 22999,
    originalPrice: 27999,
    discount: 5000,
    dates: ["Jan 20", "Feb 15", "Mar 10"],
    hasGoodies: true,
    category: ["domestic", "adventure"],
  },
  {
    id: "ladakh-adventure",
    name: "Ladakh Adventure Trip",
    destination: "Ladakh",
    image: destLadakh,
    duration: "7 days / 6 nights",
    price: 28999,
    originalPrice: 34999,
    discount: 6000,
    dates: ["Jun 5", "Jul 10", "Aug 15"],
    hasGoodies: true,
    category: ["domestic", "adventure"],
  },
  {
    id: "kashmir-paradise",
    name: "Kashmir Paradise Tour",
    destination: "Kashmir",
    image: destGeorgia,
    duration: "6 days / 5 nights",
    price: 24999,
    originalPrice: 29999,
    discount: 5000,
    dates: ["Apr 1", "May 10", "Sep 15"],
    hasGoodies: false,
    category: ["domestic", "group"],
  },
  {
    id: "rajasthan-heritage",
    name: "Rajasthan Heritage Tour",
    destination: "Rajasthan",
    image: destDubai,
    duration: "8 days / 7 nights",
    price: 35999,
    originalPrice: 42999,
    discount: 7000,
    dates: ["Oct 5", "Nov 15", "Dec 20"],
    hasGoodies: true,
    category: ["domestic", "heritage"],
  },
];

const internationalTrips: Trip[] = [
  {
    id: "georgia-winter",
    name: "Georgia Winter Trip",
    destination: "Georgia",
    image: destGeorgia,
    duration: "7 days / 6 nights",
    price: 52999,
    originalPrice: 62999,
    discount: 10000,
    dates: ["Jan 23", "Feb 21", "Mar 4"],
    hasGoodies: true,
    category: ["international", "group"],
  },
  {
    id: "thailand-full-moon",
    name: "Full Moon Party Thailand Package",
    destination: "Thailand",
    image: destThailand,
    duration: "7 days / 6 nights",
    price: 46999,
    originalPrice: 51999,
    discount: 5000,
    dates: ["Jan 31", "Mar 1", "Mar 31"],
    hasGoodies: false,
    category: ["international", "party"],
  },
  {
    id: "vietnam-8days",
    name: "Vietnam 8 Days Tour Package",
    destination: "Vietnam",
    image: destVietnam,
    duration: "8 days / 7 nights",
    price: 49999,
    originalPrice: 54999,
    discount: 5000,
    dates: ["Feb 10", "Mar 15", "Apr 5"],
    hasGoodies: true,
    category: ["international", "group"],
  },
  {
    id: "bali-adventure",
    name: "Bali Adventure & Culture Trip",
    destination: "Bali",
    image: destBali,
    duration: "6 days / 5 nights",
    price: 45999,
    originalPrice: 52999,
    discount: 7000,
    dates: ["Feb 5", "Mar 10", "Apr 1"],
    hasGoodies: true,
    category: ["international", "adventure"],
  },
  {
    id: "dubai-luxury",
    name: "Dubai Luxury Experience",
    destination: "Dubai",
    image: destDubai,
    duration: "5 days / 4 nights",
    price: 55999,
    originalPrice: 65999,
    discount: 10000,
    dates: ["Jan 28", "Feb 15", "Mar 20"],
    hasGoodies: false,
    category: ["international", "luxury"],
  },
  {
    id: "japan-cherry-blossom",
    name: "Japan Cherry Blossom Tour",
    destination: "Japan",
    image: destJapan,
    duration: "10 days / 9 nights",
    price: 125999,
    originalPrice: 145999,
    discount: 20000,
    dates: ["Mar 25", "Apr 5", "Apr 15"],
    hasGoodies: true,
    category: ["international", "seasonal"],
  },
];

const defaultDestinations = [
  "All", "Philippines", "Japan", "Russia", "Vietnam", "Bali", "Thailand", 
  "Dubai", "Georgia", "Almaty", "Sri Lanka", "Northern Lights", "Bhutan", "Azerbaijan"
];

const tripTypes = [
  "Group Trips",
  "Solo Trips",
  "Pilgrimage Trips",
  "Adventure Trips",
  "Weekend Trips",
  "Luxury Trips",
];

const budgetRanges = [
  "Under ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹75,000",
  "₹75,000 - ₹1,00,000",
  "Above ₹1,00,000",
];

// Export category-specific trips for page usage
export { pilgrimageTrips, weekendTrips, retreatTrips, domesticTrips, internationalTrips, allTripsDatabase };

const TripListingPage = ({ 
  title, 
  tagline, 
  subtitle, 
  description, 
  heroImage,
  filterDestinations = defaultDestinations,
  trips = allTripsDatabase
}: TripListingPageProps) => {
  const [activeDestination, setActiveDestination] = useState("All");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(true);
  const [isBudgetOpen, setIsBudgetOpen] = useState(true);
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>([]);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);

  // Filter logic
  const filteredTrips = trips.filter(trip => {
    // Destination filter
    const matchesDestination = activeDestination === "All" || trip.destination === activeDestination;
    
    // Trip type filter
    const tripTypeMap: Record<string, string> = {
      "Group Trips": "group",
      "Solo Trips": "solo",
      "Pilgrimage Trips": "pilgrimage",
      "Adventure Trips": "adventure",
      "Weekend Trips": "weekend",
      "Luxury Trips": "luxury",
    };
    const matchesTripType = selectedTripTypes.length === 0 || 
      selectedTripTypes.some(type => trip.category.includes(tripTypeMap[type] || type.toLowerCase()));
    
    // Budget filter
    const matchesBudget = selectedBudgets.length === 0 || selectedBudgets.some(budget => {
      const price = trip.price;
      switch (budget) {
        case "Under ₹25,000": return price < 25000;
        case "₹25,000 - ₹50,000": return price >= 25000 && price <= 50000;
        case "₹50,000 - ₹75,000": return price >= 50000 && price <= 75000;
        case "₹75,000 - ₹1,00,000": return price >= 75000 && price <= 100000;
        case "Above ₹1,00,000": return price > 100000;
        default: return true;
      }
    });
    
    return matchesDestination && matchesTripType && matchesBudget;
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
            <button className="text-primary hover:underline ml-2 font-medium">
              Read More
            </button>
          </p>
        </div>

        {/* Destination Filter Pills */}
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
                  <p className="text-sm text-muted-foreground">Calendar picker coming soon</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Trip Type */}
              <Collapsible open={isTripTypeOpen} onOpenChange={setIsTripTypeOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✈️</span>
                    <span className="text-sm font-medium">Trip Type</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isTripTypeOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 space-y-3">
                  {tripTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox 
                        id={type} 
                        checked={selectedTripTypes.includes(type)}
                        onCheckedChange={(checked) => handleTripTypeChange(type, checked as boolean)}
                      />
                      <span className="text-sm text-muted-foreground">{type}</span>
                    </label>
                  ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTrips.map((trip) => (
                <Link 
                  key={trip.id} 
                  to={`/trip/${trip.id}`}
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3 text-primary" />
                        {trip.dates.join(", ")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredTrips.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No trips found for this destination.</p>
              </div>
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
