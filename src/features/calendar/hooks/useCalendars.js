import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '../../../shared/services/calendars';

/**
 * Hook for creating a new calendar
 */
export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calendarData) => calendarService.createCalendar(calendarData),
    onSuccess: () => {
      // Invalidate and refetch calendars list
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    },
  });
};

/**
 * Hook for fetching calendars
 */
export const useCalendars = (params = {}) => {
  return useQuery({
    queryKey: ['calendars', params],
    queryFn: () => calendarService.getCalendars(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching a single calendar
 */
export const useCalendar = (calendarId) => {
  return useQuery({
    queryKey: ['calendar', calendarId],
    queryFn: () => calendarService.getCalendarById(calendarId),
    enabled: !!calendarId,
  });
};

/**
 * Hook for updating calendar
 */
export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, data }) => calendarService.updateCalendar(calendarId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['calendar', variables.calendarId] });
    },
  });
};

/**
 * Hook for deleting calendar
 */
export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calendarId) => calendarService.deleteCalendar(calendarId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    },
  });
};

/**
 * Hook for setting primary calendar
 */
export const useSetPrimaryCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calendarId) => calendarService.setPrimaryCalendar(calendarId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    },
  });
};

/**
 * Hook for syncing calendar
 */
export const useSyncCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calendarId) => calendarService.syncCalendar(calendarId),
    onSuccess: (data, calendarId) => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['calendar', calendarId] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events', calendarId] });
    },
  });
};
