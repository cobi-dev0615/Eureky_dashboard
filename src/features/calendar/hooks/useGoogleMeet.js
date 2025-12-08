import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { googleMeetService } from '@/shared/services/googleMeet';

/**
 * Hook to create a Google Meet meeting
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingData) => googleMeetService.createMeeting(meetingData),
    onSuccess: () => {
      // Invalidate calendar events queries to refetch with new meeting
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['allCalendarEvents'] });
    },
  });
}

/**
 * Hook to get a specific Google Meet meeting
 */
export function useGetMeeting(calendarId, eventId, options = {}) {
  return useQuery({
    queryKey: ['googleMeet', calendarId, eventId],
    queryFn: () => googleMeetService.getMeeting(calendarId, eventId),
    enabled: !!calendarId && !!eventId && options.enabled !== false,
    ...options,
  });
}

/**
 * Hook to delete a Google Meet meeting
 */
export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, eventId }) =>
      googleMeetService.deleteMeeting(calendarId, eventId),
    onSuccess: () => {
      // Invalidate calendar events queries to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['allCalendarEvents'] });
    },
  });
}
