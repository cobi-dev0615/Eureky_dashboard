import { apiClient } from './api';

export const listItemsService = {
  // Get all items across all user's lists
  async getAllUserItems(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add optional query parameters
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      if (params.isCompleted !== undefined) queryParams.append('isCompleted', params.isCompleted);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);

      const url = `/list-items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all items');
    }
  },

  // Get all items for a specific list
  // GET /list-items/by-list/{{list_id}}?limit=50&includeSubtasks=true
  async getListItems(listId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add optional query parameters
      if (params.limit !== undefined) queryParams.append('limit', params.limit);
      if (params.offset !== undefined) queryParams.append('offset', params.offset);
      if (params.isCompleted !== undefined) queryParams.append('isCompleted', params.isCompleted);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
      if (params.includeSubtasks !== undefined) queryParams.append('includeSubtasks', params.includeSubtasks);

      const url = `/list-items/by-list/${listId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch list items');
    }
  },

  // Add a new item to a list
  async addItemToList(listId, itemData) {
    try {
      const response = await apiClient.post(`/list-items/by-list/${listId}`, itemData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to list');
    }
  },

  // Add a new item to default list (when no list is specified)
  async addItemToDefaultList(itemData) {
    try {
      // According to the API docs, if no listId is provided in URL, it uses user's default list
      // We can simulate this by calling the endpoint without specifying a list
      const response = await apiClient.post('/list-items', itemData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to default list');
    }
  },

  // Update an existing item
  async updateItem(itemId, updates) {
    try {
      const response = await apiClient.put(`/list-items/${itemId}`, updates);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update item');
    }
  },

  // Toggle item completion status
  async toggleItemCompletion(itemId) {
    try {
      const response = await apiClient.post(`/list-items/${itemId}/toggle`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle item completion');
    }
  },

  // Delete an item
  async deleteItem(itemId) {
    try {
      const response = await apiClient.delete(`/list-items/${itemId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete item');
    }
  }
};