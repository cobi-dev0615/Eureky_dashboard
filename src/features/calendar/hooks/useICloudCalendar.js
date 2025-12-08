import { useState, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { calendarService } from '../../../shared/services/calendars';

const OAUTH_STATE_KEY = 'icloud_oauth_state';

/**
 * Hook for iCloud Calendar OAuth integration
 */
export const useICloudCalendar = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [needsReconnection, setNeedsReconnection] = useState(false);
  const queryClient = useQueryClient();

  /**
   * Get calendar connection status
   */
  const { data: connectionStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['calendar-connection-status-icloud'],
    queryFn: async () => {
      const response = await calendarService.getICloudConnectionStatus();
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });

  /**
   * Step 1: Initiate OAuth flow
   */
  const connectICloudCalendar = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get authorization URL and state from backend
      const response = await calendarService.getICloudOAuthAuthorizationUrl();
      const { authUrl, state } = response.data;

      // Save state in localStorage for validation in callback
      localStorage.setItem(OAUTH_STATE_KEY, state);

      // Redirect to iCloud authorization page
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating iCloud OAuth flow:', err);
      setError(err.message || 'Error al conectar con iCloud Calendar');
      setIsConnecting(false);
    }
  }, []);

  /**
   * Step 2: Handle OAuth callback
   */
  const callbackMutation = useMutation({
    mutationFn: async ({ code, state }) => {
      // Validate state token to prevent CSRF
      const savedState = localStorage.getItem(OAUTH_STATE_KEY);
      if (!savedState || savedState !== state) {
        throw new Error('Invalid state token - possible CSRF attack');
      }

      // Exchange code for tokens
      const response = await calendarService.handleICloudOAuthCallback(code, state);

      // Clear state from localStorage
      localStorage.removeItem(OAUTH_STATE_KEY);

      return response.data;
    },
    onSuccess: () => {
      // Invalidate calendar and events queries to refetch
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['all-calendar-events'] });
      setError(null);
    },
    onError: (err) => {
      console.error('iCloud OAuth callback error:', err);
      setError(err.message || 'Error al procesar autenticación');
      localStorage.removeItem(OAUTH_STATE_KEY);
    },
  });

  /**
   * Disconnect iCloud Calendar
   */
  const disconnectMutation = useMutation({
    mutationFn: () => calendarService.disconnectICloudCalendar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      localStorage.removeItem(OAUTH_STATE_KEY);
    },
    onError: (err) => {
      console.error('Disconnect error:', err);
      setError(err.message || 'Error al desconectar iCloud Calendar');
    },
  });

  return {
    // OAuth flow
    connectICloudCalendar,
    handleOAuthCallback: callbackMutation.mutate,
    isHandlingCallback: callbackMutation.isPending,

    // Disconnect
    disconnectICloudCalendar: disconnectMutation.mutate,
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

export default useICloudCalendar;

