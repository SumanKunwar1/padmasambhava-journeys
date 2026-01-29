// src/services/api/visaApplications.ts
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance without default Content-Type
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export interface VisaApplicationData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
  religion: string;
  passportType: string;
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  issuingCountry: string;
  residentialAddress: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  destinationCountry: string;
  purposeOfVisit: string;
  arrivalDate: string;
  departureDate: string;
  durationOfStay: string;
  numberOfEntries: string;
  accommodationType: string;
  accommodationAddress: string;
  travelPackageName?: string;
  placesToVisit?: string;
  expensesBearer: string;
  estimatedBudget: string;
  sufficientFunds: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorAddress?: string;
  sponsorPhone?: string;
  travelledBefore: string;
  countriesVisited?: string;
  overstayedVisa: string;
  refusedVisa: string;
  refusalDetails?: string;
  hasInsurance: string;
  medicalCondition?: string;
  agreeToTerms: boolean;
}

export const visaApplicationService = {
  // Submit visa application
  submitApplication: async (
    data: VisaApplicationData,
    files: {
      passportBioFile?: File;
      passportPhotoFile?: File;
      supportingDocumentsFile?: File;
    }
  ) => {
    try {
      console.log('📤 Submitting visa application...');
      console.log('Data:', data);
      console.log('Files:', files);

      // Validate required files
      if (!files.passportBioFile) {
        throw new Error('Passport bio page is required');
      }
      if (!files.passportPhotoFile) {
        throw new Error('Passport photo is required');
      }

      const formData = new FormData();

      // Append all form data fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convert boolean to string for FormData
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Append files with correct field names
      if (files.passportBioFile instanceof File) {
        formData.append('passportBioFile', files.passportBioFile);
        console.log('✅ Attached passportBioFile:', files.passportBioFile.name);
      }

      if (files.passportPhotoFile instanceof File) {
        formData.append('passportPhotoFile', files.passportPhotoFile);
        console.log('✅ Attached passportPhotoFile:', files.passportPhotoFile.name);
      }

      if (files.supportingDocumentsFile instanceof File) {
        formData.append('supportingDocumentsFile', files.supportingDocumentsFile);
        console.log('✅ Attached supportingDocumentsFile:', files.supportingDocumentsFile.name);
      }

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type})`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Don't set Content-Type header - let browser set it with boundary
      const response = await api.post('/visa-applications', formData);

      console.log('✅ Application submitted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Visa application submission error:', error);

      // Extract meaningful error message
      let errorMessage = 'Failed to submit application. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // Get all applications (admin)
  getAllApplications: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get('/visa-applications', { params });

      // Handle nested data structure
      const applicationsData = response.data?.data?.applications || [];
      const pagination = response.data?.data?.pagination || null;

      return {
        ...response.data,
        data: applicationsData,
        pagination,
      };
    } catch (error: any) {
      console.error('Error fetching visa applications:', error);
      throw error;
    }
  },

  // Get my applications
  getMyApplications: async () => {
    try {
      const response = await api.get('/visa-applications/my-applications');

      // Handle nested data structure
      const applicationsData = response.data?.data?.applications || [];

      return {
        ...response.data,
        data: applicationsData,
      };
    } catch (error: any) {
      console.error('Error fetching my applications:', error);
      throw error;
    }
  },

  // Get single application
  getApplication: async (id: string) => {
    try {
      const response = await api.get(`/visa-applications/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching visa application:', error);
      throw error;
    }
  },

  // Update application status (admin)
  updateApplicationStatus: async (
    id: string,
    data: { status: string; adminNotes?: string }
  ) => {
    try {
      const response = await api.patch(`/visa-applications/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating visa application:', error);
      throw error;
    }
  },

  // Delete application (admin)
  deleteApplication: async (id: string) => {
    try {
      const response = await api.delete(`/visa-applications/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting visa application:', error);
      throw error;
    }
  },

  // Get statistics (admin)
  getStats: async () => {
    try {
      const response = await api.get('/visa-applications/admin/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching visa stats:', error);
      throw error;
    }
  },
};