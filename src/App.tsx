import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          
          {/* Trip Category Pages */}
          <Route path="/group-trips" element={<GroupTrips />} />
          <Route path="/group-trips/upcoming" element={<GroupTrips />} />
          <Route path="/group-trips/fixed-departure" element={<GroupTrips />} />
          <Route path="/pilgrimage-trips" element={<PilgrimageTrips />} />
          <Route path="/weekend-trips" element={<WeekendTrips />} />
          <Route path="/international-trips" element={<InternationalTrips />} />
          <Route path="/domestic-trips" element={<DomesticTrips />} />
          <Route path="/retreats" element={<Retreats />} />
          <Route path="/retreats/meditation" element={<Retreats />} />
          <Route path="/retreats/spiritual" element={<Retreats />} />
          <Route path="/retreats/wellness" element={<Retreats />} />
          <Route path="/retreats/yoga" element={<Retreats />} />
          <Route path="/customised-trips" element={<CustomisedTrips />} />
          
          {/* Deals Pages */}
          <Route path="/deals/seasonal" element={<SeasonalDeals />} />
          <Route path="/deals/limited-time" element={<SeasonalDeals />} />
          
          {/* Travel Styles */}
          <Route path="/travel-styles/pilgrimage" element={<PilgrimageTrips />} />
          <Route path="/travel-styles/solo" element={<GroupTrips />} />
          <Route path="/travel-styles/group" element={<GroupTrips />} />
          <Route path="/travel-styles/weekend" element={<WeekendTrips />} />
          <Route path="/travel-styles/adventure" element={<GroupTrips />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
