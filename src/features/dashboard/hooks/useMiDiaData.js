import { useMemo } from 'react';
import { useAllUserItems } from '@/features/lists/hooks/useListItemsQuery';
import { useAllCalendarEvents } from '@/features/calendar/hooks/useCalendarEvents';
import { useCalendars } from '@/features/calendar/hooks/useCalendars';

export const useMiDiaData = () => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const { 
    data: allTasks = [], 
    isLoading: isLoadingTasks,
    error: tasksError 
  } = useAllUserItems({
    isCompleted: false,
    limit: 100,
    orderBy: 'scheduledAt',
    orderDirection: 'asc'
  });

  const { 
    data: calendarsData, 
    isLoading: isLoadingCalendars,
    error: calendarsError 
  } = useCalendars({ 
    isActive: true, 
    syncEnabled: true,
    limit: 20
  });

  const { 
    data: eventsData, 
    isLoading: isLoadingEvents,
    error: eventsError 
  } = useAllCalendarEvents({
    dateRange: {
      start: todayStart,
      end: todayEnd
    }
  });

  const todayTasks = useMemo(() => {
    return allTasks.filter(task => {
      if (!task.scheduledAt) return false;
      
      const taskDate = new Date(task.scheduledAt);
      return taskDate >= todayStart && taskDate < todayEnd;
    });
  }, [allTasks, todayStart, todayEnd]);

  const calendars = calendarsData?.data?.calendars || calendarsData?.calendars || [];
  const activeCalendars = calendars.filter(cal => cal.isActive && cal.syncEnabled);
  const isCalendarConnected = activeCalendars.length > 0;

  const calendarEvents = eventsData?.data?.events || eventsData?.events || [];

  return {
    todayTasks,
    calendarEvents,
    isCalendarConnected,
    activeCalendars,
    isLoading: isLoadingTasks || isLoadingCalendars || isLoadingEvents,
    errors: {
      tasksError,
      calendarsError,
      eventsError
    }
  };
};

