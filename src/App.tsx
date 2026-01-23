import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import Index from "./pages/Index";
import TripDetail from "./pages/TripDetail";
import GroupTrips from "./pages/GroupTrips";
import PilgrimageTrips from "./pages/PilgrimageTrips";
import WeekendTrips from "./pages/WeekendTrips";
import InternationalTrips from "./pages/InternationalTrips";
import DomesticTrips from "./pages/DomesticTrips";
import Retreats from "./pages/Retreats";
import SeasonalDeals from "./pages/SeasonalDeals";
import CustomisedTrips from "./pages/CustomisedTrips";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          
          {/* Trip Category Pages */}
          <Route path="/group-trips" element={<GroupTrips />} />
          <Route path="/trips/upcoming" element={<GroupTrips />} />
          <Route path="/trips/fixed-departure" element={<GroupTrips />} />
          <Route path="/trips/group" element={<GroupTrips />} />
          <Route path="/trips/pilgrimage" element={<PilgrimageTrips />} />
          <Route path="/trips/weekend" element={<WeekendTrips />} />
          <Route path="/pilgrimage-trips" element={<PilgrimageTrips />} />
          <Route path="/weekend-trips" element={<WeekendTrips />} />
          <Route path="/international-trips" element={<InternationalTrips />} />
          <Route path="/domestic-trips" element={<DomesticTrips />} />
          
          {/* Destination Routes */}
          <Route path="/destination/:slug" element={<TripDetail />} />
          
          {/* Retreats */}
          <Route path="/retreats" element={<Retreats />} />
          <Route path="/retreats/meditation" element={<Retreats />} />
          <Route path="/retreats/spiritual" element={<Retreats />} />
          <Route path="/retreats/wellness" element={<Retreats />} />
          <Route path="/retreats/yoga" element={<Retreats />} />
          
          {/* Customised Trips */}
          <Route path="/custom" element={<CustomisedTrips />} />
          <Route path="/customised-trips" element={<CustomisedTrips />} />
          
          {/* Deals Pages */}
          <Route path="/deals/seasonal" element={<SeasonalDeals />} />
          <Route path="/deals/limited" element={<SeasonalDeals />} />
          <Route path="/deals/limited-time" element={<SeasonalDeals />} />
          
          {/* Travel Styles */}
          <Route path="/travel-styles/pilgrimage" element={<PilgrimageTrips />} />
          <Route path="/style/solo" element={<GroupTrips />} />
          <Route path="/travel-styles/solo" element={<GroupTrips />} />
          <Route path="/travel-styles/group" element={<GroupTrips />} />
          <Route path="/travel-styles/weekend" element={<WeekendTrips />} />
          <Route path="/style/adventure" element={<GroupTrips />} />
          <Route path="/travel-styles/adventure" element={<GroupTrips />} />
          
          {/* Contact & More */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<Contact />} />
          <Route path="/faqs" element={<Contact />} />
          <Route path="/blogs" element={<Contact />} />
          <Route path="/privacy" element={<Contact />} />
          <Route path="/cancellation" element={<Contact />} />
          <Route path="/terms" element={<Contact />} />
          <Route path="/corporate" element={<Contact />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
