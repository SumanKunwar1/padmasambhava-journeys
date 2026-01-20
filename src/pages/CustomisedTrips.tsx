import { useState } from "react";
import { MapPin, Calendar, Users, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import destBali from "@/assets/dest-bali.jpg";

const features = [
  "Personalized itinerary based on your preferences",
  "Flexible travel dates and duration",
  "Choice of accommodation and transport",
  "Private guides and exclusive experiences",
  "24/7 dedicated trip support",
  "Best price guarantee",
];

const CustomisedTrips = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelers: "",
    dates: "",
    budget: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img 
          src={destBali} 
          alt="Customised Trips"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            Create Your Dream Trip
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
            Tell us your travel dreams, and we'll craft a personalized journey just for you
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Features */}
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Why Choose Customised Trips?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every traveler is unique, and so should be their journey. Our customised trips 
              are designed around your preferences, interests, and travel style. Whether you 
              want a romantic getaway, a family adventure, or a solo expedition, we'll create 
              the perfect itinerary for you.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 p-6 bg-muted/50 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Custom Trips</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-card rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-display font-bold text-foreground mb-6">
              Plan Your Trip
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Your Name
                  </label>
                  <Input 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Email
                  </label>
                  <Input 
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Phone Number
                  </label>
                  <Input 
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Destination
                  </label>
                  <Input 
                    placeholder="Where do you want to go?"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <Users className="w-4 h-4 inline mr-1" />
                    Number of Travelers
                  </label>
                  <Input 
                    placeholder="2 Adults, 1 Child"
                    value={formData.travelers}
                    onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Travel Dates
                  </label>
                  <Input 
                    placeholder="March 2024"
                    value={formData.dates}
                    onChange={(e) => setFormData({...formData, dates: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Budget (per person)
                </label>
                <Input 
                  placeholder="₹50,000 - ₹75,000"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Tell us about your dream trip
                </label>
                <Textarea 
                  placeholder="Share your preferences, interests, must-visit places, special requirements..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Submit Enquiry
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Our travel expert will get back to you within 24 hours
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CustomisedTrips;
