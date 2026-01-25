import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail
} from "lucide-react";

import destBhutan from "@/assets/dest-bhutan.jpg";
import destSpiti from "@/assets/dest-spiti.jpg";
import destLadakh from "@/assets/dest-ladakh.jpg";
import destJapan from "@/assets/dest-japan.jpg";
import destThailand from "@/assets/dest-thailand.jpg";
import destVietnam from "@/assets/dest-vietnam.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import destBali from "@/assets/dest-bali.jpg";

const domesticTrips = [
  { name: "Meghalaya Tour Packages", href: "/trip/meghalaya-tour" },
  { name: "Spiti Tour Packages", href: "/trip/spiti-tour" },
  { name: "Himachal Tour Packages", href: "/trip/himachal-tour" },
  { name: "Tawang Tour Packages", href: "/trip/tawang-tour" },
  { name: "Uttarakhand Tour Packages", href: "/trip/uttarakhand-tour" },
  { name: "Kashmir Tour Packages", href: "/trip/kashmir-tour" },
  { name: "Ladakh Tour Packages", href: "/trip/ladakh-tour" },
  { name: "Rajasthan Tour Packages", href: "/trip/rajasthan-tour" },
  { name: "Kedarnath Tour Packages", href: "/trip/kedarnath-tour" },
  { name: "Kerala Tour Packages", href: "/trip/kerala-tour" },
  { name: "Andaman Tour Packages", href: "/trip/andaman-tour" },
];

