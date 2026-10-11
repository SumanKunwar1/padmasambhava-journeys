// src/lib/home-sections.ts
//
// The tour sections on the homepage, in display order. Each one lists the trips
// whose tripRoute contains its `route`. Admins fill them from existing trips
// under Homepage > Tour Sections (or by ticking the type in the trip form).
// To add a section: add a type in trip-taxonomy.ts, an entry here, and a
// matching entry in the backend's HomeSection model.

export interface HomeTourSectionConfig {
  id: string;
  title: string;
  description: string;
  /** Optional second line, e.g. the programs or places covered. */
  highlights?: string;
  /** Listing route to filter by; also where "View All" goes. */
  route: string;
  /** Square pictures suit event posters; landscape suits trip photos. */
  imageShape?: "landscape" | "square";
}

export const HOME_TOUR_SECTIONS: HomeTourSectionConfig[] = [
  {
    id: "kailash-tibet",
    title: "Top Selling Kailash Mansarovar & Tibet Trip Packages",
    description: "Explore our top-selling packages and book your seat today.",
    route: "/trips/kailash-tibet",
  },
  {
    id: "wellness-tours",
    title: "Wellness Tours",
    description: "Discover your wellness journey in Nepal. Choose a weekly 2-day program from:",
    highlights: "Ngyungne Retreat • Vipassana Meditation • Healing • Teachings • Puja • Guided Meditation in Pilgrimage",
    route: "/trips/wellness",
  },
  {
    id: "world-peace-prayer",
    title: "World Peace Prayer",
    description: "Join us for the International World Peace Prayers.",
    highlights: "Sacred gatherings in Sri Lanka, Borobudur, Nepal, China & India",
    route: "/trips/world-peace-prayer",
  },
  {
    id: "pilgrimage-tours",
    title: "Pilgrimage Tours",
    description: "Embark on a meaningful pilgrimage with Venerable Rinpoches.",
    highlights: "Sacred Visits • Teachings • Meditation • Puja",
    route: "/trips/pilgrimage",
  },
  {
    id: "dharma-events",
    title: "Empowerment, Transmission, Teachings & Puja",
    description:
      "Join sacred Vajrayana Buddhist events led by His Holinesses and Venerable Rinpoches from all schools of Tibetan Buddhism.",
    route: "/trips/dharma-events",
    imageShape: "square",
  },
  {
    id: "activities",
    title: "Trip by Activities",
    description: "Live Fully • Travel Together • Create Happy Memories",
    route: "/trips/activities",
  },
];

// Upcoming Group Trips has its own component (it adds destination filters) but
// is filled the same way, from the existing "Group Trips" type.
export const UPCOMING_GROUP_SECTION: HomeTourSectionConfig = {
  id: "upcoming-group",
  title: "Upcoming Group Trips",
  description: "Join our fixed-departure group journeys and travel with like-minded companions.",
  route: "/trips/group",
};

/**
 * Every section an admin can fill under Homepage > Tour Sections, in homepage
 * order. The ids must match HOME_SECTIONS in the backend's HomeSection model.
 */
export const HOME_MANAGED_SECTIONS: HomeTourSectionConfig[] = [UPCOMING_GROUP_SECTION, ...HOME_TOUR_SECTIONS];

/** How many trips a section shows on the homepage before "View All". */
export const HOME_SECTION_VISIBLE_TRIPS = 4;

// Links and media used by the lower homepage sections.
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Padmasambhava+Trip+Siliguri";

// Leave a link empty to hide its button under "Watch Our Trip".
export const SOCIAL_LINKS = {
  instagram: "",
  facebook: "https://www.facebook.com/padmasambhavatrip",
};

export interface HomeVideo {
  title: string;
  /** The id from a YouTube link: youtube.com/watch?v=<youtubeId> */
  youtubeId: string;
}

// Videos shown under "Watch Our Trip". Add entries here to show them.
export const HOME_VIDEOS: HomeVideo[] = [];
