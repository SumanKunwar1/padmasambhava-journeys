// src/components/home/TourCard.tsx
import { Link } from "react-router-dom";
import { Calendar, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shared/Price";
import { cn } from "@/lib/utils";

export interface TourTrip {
  _id: string;
  name: string;
  image: string;
  duration: string;
  price: number;
  priceUSD?: number;
  originalPrice?: number;
  discount?: number;
  dates?: Array<{ date: string; price: number }>;
  destination?: string;
  hasGoodies?: boolean;
  // Arrays since a trip can sit under several types; legacy rows hold a
  // bare string, so every read goes through toRouteList().
  tripRoute?: string[] | string;
}

interface TourCardProps {
  trip: TourTrip;
  imageShape?: "landscape" | "square";
  onBookNow: (trip: TourTrip) => void;
}

export function TourCard({ trip, imageShape = "landscape", onBookNow }: TourCardProps) {
  const detailsHref = `/trip/${trip._id}`;
  const hasDiscount = Boolean(trip.discount && trip.originalPrice && trip.originalPrice > trip.price);

  return (
    <article
      className="flex h-full flex-col bg-card rounded-2xl overflow-hidden card-hover group"
      data-testid="tour-card"
    >
      {/* Image */}
      <Link
        to={detailsHref}
        className={cn("relative block overflow-hidden", imageShape === "square" ? "aspect-square" : "aspect-[4/3]")}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={trip.image}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        {trip.hasGoodies && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1.5 bg-primary text-primary-foreground px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium">
            <Gift className="w-3 h-3" />
            Free Goodies
          </div>
        )}
        {trip.duration && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-charcoal/80 backdrop-blur-sm text-primary-foreground px-2 py-1 sm:px-2.5 rounded-md text-[10px] sm:text-xs font-medium">
            🗓 {trip.duration}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 mb-2 sm:mb-3">
          <Link to={detailsHref} className="hover:text-primary transition-colors">
            {trip.name}
          </Link>
        </h3>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2 sm:mb-3">
          <Price
            currency="USD"
            amount={trip.price}
            priceUSD={trip.priceUSD}
            className="text-base sm:text-xl font-bold text-foreground"
          />
          {hasDiscount && (
            <>
              <Price
                currency="USD"
                amount={trip.originalPrice!}
                relatedTo={trip.price}
                priceUSD={trip.priceUSD}
                showApprox={false}
                className="price-original"
              />
              <span className="price-discount">
                <Price
                  currency="USD"
                  amount={trip.discount!}
                  relatedTo={trip.price}
                  priceUSD={trip.priceUSD}
                  showApprox={false}
                />{" "}
                Off
              </span>
            </>
          )}
        </div>

        {/* Dates */}
        {trip.dates && trip.dates.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="line-clamp-1">
              {trip.dates.slice(0, 3).map((d) => d.date).join(", ")}
              {trip.dates.length > 3 && " +more"}
            </span>
          </div>
        )}

        {/* Actions, pinned to the bottom so every card in a row lines up */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="w-full sm:flex-1">
            <Link to={detailsHref} aria-label={`View details of ${trip.name}`}>
              View Details
            </Link>
          </Button>
          <Button size="sm" className="w-full sm:flex-1" onClick={() => onBookNow(trip)} aria-label={`Book ${trip.name} now`}>
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}
