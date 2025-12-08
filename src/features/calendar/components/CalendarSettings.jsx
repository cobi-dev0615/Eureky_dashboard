import { useState } from 'react';
import { Calendar, RefreshCw, Trash2, AlertCircle, CheckCircle, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { useCalendars, useUpdateCalendar } from '../hooks/useCalendars';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import Button from '../../../shared/components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calendarService } from '../../../shared/services/calendars';

const CalendarSettings = () => {
  const { data: calendarsData, isLoading } = useCalendars({ isActive: true });
  const {
    connectGoogleCalendar,
    syncAllCalendars,
    disconnectGoogleCalendar,
    isSyncing,
    isDisconnecting,
    isConnecting,
    error,
    needsReconnection,
    connectionStatus,
  } = useGoogleCalendar();

  const updateCalendarMutation = useUpdateCalendar();
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [syncingCalendarId, setSyncingCalendarId] = useState(null);

  const calendars = calendarsData?.data?.calendars || [];
  console.log("calendars", calendars);
  const hasCalendars = calendars.length > 0;

  console.log("hasCalendars", hasCalendars);

  const handleConnect = () => {
    connectGoogleCalendar();
  };

  const handleSync = () => {
    syncAllCalendars();
  };

  const handleDisconnect = () => {
    disconnectGoogleCalendar();
    setShowDisconnectConfirm(false);
  };

  const formatSyncDate = (date) => {
    if (!date) return 'Nunca';
    try {
      return format(new Date(date), "d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleSyncSpecificCalendar = async (calendarId) => {
    try {
      setSyncingCalendarId(calendarId);
      await calendarService.syncSpecificCalendar(calendarId);
    } catch (error) {
      console.error('Error syncing calendar:', error);
    } finally {
      setSyncingCalendarId(null);
    }
  };

  const handleToggleCalendarSync = (calendar) => {
    updateCalendarMutation.mutate({
      calendarId: calendar.id,
      data: {
        syncEnabled: !calendar.syncEnabled,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración de Calendario
        </h2>
        <p className="text-gray-600">
          Gestiona tu integración con Google Calendar
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            {needsReconnection && (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                size="sm"
                className="mt-3"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Reconectando...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Reconectar Google Calendar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Warning for inactive calendars */}
      {connectionStatus?.inactiveCalendars > 0 && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">Atención</p>
            <p className="text-sm text-yellow-700 mt-1">
              {connectionStatus.inactiveCalendars} calendario{connectionStatus.inactiveCalendars !== 1 ? 's' : ''} necesita{connectionStatus.inactiveCalendars === 1 ? '' : 'n'} ser reconectado{connectionStatus.inactiveCalendars !== 1 ? 's' : ''}.
            </p>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              size="sm"
              variant="outline"
              className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Reconectando...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Reconectar Calendarios
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* No Calendars - Connect Section */}
      {!hasCalendars && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Conecta tu Google Calendar
            </h3>
            <p className="text-gray-600 mb-6">
              Sincroniza tus calendarios de Google para ver y administrar tus eventos desde Eureky
            </p>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full sm:w-auto"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Conectar Google Calendar
                </>
              )}
            </Button>
            <div className="mt-6 text-xs text-gray-500 space-y-2">
              <p>Al conectar, autorizas a Eureky para:</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>Ver tus calendarios de Google</li>
                <li>Leer y mostrar tus eventos</li>
                <li>Crear y editar eventos en tu nombre</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Connected Calendars */}
      {hasCalendars && (
        <>
          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Google Calendar conectado</p>
                <p className="text-sm text-gray-600">
                  {calendars.length} calendario{calendars.length !== 1 ? 's' : ''} sincronizado{calendars.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Reconectar Google
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sincronizar Todo
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDisconnectConfirm(true)}
                disabled={isDisconnecting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Desconectar
              </Button>
            </div>
          </div>

          {/* Calendar List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Calendarios Sincronizados</h3>
            </div>
            {calendars.map((calendar) => (
              <div key={calendar.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: calendar.backgroundColor || '#3b82f6' }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {calendar.calendarName}
                      </h4>
                      {calendar.calendarDescription && (
                        <p className="text-sm text-gray-600 mt-0.5">
                          {calendar.calendarDescription}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Última sincronización: {formatSyncDate(calendar.lastSyncAt)}
                        </span>
                        {calendar.isPrimary && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            Principal
                          </span>
                        )}
                        {calendar.accessRole && (
                          <span className="capitalize">{calendar.accessRole}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCalendarSync(calendar)}
                      disabled={updateCalendarMutation.isPending}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      title={calendar.syncEnabled ? 'Desactivar sincronización' : 'Activar sincronización'}
                    >
                      {calendar.syncEnabled ? (
                        <Eye className="w-5 h-5 text-green-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSyncSpecificCalendar(calendar.id)}
                      disabled={syncingCalendarId === calendar.id}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      title="Sincronizar este calendario"
                    >
                      <RefreshCw
                        className={`w-5 h-5 text-blue-600 ${syncingCalendarId === calendar.id ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ¿Desconectar Google Calendar?
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Esto revocará el acceso a tus calendarios de Google y desactivará todos los calendarios sincronizados.
                  No podrás ver tus eventos hasta que vuelvas a conectar.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDisconnectConfirm(false)}
                disabled={isDisconnecting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDisconnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Desconectando...
                  </>
                ) : (
                  'Desconectar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSettings;
