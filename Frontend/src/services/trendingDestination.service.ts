// src/services/trendingDestination.service.ts
import { API_BASE_URL } from '@/lib/api-config';

export interface TrendingDestination {
  _id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingDestinationInput {
  name: string;
  price: number;
  image: string;
  url: string;
  order?: number;
  isActive?: boolean;
}

class TrendingDestinationService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Get all trending destinations (Admin)
  async getAll(): Promise<TrendingDestination[]> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending destinations');
    }

    const data = await response.json();
    return data.data.trendingDestinations;
  }

  // Get active trending destinations (Public)
  async getActive(): Promise<TrendingDestination[]> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/active`);

    if (!response.ok) {
      throw new Error('Failed to fetch active trending destinations');
    }

    const data = await response.json();
    return data.data.trendingDestinations;
  }

  // Get single trending destination (Admin)
  async getById(id: string): Promise<TrendingDestination> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending destination');
    }

    const data = await response.json();
    return data.data.trendingDestination;
  }

  // Create trending destination (Admin)
  async create(input: TrendingDestinationInput): Promise<TrendingDestination> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create trending destination');
    }

    const data = await response.json();
    return data.data.trendingDestination;
  }

  // Update trending destination (Admin)
  async update(id: string, input: Partial<TrendingDestinationInput>): Promise<TrendingDestination> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update trending destination');
    }

    const data = await response.json();
    return data.data.trendingDestination;
  }

  // Toggle active status (Admin)
  async toggleActive(id: string): Promise<TrendingDestination> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/${id}/toggle-active`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle active status');
    }

    const data = await response.json();
    return data.data.trendingDestination;
  }

  // Delete trending destination (Admin)
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete trending destination');
    }
  }

  // Reorder trending destinations (Admin)
  async reorder(destinationIds: string[]): Promise<TrendingDestination[]> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/reorder`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ destinationIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reorder trending destinations');
    }

    const data = await response.json();
    return data.data.trendingDestinations;
  }

  // Get statistics (Admin)
  async getStats(): Promise<{
    totalDestinations: number;
    activeDestinations: number;
    inactiveDestinations: number;
    priceStats: {
      average: number;
      minimum: number;
      maximum: number;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/trending-destinations/admin/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    const data = await response.json();
    return data.data;
  }
}

export const trendingDestinationService = new TrendingDestinationService();