// Trip Data - Separated from component logic
// This file contains all the data needed for the trip details and listing pages

import destGeorgia from "@/assets/dest-georgia.jpg";

export interface ItineraryDay {
  day: number;
  title: string;
  highlights: string[];
}

export interface TripDate {
  month: string;
  date: string;
  price: number;
}

export interface TripDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  dates: TripDate[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  notes: string[];
}

// Main Georgia Winter Trip Data
export const georgiaWinterTripData: TripDetail = {
  id: "georgia-winter",
  name: "Georgia Winter Group Trip",
  description: "Georgia is a stunning destination that offers a unique blend of ancient history, breathtaking landscapes, and vibrant culture. From the snow-capped Caucasus Mountains to the charming cobblestone streets of Tbilisi, every moment in Georgia is magical. This winter trip is designed to give you the best of Georgian hospitality, cuisine, and adventure.",
  image: destGeorgia,
  duration: "7N/8D",
  price: 52999,
  originalPrice: 56999,
  discount: 4000,
  dates: [
    { month: "Feb", date: "28 Feb 2026", price: 52999 },
    { month: "Mar", date: "7 Mar 2026", price: 52999 },
    { month: "Mar", date: "14 Mar 2026", price: 54999 },
  ],
  itinerary: [
    {
      day: 0,
      title: "Arrival at Tbilisi International Airport | Transfer to Hotel | Free Time",
      highlights: [
        "Welcome to Georgia! Our representative will meet you at Tbilisi International Airport",
        "Transfer to your hotel and check-in",
        "Take some time to relax and freshen up",
        "In the evening, explore the vibrant nightlife of Tbilisi",
        "Enjoy a leisurely walk around the hotel area"
      ]
    },
    {
      day: 1,
      title: "Tbilisi City Tour | Old Town Exploration | Cable Car Ride",
      highlights: [
        "After breakfast, embark on a comprehensive tour of Tbilisi",
        "Visit the iconic Holy Trinity Cathedral",
        "Explore the charming Old Town with colorful balconies and narrow streets",
        "Take a cable car ride to Narikala Fortress for panoramic views",
        "Traditional Georgian dinner with local wine and live folk music"
      ]
    },
    {
      day: 2,
      title: "Drive to Kazbegi | Gergeti Trinity Church | Mountain Views",
      highlights: [
        "Scenic drive along the stunning Georgian Military Highway to Kazbegi",
        "Stop at Ananuri Fortress for photos",
        "Visit the Russia-Georgia Friendship Monument",
        "Jeep ride to the famous Gergeti Trinity Church at 2,170 meters",
        "Breathtaking views of Mount Kazbek as a backdrop",
        "Overnight stay in Kazbegi"
      ]
    },
    {
      day: 3,
      title: "Skiing in Gudauri | Winter Sports Activities",
      highlights: [
        "Head to Gudauri, Georgia's premier ski resort",
        "Enjoy a full day on the slopes (beginners to experienced)",
        "Ski equipment rental and lessons available",
        "Non-skiers can enjoy tubing and paragliding",
        "Soak in stunning mountain scenery from cozy cafes"
      ]
    },
    {
      day: 4,
      title: "Kakheti Wine Region | Winery Tours | Wine Tasting",
      highlights: [
        "Travel to Kakheti, Georgia's famous wine region",
        "Visit traditional wineries and learn about 8,000-year-old winemaking",
        "Generous wine tastings paired with local cheese and bread",
        "Explore Sighnaghi, known as the 'City of Love'",
        "Experience the romantic atmosphere of the town"
      ]
    },
    {
      day: 5,
      title: "Mtskheta Day Trip | UNESCO Heritage Sites | Jvari Monastery",
      highlights: [
        "Visit Mtskheta, Georgia's ancient capital (UNESCO World Heritage Site)",
        "Explore Svetitskhoveli Cathedral, one of the holiest sites",
        "Visit the hilltop Jvari Monastery with stunning river views",
        "Return to Tbilisi for shopping and leisure time"
      ]
    },
    {
      day: 6,
      title: "Free Day in Tbilisi | Spa & Relaxation | Farewell Dinner",
      highlights: [
        "Enjoy a relaxing day in Tbilisi",
        "Visit the famous sulfur baths for a traditional spa experience",
        "Explore the trendy Fabrika area",
        "Shop for souvenirs at the Dry Bridge Market",
        "Special farewell dinner celebrating our Georgian adventure"
      ]
    },
    {
      day: 7,
      title: "Departure | Airport Transfer | Goodbye Georgia",
      highlights: [
        "After breakfast, check out from the hotel",
        "Transfer to Tbilisi International Airport",
        "Bid farewell to Georgia with memories that will last a lifetime",
        "We hope to see you on another adventure soon!"
      ]
    },
  ],
  inclusions: [
    "7 Nights accommodation in 3-4 star hotels",
    "Daily breakfast and selected meals",
    "All airport and inter-city transfers",
    "Experienced English-speaking guide",
    "All sightseeing as per itinerary",
    "Entry tickets to monuments",
    "One day ski pass at Gudauri",
    "Wine tasting experience",
    "Travel insurance",
    "24/7 trip captain support"
  ],
  exclusions: [
    "International airfare",
    "Visa fees (if applicable)",
    "Personal expenses",
    "Tips and gratuities",
    "Adventure activities not mentioned",
    "Ski equipment rental",
    "Meals not mentioned in inclusions",
    "Travel insurance upgrade"
  ],
  notes: [
    "Passport with minimum 6 months validity required",
    "Travel insurance is mandatory",
    "Warm winter clothing is essential",
    "Basic fitness level recommended for mountain activities",
    "Group size: 12-20 travelers",
    "Single room supplement available at additional cost",
    "Itinerary may be modified due to weather conditions",
    "Full payment required 30 days before departure"
  ]
};

// Tab configuration
export const TRIP_TABS = ["Itinerary", "Inclusions", "Costing", "Notes"];

// Pricing table data
export const PRICING_DETAILS = [
  {
    sharing: "Double Sharing",
    priceOffset: 0
  },
  {
    sharing: "Triple Sharing",
    priceOffset: -3000
  },
  {
    sharing: "Single Room Supplement",
    priceOffset: 15000,
    isSupplementary: true
  }
];

// WhatsApp contact
export const WHATSAPP_CONTACT = "+917501610109";

// Function to get trip data by ID (can be extended for multiple trips)
export function getTripDataById(id: string): TripDetail | null {
  switch (id) {
    case "georgia-winter":
      return georgiaWinterTripData;
    // Add more trips here as needed
    default:
      return null;
  }
}

// Export all trip data for listing
export const allTripsData = {
  "georgia-winter": georgiaWinterTripData
};