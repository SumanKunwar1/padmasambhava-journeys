// src/services/dalaiLamaBooking.ts - FIXED TO USE EXISTING AXIOS
import axiosInstance from '@/lib/axios'; // Use your existing axios instance

export interface DalaiLamaBookingData {
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  travelers: number;
  selectedDate: string;
  totalAmount: number;
}

export const dalaiLamaBookingService = {
  // Public endpoint - no auth required
  createBooking: async (data: DalaiLamaBookingData) => {
    try {
      console.log('📝 Submitting Dalai Lama booking:', data);
      const response = await axiosInstance.post('/dalai-lama-bookings', data);
      console.log('✅ Dalai Lama booking response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Dalai Lama booking error:', error.response?.data || error);
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
    try {
      console.log('📥 Fetching all bookings:', params);
      const response = await axiosInstance.get('/dalai-lama-bookings', { params });
      console.log('✅ All bookings fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching bookings:', error.response?.data || error);
      throw error;
    }
  },

  getBooking: async (id: string) => {
    try {
      console.log('📥 Fetching booking:', id);
      const response = await axiosInstance.get(`/dalai-lama-bookings/${id}`);
      console.log('✅ Booking fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching booking:', error.response?.data || error);
      throw error;
    }
  },

  updateBooking: async (id: string, data: { status: string }) => {
    try {
      console.log('📝 Updating booking:', id, 'with status:', data.status);
      const response = await axiosInstance.patch(`/dalai-lama-bookings/${id}`, data);
      console.log('✅ Booking updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating booking:', error.response?.data || error);
      throw error;
    }
  },

  deleteBooking: async (id: string) => {
    try {
      console.log('🗑️  Deleting booking:', id);
      const response = await axiosInstance.delete(`/dalai-lama-bookings/${id}`);
      console.log('✅ Booking deleted:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting booking:', error.response?.data || error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      console.log('📊 Fetching booking statistics...');
      const response = await axiosInstance.get('/dalai-lama-bookings/admin/stats');
      console.log('✅ Stats fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error.response?.data || error);
      throw error;
    }
  },
};