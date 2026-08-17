// src/pages/DestinationTrips.tsx
// Lists every Active trip linked to one Explore Destination card.
// Reached from the "Explore Destinations" grid on the homepage, e.g. /destination/nepal
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TripListingPage from "@/components/trips/TripListingPage";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { API_BASE_URL } from "@/lib/api-config";
import axios from "axios";

interface Destination {
  _id: string;
  name: string;
  slug: string;
  image: string;
  type: string;
}

const DestinationTrips = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!slug) return;

      setLoading(true);
      setNotFound(false);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/explore-destinations/slug/${slug}`
        );
        if (response.data.status === "success") {
          setDestination(response.data.data.exploreDestination);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !destination) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">
            Destination not found
          </h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the destination you're looking for.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <TripListingPage
      title={`Explore all ${destination.name} Tour Packages`}
      tagline={destination.name}
      subtitle={`Discover our handpicked trips to ${destination.name}.`}
      description={`Browse every tour package we offer in ${destination.name}. From short getaways to extended journeys, each trip is curated to give you the very best of ${destination.name}.`}
      heroImage={destination.image}
      destinationSlug={destination.slug}
      filterDestinations={["All"]}
    />
  );
};

export default DestinationTrips;
