// src/services/agentBookings.ts
import axiosInstance from '@/lib/axios';

export interface AgentBookingData {
  agentTripId: string;       // ⭐ This is the key difference — uses AgentTrip ID
  tripName: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  travelers: number;
  selectedDate?: string;
  occupancyType?: string;
  selectedPrice?: number;
  totalAmount: number;
  // Optional agent info (auto-populated from JWT on backend if logged in)
  agentName?: string;
  agentEmail?: string;
  agentCompany?: string;
}

export const agentBookingService = {
  // POST /api/v1/agent-bookings
  createBooking: async (data: AgentBookingData) => {
    const response = await axiosInstance.post('/agent-bookings', data);
    return response.data;
  },

  // GET /api/v1/agent-bookings
  getAllBookings: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get('/agent-bookings', { params });
    return response.data;
  },

  // GET /api/v1/agent-bookings/:id
  getBooking: async (id: string) => {
    const response = await axiosInstance.get(`/agent-bookings/${id}`);
    return response.data;
  },

  // PATCH /api/v1/agent-bookings/:id
  updateBooking: async (id: string, data: { status: string }) => {
    const response = await axiosInstance.patch(`/agent-bookings/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/agent-bookings/:id
  deleteBooking: async (id: string) => {
    const response = await axiosInstance.delete(`/agent-bookings/${id}`);
    return response.data;
  },

  // GET /api/v1/agent-bookings/stats
  getStats: async () => {
    const response = await axiosInstance.get('/agent-bookings/stats');
    return response.data;
  },
};