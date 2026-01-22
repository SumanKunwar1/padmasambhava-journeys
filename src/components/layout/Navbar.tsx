import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  highlighted?: boolean;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Group Trips",
    icon: <Users className="w-4 h-4 text-primary" />,
    children: [
      { label: "Upcoming Group Trips", href: "/trips/upcoming" },
      { label: "Fixed Departure Trips", href: "/trips/fixed-departure" },
    ],
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
    ],
  },
  {
    label: "Upcoming Group Trips",
    href: "/trips/upcoming",
    icon: <Luggage className="w-4 h-4 text-sky-500" />,
  },
  {
    label: "Retreats",
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    children: [
      { label: "Meditation Retreats", href: "/retreats/meditation" },
      { label: "Spiritual Retreats", href: "/retreats/spiritual" },
      { label: "Wellness Retreats", href: "/retreats/wellness" },
      { label: "Yoga Retreats", href: "/retreats/yoga" },
    ],
  },
  {
    label: "Customised Trips",
    href: "/custom",
    icon: <Globe className="w-4 h-4 text-teal-500" />,
  },
  {
    label: "More about us",
    icon: <Info className="w-4 h-4 text-slate-500" />,
    children: [
      { label: "About Us", href: "/about" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blogs", href: "/blogs" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="flex items-center justify-between h-16 border-b border-border">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dihev9qxc/image/upload/v1768991877/453207561_122102729312441160_4787222294410407220_n-removebg-preview_voy795.png" 
              alt="Padmasambhava Trip" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your trip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border-border bg-muted/50 focus:bg-background"
              />
            </div>
          </div>

          {/* Right side: Phone + CTA */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+918287636079"
              className="hidden sm:flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">(+91) 8287636079</span>
            </a>
            <Link to="/contact">
              <Button className="hidden sm:inline-flex rounded-full px-6" size="sm">
                Plan Your Trip
              </Button>
            </Link>

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
                <div className="pt-4 px-4 space-y-3">
                  <a
                    href="tel:+918287636079"
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Phone className="w-4 h-4" />
                    <span>(+91) 8287636079</span>
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
