import { X, Video } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '../../../shared/components/ui/Button';

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
        locale: es,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {event.summary || event.title || 'Sin título'}
            </h2>
            {event.description && (
              <p className="text-gray-600 mt-2">{event.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date and Time */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Fecha y hora</h3>
            <div className="space-y-1">
              {event.start?.dateTime && (
                <p className="text-gray-900">
                  <span className="font-medium">Inicio:</span>{' '}
                  {formatEventDate(event.start.dateTime)}
                </p>
              )}
              {event.end?.dateTime && (
                <p className="text-gray-900">
                  <span className="font-medium">Fin:</span>{' '}
                  {formatEventDate(event.end.dateTime)}
                </p>
              )}
              {event.start?.date && !event.start?.dateTime && (
                <p className="text-gray-900">
                  <span className="font-medium">Todo el día:</span>{' '}
                  {format(new Date(event.start.date), "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Ubicación</h3>
              <p className="text-gray-900">{event.location}</p>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Asistentes</h3>
              <div className="space-y-2">
                {event.attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-900">{attendee.email}</span>
                    {attendee.organizer && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Organizador
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Meet Link */}
          {event.hangoutLink && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Google Meet</h3>
              <a
                href={event.hangoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              >
                <Video className="w-4 h-4" />
                <span className="font-medium">Unirse a la reunión</span>
              </a>
            </div>
          )}

          {/* Calendar */}
          {event.calendarName && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Calendario</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: event.backgroundColor || '#3b82f6' }}
                />
                <span className="text-gray-900">{event.calendarName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          {event.htmlLink && (
            <Button
              variant="outline"
              onClick={() => window.open(event.htmlLink, '_blank')}
            >
              Abrir en Google Calendar
            </Button>
          )}
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
