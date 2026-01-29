// src/services/api/customTrips.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CustomTripData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelers?: string;
  dates?: string;
  budget?: string;
  message?: string;
}

export const customTripService = {
  // Submit custom trip request
  submitRequest: async (data: CustomTripData) => {
    const response = await api.post('/custom-trips', data);
    return response.data;
  },

  // Get all custom trip requests (admin)
  getAllRequests: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/custom-trips', { params });
    return response.data;
  },

  // Get my custom trip requests
  getMyRequests: async () => {
    const response = await api.get('/custom-trips/my-requests');
    return response.data;
  },

  // Get single custom trip request
  getRequest: async (id: string) => {
    const response = await api.get(`/custom-trips/${id}`);
    return response.data;
  },

  // Update custom trip request (admin)
  updateRequest: async (id: string, data: { status?: string; adminNotes?: string; quotedPrice?: number }) => {
    const response = await api.patch(`/custom-trips/${id}`, data);
    return response.data;
  },

  // Delete custom trip request (admin)
  deleteRequest: async (id: string) => {
    const response = await api.delete(`/custom-trips/${id}`);
    return response.data;
  },

  // Get statistics (admin)
  getStats: async () => {
    const response = await api.get('/custom-trips/stats/overview');
    return response.data;
  },
};