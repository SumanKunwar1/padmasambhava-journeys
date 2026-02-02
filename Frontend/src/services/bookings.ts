// src/services/api/bookings.ts
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api-config';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  createBooking: async (data: BookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAllBookings: async (params?: { 
    status?: string; 
    search?: string; 
    page?: number; 
    limit?: number;
  }) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getBooking: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id: string, data: { status: string }) => {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  },

  deleteBooking: async (id: string) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/bookings/admin/stats');
    return response.data;
  },
};