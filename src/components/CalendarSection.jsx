import { useState, useEffect } from "react";
import { ExternalLink, ChevronRight, RefreshCw, AlertCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ConnectCalendarModal } from "./ConnectCalendarModal";
import { useGoogleCalendar } from "@/features/calendar/hooks/useGoogleCalendar";
import { useOutlookCalendar } from "@/features/calendar/hooks/useOutlookCalendar";
import { useICloudCalendar } from "@/features/calendar/hooks/useICloudCalendar";
import { useCalendars } from "@/features/calendar/hooks/useCalendars";
import { useAllCalendarEvents } from "@/features/calendar/hooks/useCalendarEvents";

export const CalendarSection = ({ events: propEvents }) => {
  const today = new Date();
  const dayName = today.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
  const dayNumber = today.getDate();

  // Hooks for calendar management
  const { 
    connectGoogleCalendar, 
    isConnecting: isConnectingGoogle, 
    error: googleError,
    connectionStatus 
  } = useGoogleCalendar();

  const {
    connectOutlookCalendar,
    isConnecting: isConnectingOutlook,
    error: outlookError
  } = useOutlookCalendar();

  const {
    connectICloudCalendar,
    isConnecting: isConnectingICloud,
    error: iCloudError
  } = useICloudCalendar();

  const isConnecting = isConnectingGoogle || isConnectingOutlook || isConnectingICloud;
  const oauthError = googleError || outlookError || iCloudError;

  // Fetch calendars from backend
  const { 
    data: calendarsData, 
    isLoading: isLoadingCalendars,
    error: calendarsError 
  } = useCalendars({ 
    isActive: true, 
    syncEnabled: true,
    limit: 20,
    offset: 0
  });

  // Fetch events from all calendars
  const { 
    data: eventsData, 
    isLoading: isLoadingEvents 
  } = useAllCalendarEvents({
    dateRange: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    }
  });

  // Get active calendars
  const calendars = calendarsData?.data?.calendars || calendarsData?.calendars || [];
  const activeCalendars = calendars.filter(cal => cal.isActive && cal.syncEnabled);
  const isCalendarConnected = activeCalendars.length > 0;

  // Use events from API or fallback to prop events
  const events = eventsData?.data?.events || eventsData?.events || propEvents || [];

  // Format events for display
  const formattedEvents = events.map(event => {
    const startTime = event.start ? new Date(event.start) : null;
    const endTime = event.end ? new Date(event.end) : null;
    
    let timeString = '';
    if (startTime && endTime) {
      const startHour = startTime.getHours().toString().padStart(2, '0');
      const startMin = startTime.getMinutes().toString().padStart(2, '0');
      const endHour = endTime.getHours().toString().padStart(2, '0');
      const endMin = endTime.getMinutes().toString().padStart(2, '0');
      timeString = `${startHour}:${startMin}-${endHour}:${endMin}`;
    }

    return {
      time: timeString,
      title: event.summary || event.title || 'Sin título',
      badge: event.meetLink ? 'Únirse' : null,
      meetLink: event.meetLink
    };
  });

  const handleConnectGoogleCalendar = () => {
    connectGoogleCalendar();
  };

  const handleConnectOutlookCalendar = () => {
    connectOutlookCalendar();
  };

  const handleConnectICloudCalendar = () => {
    connectICloudCalendar();
  };

  return (
    <section className="mb-8 px-6 lg:px-0">
      <h2 className="lg:text-[20px] text-[16px] font-medium mb-4 tracking-[-0.2px]" style={{fontFamily: "'DM Sans', sans-serif"}}>Calendario</h2>
      
      {isLoadingCalendars ? (
        <div className="bg-card rounded-[8px] h-[107px] lg:h-[107px] flex items-center justify-center w-full lg:w-auto">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Cargando calendarios...</span>
          </div>
        </div>
      ) : !isCalendarConnected ? (
        <div className="bg-card rounded-[8px] h-[107px] flex items-center px-6 lg:px-6 w-full lg:w-auto">
          <div className="flex items-center gap-6 w-full">
            <div className="flex flex-col items-center">
              <span className="text-[18px] font-bold leading-[1.6] tracking-normal" style={{fontFamily: "'DM Sans', sans-serif"}}>{dayName}</span>
              <span className="text-[40px] font-bold leading-[1.2] tracking-[-0.8px]" style={{fontFamily: "'DM Sans', sans-serif"}}>{dayNumber}</span>
            </div>
            <div className="flex-1">
              <p className="text-[16px] mb-2 leading-[1.5] w-[197px] lg:w-auto" style={{fontFamily: "'DM Sans', sans-serif"}}>No tienes calendarios sincronizados</p>
              {oauthError && (
                <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{oauthError}</p>
                </div>
              )}
              <ConnectCalendarModal
                onConnectGoogle={handleConnectGoogleCalendar}
                onConnectOutlook={handleConnectOutlookCalendar}
                onConnectICloud={handleConnectICloudCalendar}
                isConnecting={isConnecting}
              >
                <Button 
                  variant="link" 
                  className="text-[#8465FF] p-0 h-auto hover:no-underline text-[14px] font-bold leading-[20px]"
                  style={{fontFamily: "'DM Sans', sans-serif"}}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                      Conectando...
                    </>
                  ) : (
                    "Conectar calendario"
                  )}
                </Button>
              </ConnectCalendarModal>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-[8px] min-h-[117px] flex items-start px-6 py-6 lg:px-6 lg:py-4 w-full lg:w-auto">
          <div className="flex items-start gap-6 w-full">
            <div className="flex flex-col items-center pt-0 lg:pt-1">
              <span className="text-[18px] font-bold leading-[1.6] tracking-normal" style={{fontFamily: "'DM Sans', sans-serif"}}>{dayName}</span>
              <span className="text-[40px] font-bold leading-[1.2] tracking-[-0.8px]" style={{fontFamily: "'DM Sans', sans-serif"}}>{dayNumber}</span>
            </div>
            <div className="flex-1">
              {isLoadingEvents ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Cargando eventos...</span>
                </div>
              ) : formattedEvents.length > 0 ? (
                <div className="space-y-2 lg:space-y-3">
                  {formattedEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-[27px] lg:gap-4">
                      <span className={cn(
                        "text-[14px] leading-[20px] min-w-[90px]",
                        event.isCompleted ? "line-through text-[#34324a]" : "text-foreground"
                      )} style={{fontFamily: "'DM Sans', sans-serif"}}>{event.time}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[16px] leading-[1.5] font-normal",
                          event.isCompleted ? "line-through text-[#34324a]" : "text-foreground"
                        )} style={{fontFamily: "'DM Sans', sans-serif"}}>{event.title}</span>
                        {event.meetLink && !event.isCompleted && (
                          <Share2 className="w-5 h-5 text-[#8465FF] cursor-pointer hover:opacity-80" />
                        )}
                      </div>
                      {event.badge && !event.isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-[28px] px-6 py-1 text-[14px] leading-[20px] bg-[#8465FF] text-white border-0 rounded-[40px] hover:bg-[#8465FF]/90"
                          style={{fontFamily: "'DM Sans', sans-serif"}}
                          onClick={() => event.meetLink && window.open(event.meetLink, '_blank')}
                        >
                          {event.badge}
                        </Button>
                      )}
                      {event.meetLink && !event.badge && (
                        <ExternalLink 
                          className="w-4 h-4 text-primary ml-auto cursor-pointer hover:opacity-80" 
                          onClick={() => window.open(event.meetLink, '_blank')}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay eventos programados para hoy</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
