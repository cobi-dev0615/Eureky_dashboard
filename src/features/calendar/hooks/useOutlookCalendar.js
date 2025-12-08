import { useState, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { calendarService } from '../../../shared/services/calendars';

const OAUTH_STATE_KEY = 'outlook_oauth_state';

/**
 * Hook for Outlook Calendar OAuth integration
 */
export const useOutlookCalendar = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [needsReconnection, setNeedsReconnection] = useState(false);
  const queryClient = useQueryClient();

  /**
   * Get calendar connection status
   */
  const { data: connectionStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['calendar-connection-status-outlook'],
    queryFn: async () => {
      const response = await calendarService.getOutlookConnectionStatus();
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });

  /**
   * Step 1: Initiate OAuth flow
   */
  const connectOutlookCalendar = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get authorization URL and state from backend
      const response = await calendarService.getOutlookOAuthAuthorizationUrl();
      const { authUrl, state } = response.data;

      // Save state in localStorage for validation in callback
      localStorage.setItem(OAUTH_STATE_KEY, state);

      // Redirect to Outlook authorization page
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating Outlook OAuth flow:', err);
      setError(err.message || 'Error al conectar con Outlook Calendar');
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
      const response = await calendarService.handleOutlookOAuthCallback(code, state);

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
      console.error('Outlook OAuth callback error:', err);
      setError(err.message || 'Error al procesar autenticación');
      localStorage.removeItem(OAUTH_STATE_KEY);
    },
  });

  /**
   * Disconnect Outlook Calendar
   */
  const disconnectMutation = useMutation({
    mutationFn: () => calendarService.disconnectOutlookCalendar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      localStorage.removeItem(OAUTH_STATE_KEY);
    },
    onError: (err) => {
      console.error('Disconnect error:', err);
      setError(err.message || 'Error al desconectar Outlook Calendar');
    },
  });

  return {
    // OAuth flow
    connectOutlookCalendar,
    handleOAuthCallback: callbackMutation.mutate,
    isHandlingCallback: callbackMutation.isPending,

    // Disconnect
    disconnectOutlookCalendar: disconnectMutation.mutate,
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

export default useOutlookCalendar;

