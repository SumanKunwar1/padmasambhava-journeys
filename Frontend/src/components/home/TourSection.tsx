// src/components/home/TourSection.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { TourGrid } from "@/components/home/TourGrid";
import type { TourTrip } from "@/components/home/TourCard";
import { API_BASE_URL } from "@/lib/api-config";
import { toRouteList } from "@/lib/trip-taxonomy";
import type { HomeTourSectionConfig } from "@/lib/home-sections";
import { cn } from "@/lib/utils";

interface TourSectionProps extends HomeTourSectionConfig {
  /** How many cards to show before "View All" takes over. */
  limit?: number;
  tone?: "background" | "muted";
}

/**
 * One homepage tour section: heading, description, and the trips an admin
 * assigned to it. The section always shows; until it has a trip it invites
 * visitors to enquire instead.
 */
export function TourSection({
  id,
  title,
  description,
  highlights,
  route,
  imageShape,
  limit = 4,
  tone = "background",
}: TourSectionProps) {
  const [trips, setTrips] = useState<TourTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTrips = async () => {
      try {
        // Returns the section's trips in the order arranged under
        // Admin > Homepage > Tour Sections.
        const response = await axios.get(`${API_BASE_URL}/home-sections/${id}`);

        if (!cancelled && response.data.status === "success") {
          // The client-side filter is a backstop in case the query param is ignored.
          setTrips(
            (response.data.data.trips as TourTrip[]).filter((trip) =>
              toRouteList(trip.tripRoute).includes(route)
            )
          );
        }
      } catch (error) {
        console.error(`Error fetching trips for "${title}":`, error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTrips();

    return () => {
      cancelled = true;
    };
  }, [id, route, title]);

  return (
    <section
      className={cn("py-12 md:py-16 lg:py-20", tone === "muted" ? "bg-muted" : "bg-background")}
      aria-labelledby={`${id}-heading`}
      data-testid={`tour-section-${id}`}
    >
      <div className="container-custom">
        <SectionHeading id={`${id}-heading`} title={title} description={description} highlights={highlights} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : trips.length === 0 ? (
          <div
            className="max-w-xl mx-auto rounded-2xl border border-dashed border-border bg-card px-6 py-8 sm:py-10 text-center"
            data-testid="tour-section-empty"
          >
            <CalendarClock className="w-9 h-9 text-primary mx-auto mb-3" />
            <p className="font-display text-lg sm:text-xl font-semibold mb-1">New departures coming soon</p>
            <p className="text-sm sm:text-base text-muted-foreground mb-5">
              We are finalising the next dates. Tell us you are interested and we will reach out first.
            </p>
            <Button asChild>
              <Link to="/contact">
                Enquire Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <TourGrid trips={trips.slice(0, limit)} imageShape={imageShape} />

            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to={route} aria-label={`View all ${title}`}>
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
