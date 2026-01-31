// src/components/layout/Navbar.tsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Phone, 
  Menu, 
  X, 
  Users, 
  Tag, 
  MapPin, 
  Sparkles, 
  Globe,
  Info,
  Luggage,
  Search,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  highlighted?: boolean;
  children?: { label: string; href: string }[];
}

// All searchable trips data
const allTrips = [
  { name: "Ladakh Adventure", destination: "Ladakh", category: "Adventure", href: "/trip/ladakh-adventure" },
  { name: "Spiti Valley Expedition", destination: "Spiti", category: "Adventure", href: "/trip/spiti-valley" },
  { name: "Bali Beach Retreat", destination: "Bali", category: "International", href: "/trip/bali-retreat" },
  { name: "Dubai Luxury Tour", destination: "Dubai", category: "International", href: "/trip/dubai-tour" },
  { name: "Thailand Explorer", destination: "Thailand", category: "International", href: "/trip/thailand-explorer" },
  { name: "Vietnam Discovery", destination: "Vietnam", category: "International", href: "/trip/vietnam-discovery" },
  { name: "Japan Cultural Tour", destination: "Japan", category: "International", href: "/trip/japan-tour" },
  { name: "Bhutan Spiritual Journey", destination: "Bhutan", category: "Pilgrimage", href: "/trip/bhutan-spiritual" },
  { name: "Georgia Adventure", destination: "Georgia", category: "International", href: "/trip/georgia-adventure" },
  { name: "Char Dham Yatra", destination: "Uttarakhand", category: "Pilgrimage", href: "/trip/char-dham" },
  { name: "Vaishno Devi Pilgrimage", destination: "Jammu", category: "Pilgrimage", href: "/trip/vaishno-devi" },
  { name: "Rishikesh Yoga Retreat", destination: "Rishikesh", category: "Retreats", href: "/trip/rishikesh-yoga" },
  { name: "Kerala Wellness Escape", destination: "Kerala", category: "Retreats", href: "/trip/kerala-wellness" },
  { name: "Goa Weekend Getaway", destination: "Goa", category: "Weekend", href: "/trip/goa-weekend" },
  { name: "Manali Snow Trip", destination: "Manali", category: "Weekend", href: "/trip/manali-snow" },
  { name: "Rajasthan Heritage Tour", destination: "Rajasthan", category: "Domestic", href: "/trip/rajasthan-heritage" },
  { name: "Kashmir Paradise", destination: "Kashmir", category: "Domestic", href: "/trip/kashmir-paradise" },
  { name: "Andaman Island Hopping", destination: "Andaman", category: "Domestic", href: "/trip/andaman-islands" },
];

const navItems: NavItem[] = [

  {
    label: "EMI Trips",
     href: "/trips/emi",
    icon: <Users className="w-4 h-4 text-primary" />,
    
  },
  {
    label: "International Trips",
     href: "/international-trips",
    icon: <Plane className="w-4 h-4 text-sky-500" />,
    
  },
  {
    label: "India Trips",
     href: "/domestic-trips",
    icon: <span className="text-base">🇮🇳</span>,
    
  },


  {
    label: "Deals",
    icon: <Tag className="w-4 h-4 text-amber-500" />,
    children: [
      { label: "Seasonal Deals", href: "/deals/seasonal" },
      { label: "Limited Time Offers", href: "/deals/limited" },
    ],
  },
  
  {
    label: "Travel Styles",
    icon: <MapPin className="w-4 h-4 text-rose-500" />,
    children: [
      { label: "Pilgrimage Trips", href: "/trips/pilgrimage" },
      { label: "Solo Trips", href: "/style/solo" },
      { label: "Group Trips", href: "/trips/group" },
      { label: "Weekend Trips", href: "/trips/weekend" },
      { label: "Adventure Trips", href: "/style/adventure" },
      {label: "Cruise Trips", href: "/trips/cruise" },
      { label: "Customised Trips", href: "/custom" },
    ],
  },
  {
    label: "Combo Trips",
    href: "/trips/combo",
    icon: <Luggage className="w-4 h-4 text-sky-500" />,
  },
  {
    label: "Retreats & Healings",
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    children: [
      { label: "Retreats", href: "/retreats/meditation" },
      { label: "Healings", href: "/retreats/wellness" },
    ], 
  },
  
  
  {
    label: "Services",
    icon: <Info className="w-4 h-4 text-purple-500" />,
    children: [
      { label: "Visa Application", href: "/visa-application" },
      { label: "Documentation Portal", href: "/documentation" },
      { label: "Travel Insurance", href: "/insurance" },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter trips based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allTrips.filter(
      (trip) =>
        trip.name.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        trip.category.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSearchSelect = (href: string) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigate(href);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md navbar-shadow" 
          : "bg-background"
      )}
    >
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
        <span className="font-medium">Ladakh Spiti Early Bird – Save up to ₹3,000 🎉</span>
      </div>

      <nav className="container-custom">
        {/* Top row: Logo + Search + Phone + CTA */}
        <div className="flex items-center justify-between h-24 border-b border-border">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dihev9qxc/image/upload/v1768991877/453207561_122102729312441160_4787222294410407220_n-removebg-preview_voy795.png" 
              alt="Padmasambhava Trip" 
              className="h-28 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your trip..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4 h-10 rounded-full border-border focus:border-primary"
              />
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {searchResults.map((trip) => (
                      <button
                        key={trip.href}
                        onClick={() => handleSearchSelect(trip.href)}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{trip.name}</p>
                            <p className="text-xs text-muted-foreground">{trip.destination}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {trip.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel: +917363933945"
              className="hidden sm:flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">(+91) 73639 33945 </span>
            </a>

            {/* Auth Buttons */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/dashboard" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Bottom row: Navigation items */}
        <div className="hidden lg:flex items-center justify-center h-12 gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.highlighted
                      ? "text-primary font-semibold"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "text-foreground hover:text-primary"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-3 text-sm text-popover-foreground hover:bg-muted transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <Link
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                          item.highlighted
                            ? "text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-4 py-2 text-muted-foreground text-sm font-medium">
                          {item.icon}
                          {item.label}
                        </div>
                        {item.children?.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block pl-11 pr-4 py-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Auth Section */}
                <div className="pt-4 px-4 space-y-3 border-t border-border">
                  {!user ? (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <LogIn className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                  <a
                    href="tel: +917363933945"
                    className="flex items-center gap-2 text-sm text-foreground px-4 py-3"
                  >
                    <Phone className="w-4 h-4" />
                    <span>(+91)73639 33945</span>
                  </a>
                  <Link to="/contact" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Plan Your Trip</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}