const internationalTrips = [
  { name: "Northern Lights Tour Packages", href: "/trip/northern-lights-tour" },
  { name: "Georgia Tour Packages", href: "/trip/georgia-tour" },
  { name: "Vietnam Tour Packages", href: "/trip/vietnam-tour" },
  { name: "Bali Tour Packages", href: "/trip/bali-tour" },
  { name: "Europe Tour Packages", href: "/trip/europe-tour" },
  { name: "Almaty Tour Packages", href: "/trip/almaty-tour" },
  { name: "Thailand Tour Packages", href: "/trip/thailand-tour" },
  { name: "Dubai Tour Packages", href: "/trip/dubai-tour" },
  { name: "Cambodia Tour Packages", href: "/trip/cambodia-tour" },
  { name: "Bhutan Tour Packages", href: "/trip/bhutan-tour" },
  { name: "Japan Tour Packages", href: "/trip/japan-tour" },
  { name: "Sri Lanka Tour Packages", href: "/trip/srilanka-tour" },
  { name: "Nepal Tour Packages", href: "/trip/nepal-tour" },
  { name: "Maldives Tour Packages", href: "/trip/maldives-tour" },
  { name: "Singapore Tour Packages", href: "/trip/singapore-tour" },
  { name: "Mauritius Tour Packages", href: "/trip/mauritius-tour" },
  { name: "Malaysia Tour Packages", href: "/trip/malaysia-tour" },
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

const galleryImages = [
  destBhutan,
  destSpiti,
  destLadakh,
  destJapan,
  destThailand,
  destVietnam,
  destDubai,
  destGeorgia,
  destBali,
];

export function Footer() {
  return (
    <footer className="bg-cream-warm">
      {/* Gallery Section */}
      <div className="container-custom py-10 border-b border-border/30">
        <h3 className="font-display text-base font-bold text-foreground mb-6">Gallery</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trips Section - matching reference image styling */}
      <div className="container-custom py-10 border-b border-border/30">
        {/* Domestic Trips */}
        <div className="mb-8">
          <h3 className="font-display text-base font-bold text-foreground mb-4">Domestic Trips</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-2">
            {domesticTrips.map((trip) => (
              <Link
                key={trip.name}
                to={trip.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {trip.name}
              </Link>
            ))}
          </div>
        </div>

        {/* International Trips */}
        <div>
          <h3 className="font-display text-base font-bold text-foreground mb-4">International Trips</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-2">
            {internationalTrips.map((trip) => (
              <Link
                key={trip.name}
                to={trip.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {trip.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer - Three column layout matching reference */}
      <div className="container-custom py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-foreground">Address</h3>
            
            {/* Delhi Office */}
            <div>
              <p className="font-semibold text-sm mb-2">Padmasambhava Trip Pvt Ltd - Delhi</p>
              <p className="text-sm text-muted-foreground flex items-start gap-2 mb-1">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                1473-G NN-1/9619, Bramh Gali, West Rohtash Nagar, Shahdara, New Delhi -110032
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 shrink-0" />
                (+91) 8287636079
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm hover:bg-muted transition-colors">
                <MapPin className="w-4 h-4" />
                View on Map
              </button>
            </div>
            
            {/* Faridabad Office */}
            <div>
              <p className="font-semibold text-sm mb-2">Padmasambhava Trip Pvt Ltd - Faridabad</p>
              <p className="text-sm text-muted-foreground mb-3">
                Office No 304, 3rd floor, SRS Tower, Sector-31, Near Mewla Maharajpur Metro Station, Faridabad, Haryana 121003, India
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                Mobile: +91-8287636079 / 8076760552
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm hover:bg-muted transition-colors">
                <MapPin className="w-4 h-4" />
                View on Map
              </button>
            </div>

            {/* Gurgaon Office */}
            <div>
              <p className="font-semibold text-sm mb-2">Padmasambhava Trip Pvt Ltd - Gurgaon</p>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm hover:bg-muted transition-colors mb-2">
                <MapPin className="w-4 h-4" />
                View on Map
              </button>
              <p className="text-sm text-muted-foreground flex items-start gap-2 mb-1">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                Plot no-376, Udyog Vihar Phase 2, opposite Vi John WeWork, Gurgaon, Haryana 122016, India
              </p>
              <p className="text-sm text-muted-foreground">
                Mobile: +91-8368653222
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-bold text-foreground mb-4">Quick Links</h3>
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

          {/* Talk To Us & Social */}
          <div>
            <h3 className="font-display text-base font-bold text-foreground mb-4">Talk To Us</h3>
            <div className="space-y-2 mb-6">
              <a
                href="tel:+918287636079"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                (+91) 8287636079
              </a>
              <a
                href="mailto:info@padmasambhavatrip.com"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                info@padmasambhavatrip.com
              </a>
              <a
                href="https://wa.me/919310660016"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                (+91) 9310660016
              </a>
            </div>

            <h4 className="font-semibold text-sm mb-3">Follow us on</h4>
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <a href="https://wa.me/918287636079" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)"/>
                  <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
                  <circle cx="18" cy="6" r="1.5" fill="white"/>
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0" y1="24" x2="24" y2="0">
                      <stop stopColor="#F58529"/>
                      <stop offset="0.5" stopColor="#DD2A7B"/>
                      <stop offset="1" stopColor="#8134AF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2016 - 2026 Padmasambhava Trip Pvt Ltd. All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">We accept:</span>
            <div className="flex items-center gap-3">
              {/* VISA */}
              <svg className="h-6" viewBox="0 0 60 20" fill="none">
                <path d="M23.085 1.34L15.165 18.66H10.08L6.195 4.935C5.955 4.005 5.745 3.675 5.025 3.285C3.855 2.655 1.89 2.07 0.15 1.71L0.255 1.34H8.22C9.24 1.34 10.14 2.01 10.365 3.21L12.3 13.335L17.28 1.34H23.085ZM43.02 13.05C43.05 8.415 36.57 8.16 36.615 6.09C36.63 5.49 37.2 4.845 38.445 4.68C39.06 4.605 40.74 4.545 42.645 5.415L43.395 2.01C42.375 1.65 41.055 1.305 39.405 1.305C33.945 1.305 30.03 4.275 30 8.49C29.97 11.595 32.745 13.32 34.845 14.37C37.005 15.435 37.71 16.14 37.695 17.1C37.68 18.555 35.94 19.215 34.32 19.245C32.115 19.29 30.84 18.675 29.82 18.21L29.04 21.735C30.075 22.2 32.025 22.605 34.05 22.62C39.87 22.62 43.005 19.695 43.02 15.255V13.05ZM55.485 18.66H60L56.07 1.34H51.96C51.075 1.34 50.325 1.875 49.995 2.7L41.595 18.66H47.415L48.555 15.525H55.575L55.485 18.66ZM50.175 11.46L53.085 3.81L54.72 11.46H50.175ZM27.78 1.34L23.115 18.66H17.565L22.23 1.34H27.78Z" fill="#1A1F71"/>
              </svg>
              {/* MasterCard */}
              <svg className="h-6" viewBox="0 0 40 25" fill="none">
                <circle cx="14" cy="12.5" r="10" fill="#EB001B"/>
                <circle cx="26" cy="12.5" r="10" fill="#F79E1B"/>
                <path d="M20 5.5C22.5 7.5 24 10 24 12.5C24 15 22.5 17.5 20 19.5C17.5 17.5 16 15 16 12.5C16 10 17.5 7.5 20 5.5Z" fill="#FF5F00"/>
              </svg>
              {/* RuPay */}
              <span className="font-bold text-sm">
                <span className="text-blue-800">Ru</span>
                <span className="text-orange-500">Pay</span>
              </span>
              {/* UPI */}
              <svg className="h-5" viewBox="0 0 60 24" fill="none">
                <rect width="60" height="24" rx="4" fill="#5F259F"/>
                <text x="30" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">UPI</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
