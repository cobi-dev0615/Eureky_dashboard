import { useQuery } from '@tanstack/react-query';
import { calendarService } from '../../../shared/services/calendars';
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

/**
 * Hook for fetching events for a specific calendar
 */
export const useCalendarEvents = (calendarId, options = {}) => {
  const { dateRange } = options;

  // Calculate date range (default to current month ± 1 month)
  const start = dateRange?.start || subMonths(startOfMonth(new Date()), 1);
  const end = dateRange?.end || addMonths(endOfMonth(new Date()), 1);

  return useQuery({
    queryKey: ['calendar-events', calendarId, start.toISOString(), end.toISOString()],
    queryFn: () => calendarService.getCalendarEvents(calendarId, {
      start: start.toISOString(),
      end: end.toISOString(),
    }),
    enabled: !!calendarId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching all events from all calendars
 */
export const useAllCalendarEvents = (options = {}) => {
  const { dateRange } = options;

  // Calculate date range (default to current month ± 1 month)
  const start = dateRange?.start || subMonths(startOfMonth(new Date()), 1);
  const end = dateRange?.end || addMonths(endOfMonth(new Date()), 1);

  return useQuery({
    queryKey: ['all-calendar-events', start.toISOString(), end.toISOString()],
    queryFn: () => calendarService.getAllEvents({
      start: start.toISOString(),
      end: end.toISOString(),
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
