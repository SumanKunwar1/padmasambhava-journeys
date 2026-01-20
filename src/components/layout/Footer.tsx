import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle 
} from "lucide-react";

const domesticTrips = [
  "Meghalaya Tour Packages",
  "Spiti Tour Packages",
  "Himachal Tour Packages",
  "Kashmir Tour Packages",
  "Ladakh Tour Packages",
  "Tawang Tour Packages",
  "Kedarnath Tour Packages",
  "Kerala Tour Packages",
  "Uttarakhand Tour Packages",
  "Rajasthan Tour Packages",
];

const internationalTrips = [
  "Bhutan Tour Packages",
  "Nepal Tour Packages",
  "Georgia Tour Packages",
  "Vietnam Tour Packages",
  "Bali Tour Packages",
  "Thailand Tour Packages",
  "Dubai Tour Packages",
  "Japan Tour Packages",
  "Sri Lanka Tour Packages",
  "Northern Lights Packages",
];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cancellation Policy", href: "/cancellation" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Wellness Retreats", href: "/retreats/wellness" },
  { label: "Corporate Tours", href: "/corporate" },
];

export function Footer() {
  return (
    <footer className="bg-cream-warm">
      {/* Trips Section */}
      <div className="container-custom py-12 border-b border-border/50">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Domestic Trips */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Domestic Trips</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {domesticTrips.map((trip) => (
                <Link
                  key={trip}
                  to={`/trip/${trip.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {trip}
                </Link>
              ))}
            </div>
          </div>

          {/* International Trips */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">International Trips</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {internationalTrips.map((trip) => (
                <Link
                  key={trip}
                  to={`/trip/${trip.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {trip}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Address */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Address</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm">Padmasambhava Trip Pvt Ltd - Delhi</p>
                <p className="text-sm text-muted-foreground mt-1 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  A-123, Example Street, New Delhi - 110001
                </p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  (+91) 9876543210
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">Padmasambhava Trip Pvt Ltd - Gurgaon</p>
                <p className="text-sm text-muted-foreground mt-1 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  Plot No. 123, Sector 45, Gurgaon, Haryana - 122001
                </p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  (+91) 9876543211
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Talk To Us */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Talk To Us</h3>
            <div className="space-y-3">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                (+91) 9876543210
              </a>
              <a
                href="mailto:info@padmasambhavatrip.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@padmasambhavatrip.com
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                (+91) 9876543210
              </a>
            </div>

            <h4 className="font-medium mt-6 mb-3">Follow us on</h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Logo & Description */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold text-primary">Padmasambhava</span>
              <span className="text-2xl font-display font-light text-foreground"> Trip</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted companion for spiritual journeys, pilgrimage tours, and life-changing travel experiences. Discover sacred destinations with expert guidance and seamless planning.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2016 - 2026 Padmasambhava Trip Pvt Ltd. All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">We accept:</span>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-background rounded text-xs font-semibold">VISA</div>
              <div className="px-2 py-1 bg-background rounded text-xs font-semibold">MasterCard</div>
              <div className="px-2 py-1 bg-background rounded text-xs font-semibold">RuPay</div>
              <div className="px-2 py-1 bg-background rounded text-xs font-semibold">UPI</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
