// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";

// Pages
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
import AboutUs from "./pages/AboutUs";
import Blogs from "./pages/Blogs";
import NotFound from "./pages/NotFound";
import CruiseTrips from "./pages/CruiseTrips";
import EMITrips from "./pages/EMITrips";
import Healings from "./pages/Healing";
import DalaiLamaDarshanPage from "./pages/DalaiLamaDarshan";


// Auth Pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// Visa & Documentation Pages
import VisaApplication from "./pages/VisaApplication";
import Documentation from "./pages/Documentation";
import Dashboard from "./pages/Dashboard";
import Insurance from "./pages/Insurance";
import AgentSignup from "./pages/AgentSignup";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTrips from "./pages/admin/AdminTrips";
import AdminTripForm from "./pages/admin/AdminTripForm";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminBlogForm from "./pages/admin/AdminBlogForm";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVisaApplications from "./pages/admin/AdminVisaApplications";
import AdminCustomTrips from "./pages/admin/AdminCustomTrips";
import AdminDocumentation from "./pages/admin/AdminDocumentation";
import AdminInsurance from "./pages/admin/AdminInsurance";
import AdminAgents from "./pages/admin/AdminAgents";
import  { AdminTestimonials } from "./pages/admin/AdminTestimonials";
import AdminDalaiLamaBookings from "./pages/admin/AdminDalaiLamaBookings";

// Admin Homepage Management Pages
import AdminHeroSection from "./pages/admin/AdminHeroSection";
import AdminTrendingDestinations from "./pages/admin/AdminTrendingDestinations";
import AdminExploreDestinations from "./pages/admin/AdminExploreDestinations";

// Admin Components
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import ComboTrips from "./pages/Combotrips";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            
            {/* Authentication Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Visa & Documentation Routes */}
            <Route path="/visa-application" element={<VisaApplication />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/insurance" element={<Insurance />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* Admin Homepage Management Routes */}
            <Route
              path="/admin/homepage/hero"
              element={
                <ProtectedAdminRoute>
                  <AdminHeroSection />
                </ProtectedAdminRoute>
              }
            />
            <Route 
              path="/admin/dalai-lama-bookings"
              element={
                <ProtectedAdminRoute>   
                  <AdminDalaiLamaBookings />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/homepage/trending"
              element={
                <ProtectedAdminRoute>
                  <AdminTrendingDestinations />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/homepage/explore"
              element={
                <ProtectedAdminRoute>
                  <AdminExploreDestinations />
                </ProtectedAdminRoute>
              }
            />

            {/* Admin Trips Routes */}
            <Route
              path="/admin/trips"
              element={
                <ProtectedAdminRoute>
                  <AdminTrips />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/trips/create"
              element={
                <ProtectedAdminRoute>
                  <AdminTripForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedAdminRoute>
                  <AdminTestimonials />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/trips/edit/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminTripForm />
                </ProtectedAdminRoute>
              }
            />

            {/* Admin Blogs Routes */}
            <Route
              path="/admin/blogs"
              element={
                <ProtectedAdminRoute>
                  <AdminBlogs />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/blogs/create"
              element={
                <ProtectedAdminRoute>
                  <AdminBlogForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/blogs/edit/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminBlogForm />
                </ProtectedAdminRoute>
              }
            />

            {/* Admin Other Routes */}
            <Route
              path="/admin/bookings"
              element={
                <ProtectedAdminRoute>
                  <AdminBookings />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <AdminUsers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedAdminRoute>
                  <AdminApplications />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/visa-applications"
              element={
                <ProtectedAdminRoute>
                  <AdminVisaApplications />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/insurance"
              element={
                <ProtectedAdminRoute>
                  <AdminInsurance />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/agents"
              element={
                <ProtectedAdminRoute>
                  <AdminAgents />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/custom-trips"
              element={
                <ProtectedAdminRoute>
                  <AdminCustomTrips />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/documentation"
              element={
                <ProtectedAdminRoute>
                  <AdminDocumentation />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedAdminRoute>
                  <AdminSettings />
                </ProtectedAdminRoute>
              }
            />
            
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
            <Route path="/trips/emi" element={<EMITrips />} />
            <Route path="/trips/cruise" element={<CruiseTrips />} />
            <Route path="/dalai-lama-darshan" element={<DalaiLamaDarshanPage />} />
            
            {/* Destination Routes */}
            <Route path="/destination/:slug" element={<TripDetail />} />
            
            {/* Retreats */}
            <Route path="/retreats" element={<Retreats />} />
            <Route path="/retreats/meditation" element={<Retreats />} />
            <Route path="/retreats/spiritual" element={<Retreats />} />
            <Route path="/retreats/wellness" element={<Healings />} />
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

            {/* Combo Trips */}
            <Route path="/trips/combo" element={<ComboTrips />} />
            
            {/* Contact & More */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<Blogs />} />
            <Route path="/privacy" element={<Contact />} />
            <Route path="/cancellation" element={<Contact />} />
            <Route path="/terms" element={<Contact />} />
            <Route path="/corporate" element={<Contact />} />
            <Route path="/agent-signup" element={<AgentSignup />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;