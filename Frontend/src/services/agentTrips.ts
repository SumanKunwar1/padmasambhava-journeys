// src/services/agentTrips.ts
import axiosInstance from '@/lib/axios';

export interface OccupancyPrice {
  type: string;
  b2bPrice: number;
  retailPrice: number;
  isSupplementary: boolean;
}

export interface TripDate {
  date: string;
  price: number;
  available: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  highlights: string[];
}

export interface AgentTrip {
  _id: string;
  name: string;
  destination: string;
  duration: string;
  description: string;
  price: number;
  b2bPrice: number;
  originalPrice: number;
  discount: number;
  commission: number;
  image: string;
  inclusions: string[];
  exclusions: string[];
  notes: string[];
  itinerary: ItineraryDay[];
  dates: TripDate[];
  occupancyPricing: OccupancyPrice[];
  hasGoodies: boolean;
  tripCategory: string;
  tripType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentTripData {
  name: string;
  destination: string;
  duration: string;
  description?: string;
  price: number;
  b2bPrice: number;
  originalPrice?: number;
  discount?: number;
  commission?: number;
  image?: string;
  inclusions?: string[];
  exclusions?: string[];
  notes?: string[];
  itinerary?: ItineraryDay[];
  dates?: TripDate[];
  occupancyPricing?: OccupancyPrice[];
  hasGoodies?: boolean;
  tripCategory?: string;
  tripType?: string;
}

export const agentTripsService = {
  // Get all agent trips
  getAllTrips: async (params?: {
    search?: string;
    destination?: string;
    tripCategory?: string;
    tripType?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get('/agent-trips', { params });
    return response.data;
  },

  // Get single agent trip
  getTrip: async (id: string) => {
    const response = await axiosInstance.get(`/agent-trips/${id}`);
    return response.data;
  },

  // Create agent trip
  createTrip: async (data: CreateAgentTripData) => {
    const response = await axiosInstance.post('/agent-trips', data);
    return response.data;
  },

  // Update agent trip
  updateTrip: async (id: string, data: Partial<CreateAgentTripData>) => {
    const response = await axiosInstance.patch(`/agent-trips/${id}`, data);
    return response.data;
  },

  // Delete agent trip
  deleteTrip: async (id: string) => {
    const response = await axiosInstance.delete(`/agent-trips/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await axiosInstance.get('/agent-trips/admin/stats');
    return response.data;
  },

  // Toggle active status
  toggleActive: async (id: string) => {
    const response = await axiosInstance.patch(`/agent-trips/${id}/toggle-active`);
    return response.data;
  },

  // Bulk create trips
  bulkCreate: async (trips: CreateAgentTripData[]) => {
    const response = await axiosInstance.post('/agent-trips/bulk', { trips });
    return response.data;
  },
};