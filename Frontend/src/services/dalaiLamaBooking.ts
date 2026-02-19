// src/services/dalaiLamaBooking.ts
import axiosInstance from '@/lib/axios';

export interface DalaiLamaBookingData {
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  travelers: number;
  selectedDate: string;
  // totalAmount removed — this is an inquiry, pricing discussed later
}

export const dalaiLamaBookingService = {
  // Public endpoint - no auth required
  createBooking: async (data: DalaiLamaBookingData) => {
    try {
      const response = await axiosInstance.post('/dalai-lama-bookings', data);
      return response.data;
    } catch (error: any) {
      console.error('Dalai Lama inquiry error:', error.response?.data || error);
      throw error;
    }
  },

  // Admin endpoints - require authentication (axiosInstance handles this)
  getAllBookings: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get('/dalai-lama-bookings', { params });
    return response.data;
  },

  getBooking: async (id: string) => {
    const response = await axiosInstance.get(`/dalai-lama-bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id: string, data: { status: string }) => {
    const response = await axiosInstance.patch(`/dalai-lama-bookings/${id}`, data);
    return response.data;
  },

  deleteBooking: async (id: string) => {
    const response = await axiosInstance.delete(`/dalai-lama-bookings/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/dalai-lama-bookings/admin/stats');
    return response.data;
  },
};