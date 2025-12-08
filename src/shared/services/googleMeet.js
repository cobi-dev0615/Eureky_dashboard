import { apiClient } from './api';

/**
 * Google Meet service for managing meetings
 */
class GoogleMeetService {
  /**
   * Create a new Google Meet meeting
   * @param {object} meetingData - Meeting details
   * @param {string} meetingData.calendarId - Calendar ID (optional, uses primary if not provided)
   * @param {string} meetingData.summary - Meeting title
   * @param {string} meetingData.description - Meeting description (optional)
   * @param {string} meetingData.startDateTime - Start date/time in ISO format
   * @param {string} meetingData.endDateTime - End date/time in ISO format
   * @param {string} meetingData.timeZone - Timezone (optional, defaults to calendar timezone)
   * @param {Array} meetingData.attendees - Array of attendees (optional)
   * @returns {Promise} Meeting data with Google Meet link
   */
  async createMeeting(meetingData) {
    return apiClient.post('/google-meet', meetingData);
  }

  /**
   * Get a specific Google Meet meeting
   * @param {string} calendarId - Calendar ID
   * @param {string} eventId - Event ID
   * @returns {Promise} Meeting details
   */
  async getMeeting(calendarId, eventId) {
    return apiClient.get(`/google-meet/${calendarId}/${eventId}`);
  }

  /**
   * Delete a Google Meet meeting
   * @param {string} calendarId - Calendar ID
   * @param {string} eventId - Event ID
   * @returns {Promise} Success response
   */
  async deleteMeeting(calendarId, eventId) {
    return apiClient.delete(`/google-meet/${calendarId}/${eventId}`);
  }
}

export const googleMeetService = new GoogleMeetService();
export default GoogleMeetService;
