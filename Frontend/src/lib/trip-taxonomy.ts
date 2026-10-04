// src/lib/trip-taxonomy.ts
//
// The single source of truth for how a trip is classified and where it shows up.
//
// A trip picks one or more CATEGORIES, and within those, one or more TYPES.
// Every type owns exactly one canonical listing URL (its `route`), and a trip's
// `tripRoute` array is derived from its selected types. That is what makes a
// trip with several types appear on every one of those listing pages: each page
// asks for the trips whose tripRoute contains its own URL.

export interface TripSubcategory {
  label: string;
  value: string;
  route: string;
}

export interface TripCategory {
  value: string;
  subcategories: TripSubcategory[];
}

export const TRIP_CATEGORIES: Record<string, TripCategory> = {
  "EMI Trips": {
    value: "emi-trips",
    subcategories: [
      { label: "EMI Packages", value: "emi-package", route: "/trips/emi" },
    ],
  },
  "International Trips": {
    value: "international-trips",
    subcategories: [
      { label: "International Packages", value: "international-package", route: "/international-trips" },
    ],
  },
  "Nepal Trips": {
    value: "nepal-trips",
    subcategories: [
      { label: "Domestic Packages", value: "domestic-package", route: "/domestic-trips" },
    ],
  },
  "Deals": {
    value: "deals",
    subcategories: [
      { label: "Seasonal Deals", value: "seasonal", route: "/deals/seasonal" },
      { label: "Limited Time Offers", value: "limited", route: "/deals/limited" },
    ],
  },
  "Travel Styles": {
    value: "travel-styles",
    subcategories: [
      { label: "Pilgrimage Trips", value: "pilgrimage", route: "/trips/pilgrimage" },
      { label: "Solo Trips", value: "solo", route: "/style/solo" },
      { label: "Group Trips", value: "group", route: "/trips/group" },
      { label: "Weekend Trips", value: "weekend", route: "/trips/weekend" },
      { label: "Adventure Trips", value: "adventure", route: "/style/adventure" },
      { label: "Cruise Trips", value: "cruise", route: "/trips/cruise" },
      { label: "Customised Trips", value: "customised", route: "/custom" },
    ],
  },
  "Combo Trips": {
    value: "combo-trips",
    subcategories: [
      { label: "Combo Packages", value: "combo", route: "/trips/combo" },
    ],
  },
  "Retreats & Healings": {
    value: "retreats",
    subcategories: [
      { label: "Retreats", value: "meditation", route: "/retreats/meditation" },
      { label: "Healings", value: "wellness", route: "/retreats/wellness" },
    ],
  },
};

/** Every type, flattened, in the order the admin form shows them. */
export const TRIP_TYPES: TripSubcategory[] = Object.values(TRIP_CATEGORIES).flatMap(
  (category) => category.subcategories
);

/** The canonical listing route for each type value. */
export const ROUTE_BY_TYPE: Record<string, string> = Object.fromEntries(
  TRIP_TYPES.map((type) => [type.value, type.route])
);

/**
 * Extra URLs that should list the same trips as a canonical route. These exist
 * because the navbar and older links point at them, but no trip stores them —
 * without this map those pages would come back empty.
 */
export const ROUTE_ALIASES: Record<string, string> = {
  "/group-trips": "/trips/group",
  "/trips/upcoming": "/trips/group",
  "/trips/fixed-departure": "/trips/group",
  "/deals/limited-time": "/deals/limited",
  "/retreats/spiritual": "/retreats/meditation",
  "/retreats/yoga": "/retreats/meditation",
};

const KNOWN_ROUTES = new Set(TRIP_TYPES.map((type) => type.route));

/**
 * The listing route a given URL should filter by, or null when the URL is not a
 * type listing at all (a destination page, say) and should keep its own filter.
 */
export function canonicalRouteFor(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (ROUTE_ALIASES[path]) return ROUTE_ALIASES[path];
  if (KNOWN_ROUTES.has(path)) return path;

  return null;
}

/** Normalises a trip's tripRoute, which legacy rows store as a bare string. */
export function toRouteList(value: string[] | string | undefined | null): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}
