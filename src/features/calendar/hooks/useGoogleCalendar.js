import { useState, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { calendarService } from '../../../shared/services/calendars';

const OAUTH_STATE_KEY = 'google_oauth_state';

/**
 * Hook for Google Calendar OAuth integration
 * Implements secure OAuth 2.0 flow with CSRF protection
 */
export const useGoogleCalendar = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [needsReconnection, setNeedsReconnection] = useState(false);
  const queryClient = useQueryClient();

  /**
   * Get calendar connection status
   */
  const { data: connectionStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['calendar-connection-status'],
    queryFn: async () => {
      const response = await calendarService.getConnectionStatus();
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });

  /**
   * Step 1: Initiate OAuth flow
   * - Gets authorization URL from backend
   * - Saves state token in localStorage for CSRF protection
   * - Redirects user to Google authorization page
   */
  const connectGoogleCalendar = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get authorization URL and state from backend
      const response = await calendarService.getOAuthAuthorizationUrl();
      const { authUrl, state } = response.data;

      // Save state in localStorage for validation in callback
      localStorage.setItem(OAUTH_STATE_KEY, state);

      // Redirect to Google authorization page
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating OAuth flow:', err);
      setError(err.message || 'Error al conectar con Google Calendar');
      setIsConnecting(false);
    }
  }, []);

  /**
   * Step 2: Handle OAuth callback
   * - Validates state token to prevent CSRF attacks
   * - Sends code to backend to exchange for tokens
   * - Backend saves tokens and imports calendars
   */
  const callbackMutation = useMutation({
    mutationFn: async ({ code, state }) => {
      // Validate state token to prevent CSRF
      const savedState = localStorage.getItem(OAUTH_STATE_KEY);
      if (!savedState || savedState !== state) {
        throw new Error('Invalid state token - possible CSRF attack');
      }

      // Exchange code for tokens (backend handles everything)
      const response = await calendarService.handleOAuthCallback(code, state);

      // Clear state from localStorage
      localStorage.removeItem(OAUTH_STATE_KEY);

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate calendar and events queries to refetch
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['all-calendar-events'] });
      setError(null);
    },
    onError: (err) => {
      console.error('OAuth callback error:', err);
      setError(err.message || 'Error al procesar autenticación');
      localStorage.removeItem(OAUTH_STATE_KEY);
    },
  });

  /**
   * Manual sync of all calendars
   */
  const syncMutation = useMutation({
    mutationFn: () => calendarService.syncAllCalendars(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      setNeedsReconnection(false);
      refetchStatus();
    },
    onError: (err) => {
      console.error('Sync error:', err);

      // Check if error is due to token expiration
      const errorData = err.response?.data;
      if (errorData?.code === 'TOKEN_EXPIRED' ||
          errorData?.code === 'TOKEN_REFRESH_FAILED' ||
          errorData?.code === 'CALENDAR_NOT_ACTIVE' ||
          err.response?.status === 401) {
        setNeedsReconnection(true);
        setError('Tu sesión de Google Calendar ha expirado. Por favor reconecta tu cuenta.');
      } else {
        setError(err.message || 'Error al sincronizar calendarios');
      }
    },
  });

  /**
   * Disconnect Google Calendar
   * - Revokes access tokens
   * - Deactivates all user calendars
   */
  const disconnectMutation = useMutation({
    mutationFn: () => calendarService.disconnectGoogleCalendar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      localStorage.removeItem(OAUTH_STATE_KEY);
    },
    onError: (err) => {
      console.error('Disconnect error:', err);
      setError(err.message || 'Error al desconectar Google Calendar');
    },
  });

  return {
    // OAuth flow
    connectGoogleCalendar,
    handleOAuthCallback: callbackMutation.mutate,
    isHandlingCallback: callbackMutation.isPending,

    // Sync
    syncAllCalendars: syncMutation.mutate,
    isSyncing: syncMutation.isPending,

    // Disconnect
    disconnectGoogleCalendar: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,

    // Connection status
    connectionStatus,
    refetchStatus,
    needsReconnection,

    // State
    isConnecting,
    error,
    isSuccess: callbackMutation.isSuccess,
  };
};

export default useGoogleCalendar;
