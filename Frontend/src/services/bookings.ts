// src/services/api/bookings.ts
import axiosInstance from '@/lib/axios';

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
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },

  getAllBookings: async (params?: { 
    status?: string; 
    search?: string; 
    page?: number; 
    limit?: number;
  }) => {
    const response = await axiosInstance.get('/bookings', { params });
    return response.data;
  },

  getBooking: async (id: string) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id: string, data: { status: string }) => {
    const response = await axiosInstance.patch(`/bookings/${id}`, data);
    return response.data;
  },

  deleteBooking: async (id: string) => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/bookings/admin/stats');
    return response.data;
  },
};