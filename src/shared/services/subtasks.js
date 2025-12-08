import { apiClient } from './api';

export const subtasksService = {
  // Get all subtasks for a specific list item
  // GET /list-items/{{item_id}}/subtasks
  async getSubtasks(listItemId) {
    try {
      const response = await apiClient.get(`/list-items/${listItemId}/subtasks`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch subtasks');
    }
  },

  // Create a new subtask
  // POST /list-items/{{item_id}}/subtasks
  async createSubtask(listItemId, subtaskData) {
    try {
      const response = await apiClient.post(`/list-items/${listItemId}/subtasks`, subtaskData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create subtask');
    }
  },

  // Update a subtask
  // PUT /list-items/{{item_id}}/subtasks/{{subtask_id}}
  async updateSubtask(listItemId, subtaskId, updates) {
    try {
      const response = await apiClient.put(`/list-items/${listItemId}/subtasks/${subtaskId}`, updates);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update subtask');
    }
  },

  // Toggle subtask completion
  // POST /list-items/{{item_id}}/subtasks/{{subtask_id}}/toggle
  async toggleSubtask(listItemId, subtaskId) {
    try {
      const response = await apiClient.post(`/list-items/${listItemId}/subtasks/${subtaskId}/toggle`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle subtask');
    }
  },

  // Delete a subtask
  // DELETE /list-items/{{item_id}}/subtasks/{{subtask_id}}
  async deleteSubtask(listItemId, subtaskId) {
    try {
      const response = await apiClient.delete(`/list-items/${listItemId}/subtasks/${subtaskId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete subtask');
    }
  }
};
