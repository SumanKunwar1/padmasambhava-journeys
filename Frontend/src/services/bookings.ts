// src/services/api/bookings.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BookingData {
  tripId: string;
  tripName: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  travelers: number;
  selectedDate?: string;
  selectedPrice?: number;
  totalAmount: number;
}

export const bookingService = {
  // Create booking
  createBooking: async (data: BookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Get all bookings (admin)
  getAllBookings: async (params?: { 
    status?: string; 
    search?: string; 
    page?: number; 
    limit?: number;
  }) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Get single booking (admin)
  getBooking: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status (admin)
  updateBooking: async (id: string, data: { status: string }) => {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  },

  // Delete booking (admin)
  deleteBooking: async (id: string) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Get booking statistics (admin)
  getStats: async () => {
    const response = await api.get('/bookings/admin/stats');
    return response.data;
  },
};