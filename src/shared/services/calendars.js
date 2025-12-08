import { apiClient } from './api';

/**
 * Calendar service for managing Google Calendar integration
 */
class CalendarService {
  /**
   * Get all calendars for the authenticated user
   */
  async getCalendars(params = {}) {
    const queryParams = new URLSearchParams({
      limit: params.limit || 20,
      offset: params.offset || 0,
      ...(params.isActive !== undefined && { isActive: params.isActive }),
      ...(params.syncEnabled !== undefined && { syncEnabled: params.syncEnabled }),
      ...(params.orderBy && { orderBy: params.orderBy }),
      ...(params.orderDirection && { orderDirection: params.orderDirection }),
    });

    return apiClient.get(`/calendars?${queryParams}`);
  }

  /**
   * Get a specific calendar by ID
   */
  async getCalendarById(calendarId) {
    return apiClient.get(`/calendars/${calendarId}`);
  }

  /**
   * Create a new calendar with Google Calendar integration
   */
  async createCalendar(calendarData) {
    return apiClient.post('/calendars', calendarData);
  }

  /**
   * Update an existing calendar
   */
  async updateCalendar(calendarId, calendarData) {
    return apiClient.put(`/calendars/${calendarId}`, calendarData);
  }

  /**
   * Delete a calendar
   */
  async deleteCalendar(calendarId) {
    return apiClient.delete(`/calendars/${calendarId}`);
  }

  /**
   * Set a calendar as primary
   */
  async setPrimaryCalendar(calendarId) {
    return apiClient.post(`/calendars/${calendarId}/set-primary`);
  }

  /**
   * Sync a calendar with Google Calendar
   */
  async syncCalendar(calendarId) {
    return apiClient.post(`/calendars/${calendarId}/sync`);
  }

  /**
   * Get Google OAuth authorization URL
   * Returns: { authUrl: string, state: string }
   */
  async getOAuthAuthorizationUrl() {
    return apiClient.get('/calendar-oauth/google/authorize');
  }

  /**
   * Handle OAuth callback - exchange code for tokens
   * @param {string} code - Authorization code from Google
   * @param {string} state - State token for CSRF protection
   * Returns: { calendars: Calendar[] }
   */
  async handleOAuthCallback(code, state) {
    return apiClient.post('/calendar-oauth/google/callback', { code, state });
  }

  /**
   * Sync all user calendars
   */
  async syncAllCalendars() {
    return apiClient.post('/calendar-oauth/sync');
  }

  /**
   * Sync a specific calendar by ID
   */
  async syncSpecificCalendar(calendarId) {
    return apiClient.post(`/calendar-oauth/sync/${calendarId}`);
  }

  /**
   * Get calendar connection status
   * Returns: { connected: boolean, calendars: Array, activeCalendars: number, inactiveCalendars: number }
   */
  async getConnectionStatus() {
    return apiClient.get('/calendar-oauth/google/status');
  }

  /**
   * Disconnect Google Calendar - revoke access and deactivate calendars
   */
  async disconnectGoogleCalendar() {
    return apiClient.post('/calendar-oauth/google/disconnect');
  }

  /**
   * Get Outlook OAuth authorization URL
   * Returns: { authUrl: string, state: string }
   */
  async getOutlookOAuthAuthorizationUrl() {
    return apiClient.get('/calendar-oauth/outlook/authorize');
  }

  /**
   * Handle Outlook OAuth callback - exchange code for tokens
   * @param {string} code - Authorization code from Outlook
   * @param {string} state - State token for CSRF protection
   * Returns: { calendars: Calendar[] }
   */
  async handleOutlookOAuthCallback(code, state) {
    return apiClient.post('/calendar-oauth/outlook/callback', { code, state });
  }

  /**
   * Get iCloud OAuth authorization URL
   * Returns: { authUrl: string, state: string }
   */
  async getICloudOAuthAuthorizationUrl() {
    return apiClient.get('/calendar-oauth/icloud/authorize');
  }

  /**
   * Handle iCloud OAuth callback - exchange code for tokens
   * @param {string} code - Authorization code from iCloud
   * @param {string} state - State token for CSRF protection
   * Returns: { calendars: Calendar[] }
   */
  async handleICloudOAuthCallback(code, state) {
    return apiClient.post('/calendar-oauth/icloud/callback', { code, state });
  }

  /**
   * Get Outlook calendar connection status
   * Returns: { connected: boolean, calendars: Array, activeCalendars: number, inactiveCalendars: number }
   */
  async getOutlookConnectionStatus() {
    return apiClient.get('/calendar-oauth/outlook/status');
  }

  /**
   * Disconnect Outlook Calendar - revoke access and deactivate calendars
   */
  async disconnectOutlookCalendar() {
    return apiClient.post('/calendar-oauth/outlook/disconnect');
  }

  /**
   * Get iCloud calendar connection status
   * Returns: { connected: boolean, calendars: Array, activeCalendars: number, inactiveCalendars: number }
   */
  async getICloudConnectionStatus() {
    return apiClient.get('/calendar-oauth/icloud/status');
  }

  /**
   * Disconnect iCloud Calendar - revoke access and deactivate calendars
   */
  async disconnectICloudCalendar() {
    return apiClient.post('/calendar-oauth/icloud/disconnect');
  }

  /**
   * Get events for a specific calendar
   * @param {string} calendarId - Calendar ID
   * @param {object} params - Query parameters (start, end, limit, offset)
   */
  async getCalendarEvents(calendarId, params = {}) {
    const queryParams = new URLSearchParams({
      ...(params.start && { start: params.start }),
      ...(params.end && { end: params.end }),
      ...(params.limit && { limit: params.limit }),
      ...(params.offset && { offset: params.offset }),
    });

    return apiClient.get(`/calendars/${calendarId}/events?${queryParams}`);
  }

  /**
   * Get all events for all user calendars
   * @param {object} params - Query parameters (start, end, limit, offset)
   */
  async getAllEvents(params = {}) {
    const queryParams = new URLSearchParams({
      ...(params.start && { start: params.start }),
      ...(params.end && { end: params.end }),
      ...(params.limit && { limit: params.limit }),
      ...(params.offset && { offset: params.offset }),
    });

    return apiClient.get(`/calendar-events?${queryParams}`);
  }
}

export const calendarService = new CalendarService();
export default CalendarService;
