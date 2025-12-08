import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Settings as SettingsIcon, Calendar as CalendarIcon, Video, AlertTriangle } from 'lucide-react';
import { useCalendars } from './hooks/useCalendars';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { useAllCalendarEvents } from './hooks/useCalendarEvents';
import CalendarView from './components/CalendarView';
import CalendarSettings from './components/CalendarSettings';
import CreateMeetingModal from './components/CreateMeetingModal';
import EventModal from './components/EventModal';
import Button from '../../shared/components/ui/Button';
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

const Calendar = () => {
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlotStart, setSelectedSlotStart] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: subMonths(startOfMonth(new Date()), 1),
    end: addMonths(endOfMonth(new Date()), 1),
  });

  // Fetch calendars
  const { data: calendarsData, isLoading, error, refetch } = useCalendars({
    isActive: true,
    syncEnabled: true,
  });

  const {
    syncAllCalendars,
    isSyncing,
    connectGoogleCalendar,
    isConnecting,
    needsReconnection,
    connectionStatus,
  } = useGoogleCalendar();

  // Fetch events for all calendars
  const { data: eventsData, isLoading: isLoadingEvents } = useAllCalendarEvents({ dateRange });

  const calendars = calendarsData?.data?.calendars || [];
  const hasCalendars = calendars.length > 0;
  const hasInactiveCalendars = calendars.some((cal) => !cal.isActive);
  const showReconnectionWarning = hasInactiveCalendars || needsReconnection || (connectionStatus?.inactiveCalendars > 0);

  const handleReconnect = () => {
    connectGoogleCalendar();
  };

  // Extract events from response
  const allEvents = useMemo(() => {
    return eventsData?.data?.events || [];
  }, [eventsData]);

  console.log('Calendar index - calendarsData:', calendarsData);
  console.log('Calendar index - calendars:', calendars);
  console.log('Calendar index - selectedCalendar:', selectedCalendar);
  console.log('Calendar index - eventsData:', eventsData);
  console.log('Calendar index - allEvents:', allEvents);

  // Set the first calendar as selected by default
  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendar) {
      const primary = calendars.find(cal => cal.isPrimary) || calendars[0];
      console.log('Setting selected calendar:', primary);
      setSelectedCalendar(primary);
    }
  }, [calendars, selectedCalendar]);

  const handleNavigate = (newDate) => {
    // Update date range when user navigates to different month
    const start = subMonths(startOfMonth(newDate), 1);
    const end = addMonths(endOfMonth(newDate), 1);
    setDateRange({ start, end });
  };

  const handleSync = () => {
    syncAllCalendars();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    setSelectedEvent(event);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Selected slot:', slotInfo);
    // No hacer nada al hacer click en un slot vacío
    // El usuario debe usar el botón "Crear Meeting"
  };

  const handleCreateMeetingClick = () => {
    setShowCreateMeeting(true);
  };

  const handleCloseCreateMeeting = () => {
    setShowCreateMeeting(false);
    setSelectedSlotStart(null);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Cargando calendarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar calendarios: {error.message}</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  // Show settings/connect screen if no calendars or settings is open
  if (!hasCalendars || showSettings) {
    return (
      <div className="h-full">
        {hasCalendars && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <Button variant="outline" onClick={toggleSettings}>
              ← Volver al Calendario
            </Button>
          </div>
        )}
        <CalendarSettings />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Inactive Calendar Warning */}
      {showReconnectionWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Tu sesión de Google Calendar ha expirado
              </p>
              <p className="text-sm text-yellow-700">
                Por favor reconecta tu cuenta para continuar creando meetings y sincronizando eventos.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconnect}
              disabled={isConnecting}
              className="bg-white hover:bg-yellow-100 border-yellow-300"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Reconectar Ahora'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-6 h-6 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
            <p className="text-sm text-gray-600">
              Administra tus eventos sincronizados con Google Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedCalendar && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCalendar.backgroundColor || '#3b82f6' }}
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedCalendar.calendarName}
              </span>
            </div>
          )}

          {showReconnectionWarning ? (
            <Button
              onClick={handleReconnect}
              disabled={isConnecting}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reconectar Google
                </>
              )}
            </Button>
          ) : (
            <>
              <Button onClick={handleCreateMeetingClick}>
                <Video className="w-4 h-4 mr-2" />
                Crear Google Meet
              </Button>

              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`}
                />
                Sincronizar
              </Button>
            </>
          )}

          <Button variant="outline" onClick={toggleSettings}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 p-6 overflow-hidden">
        {isLoadingEvents ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Cargando eventos...</p>
            </div>
          </div>
        ) : (
          <CalendarView
            events={allEvents}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateMeeting && (
        <CreateMeetingModal
          onClose={handleCloseCreateMeeting}
          defaultStart={selectedSlotStart}
        />
      )}

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseEventModal} />
      )}
    </div>
  );
};

export default Calendar;
