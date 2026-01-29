// src/services/api/documentation.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface DocumentData {
  documentId: string;
  name: string;
  category: string;
  description: string;
  status: 'required' | 'optional' | 'recommended';
  destination?: string;
}

export const documentationService = {
  // Upload document
  uploadDocument: async (data: DocumentData, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentId', data.documentId);
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('status', data.status);
    if (data.destination) {
      formData.append('destination', data.destination);
    }

    const response = await api.post('/documentation/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get my documents
  getMyDocuments: async (destination?: string) => {
    const response = await api.get('/documentation/my-documents', {
      params: { destination },
    });
    return response.data;
  },

  // Get all documents (admin)
  getAllDocuments: async (params?: { userId?: string; destination?: string; page?: number; limit?: number }) => {
    const response = await api.get('/documentation', { params });
    return response.data;
  },

  // Get single document
  getDocument: async (id: string) => {
    const response = await api.get(`/documentation/${id}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string) => {
    const response = await api.delete(`/documentation/${id}`);
    return response.data;
  },

  // Get upload progress
  getProgress: async (destination?: string) => {
    const response = await api.get('/documentation/progress', {
      params: { destination },
    });
    return response.data;
  },
};