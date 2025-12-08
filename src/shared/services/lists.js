import { apiClient } from './api';

export const listsService = {
  // Get all lists for the authenticated user
  // Supports all query parameters from Postman collection:
  // limit, offset, status, isCompleted, orderBy, orderDirection, includeItems, itemsLimit
  async getLists(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add optional query parameters
      if (params.limit !== undefined) queryParams.append('limit', params.limit);
      if (params.offset !== undefined) queryParams.append('offset', params.offset);
      if (params.status) queryParams.append('status', params.status);
      if (params.isCompleted !== undefined) queryParams.append('isCompleted', params.isCompleted);
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
      if (params.includeItems !== undefined) queryParams.append('includeItems', params.includeItems);
      if (params.itemsLimit !== undefined) queryParams.append('itemsLimit', params.itemsLimit);

      const url = `/lists${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch lists');
    }
  },

  // Get a specific list by ID
  async getListById(listId) {
    try {
      const response = await apiClient.get(`/lists/${listId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch list');
    }
  },

  // Create a new list
  async createList(listData) {
    try {
      const response = await apiClient.post('/lists', listData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create list');
    }
  },

  // Update an existing list
  async updateList(listId, updates) {
    try {
      const response = await apiClient.put(`/lists/${listId}`, updates);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update list');
    }
  },

  // Delete a list
  async deleteList(listId) {
    try {
      const response = await apiClient.delete(`/lists/${listId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete list');
    }
  }
};