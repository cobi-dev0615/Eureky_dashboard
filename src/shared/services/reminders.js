import { apiClient } from './api';

export const remindersService = {
  // Get all reminders for the authenticated user
  async getReminders() {
    try {
      const response = await apiClient.get('/reminders/user');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch reminders');
    }
  },

  // Create a new reminder
  async createReminder(reminderData) {
    try {
      const response = await apiClient.post('/reminders/create', reminderData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create reminder');
    }
  },

  // Update an existing reminder
  async updateReminder(id, updates) {
    try {
      const response = await apiClient.put(`/reminders/${id}`, updates);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update reminder');
    }
  },

  // Delete a reminder
  async deleteReminder(reminderId) {
    try {
      const response = await apiClient.delete(`/reminders/${reminderId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete reminder');
    }
  },

  // Toggle reminder completion
  async toggleReminderCompletion(reminderId, completed) {
    try {
      return await this.updateReminder(reminderId, { completed });
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle reminder completion');
    }
  }
};