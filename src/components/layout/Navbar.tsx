import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Mail, 
  Menu, 
  X, 
  Users, 
  Tag, 
  MapPin, 
  Calendar, 
  Car, 
  Compass, 
  Sparkles, 
  Globe,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    icon: <Users className="w-4 h-4" />,
    children: [
      { label: "Upcoming Group Trips", href: "/trips/upcoming" },
      { label: "Fixed Departure Trips", href: "/trips/fixed-departure" },
    ],
  },
  {
    label: "Deals",
    icon: <Tag className="w-4 h-4" />,
    children: [
      { label: "Seasonal Deals", href: "/deals/seasonal" },
      { label: "Limited Time Offers", href: "/deals/limited" },
    ],
  },
  {
    label: "Travel Styles",
    icon: <MapPin className="w-4 h-4" />,
    children: [
      { label: "Pilgrimage Trips", href: "/style/pilgrimage" },
      { label: "Solo Trips", href: "/style/solo" },
      { label: "Group Trips", href: "/style/group" },
      { label: "Weekend Trips", href: "/style/weekend" },
      { label: "Adventure Trips", href: "/style/adventure" },
    ],
  },
  {
    label: "Upcoming Group Trips",
    href: "/trips/upcoming",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    label: "Weekend Trips",
    href: "/trips/weekend",
    icon: <Car className="w-4 h-4" />,
  },
  {
    label: "Pilgrimage Trips",
    href: "/trips/pilgrimage",
    icon: <Compass className="w-4 h-4" />,
    highlighted: true,
  },
  {
    label: "Retreats",
    icon: <Sparkles className="w-4 h-4" />,
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
    icon: <Globe className="w-4 h-4" />,
  },
  {
    label: "More About Us",
    icon: <Info className="w-4 h-4" />,
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
        <span className="font-medium">Ladakh Early Bird Sale – Save up to ₹3,000 🎉</span>
      </div>

      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl lg:text-2xl font-display font-bold text-primary">
              Padmasambhava
            </span>
            <span className="text-xl lg:text-2xl font-display font-light text-foreground">
              Trip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1">
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
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    <span className="hidden 2xl:inline">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "text-foreground hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    <span className="hidden 2xl:inline">{item.label}</span>
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

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:info@padmasambhavatrip.com"
              className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden xl:inline">info@padmasambhavatrip.com</span>
            </a>
            <Button className="hidden sm:inline-flex">
              Plan Your Trip
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-border overflow-hidden"
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
                            ? "bg-primary text-primary-foreground"
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
                <div className="pt-4 px-4">
                  <Button className="w-full">Plan Your Trip</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
