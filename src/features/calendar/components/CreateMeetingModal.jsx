import { useState, useEffect } from 'react';
import { X, Video, Users, Calendar, Clock } from 'lucide-react';
import { format, addHours } from 'date-fns';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { useCreateMeeting } from '../hooks/useGoogleMeet';
import { useCalendars } from '../hooks/useCalendars';
import { useNotifications } from '../../../shared/contexts/AppContext';

const CreateMeetingModal = ({ onClose, defaultStart, defaultCalendarId }) => {
  const { addNotification } = useNotifications();
  const createMeetingMutation = useCreateMeeting();

  // Fetch user's calendars
  const { data: calendarsData } = useCalendars({
    isActive: true,
    syncEnabled: true,
  });

  const calendars = calendarsData?.data?.calendars || [];

  // Initialize default dates
  const now = new Date();
  const defaultStartDate = defaultStart || now;
  const defaultEndDate = addHours(defaultStartDate, 1);

  // Get default calendar (primary or first one)
  const getDefaultCalendar = () => {
    if (defaultCalendarId) return defaultCalendarId;
    if (calendars.length === 0) return '';
    const primary = calendars.find((cal) => cal.isPrimary);
    return primary?.id || calendars[0]?.id || '';
  };

  const [formData, setFormData] = useState({
    calendarId: '',
    summary: '',
    description: '',
    startDateTime: format(defaultStartDate, "yyyy-MM-dd'T'HH:mm"),
    endDateTime: format(defaultEndDate, "yyyy-MM-dd'T'HH:mm"),
    attendees: '',
  });

  const [errors, setErrors] = useState({});

  // Set default calendar when calendars are loaded
  useEffect(() => {
    if (calendars.length > 0 && !formData.calendarId) {
      const defaultCal = getDefaultCalendar();
      if (defaultCal) {
        setFormData((prev) => ({ ...prev, calendarId: defaultCal }));
      }
    }
  }, [calendars]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.calendarId) {
      newErrors.calendarId = 'Debes seleccionar un calendario';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'El título es requerido';
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = 'La fecha de inicio es requerida';
    }

    if (!formData.endDateTime) {
      newErrors.endDateTime = 'La fecha de fin es requerida';
    }

    if (formData.startDateTime && formData.endDateTime) {
      const start = new Date(formData.startDateTime);
      const end = new Date(formData.endDateTime);
      if (end <= start) {
        newErrors.endDateTime = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Parse attendees (comma or semicolon separated emails)
      const attendeesArray =
        formData.attendees
          .split(/[,;]/)
          .map((email) => email.trim())
          .filter((email) => email.length > 0)
          .map((email) => ({ email })) || [];

      const meetingData = {
        calendarId: formData.calendarId,
        summary: formData.summary,
        description: formData.description || undefined,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: new Date(formData.endDateTime).toISOString(),
        attendees: attendeesArray.length > 0 ? attendeesArray : undefined,
      };

      const response = await createMeetingMutation.mutateAsync(meetingData);

      addNotification({
        type: 'success',
        message: 'Meeting creado exitosamente',
        description: response?.meeting?.meetLink
          ? 'El enlace de Google Meet se ha generado'
          : undefined,
      });

      // Show meet link if available
      if (response?.meeting?.meetLink) {
        // You could open the link or show it in a success modal
        console.log('Google Meet Link:', response.meeting.meetLink);
      }

      onClose();
    } catch (error) {
      const isAuthError = error.message?.includes('sesión') ||
                          error.message?.includes('expirado') ||
                          error.message?.includes('reconecta');

      addNotification({
        type: 'error',
        message: isAuthError ? 'Sesión expirada' : 'Error al crear el meeting',
        description: error.message || 'Por favor intenta de nuevo',
      });

      // If it's an auth error, suggest reconnecting
      if (isAuthError) {
        console.error('Google Calendar session expired. User needs to reconnect.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear Google Meet</h2>
              <p className="text-sm text-gray-600">
                Se generará automáticamente un enlace de reunión
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={createMeetingMutation.isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Calendar Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendario
              <span className="text-red-500">*</span>
            </label>
            <select
              name="calendarId"
              value={formData.calendarId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.calendarId ? 'border-red-300' : 'border-gray-300'
              }`}
              required
              disabled={createMeetingMutation.isPending || calendars.length === 0}
            >
              <option value="">Selecciona un calendario</option>
              {calendars.map((calendar) => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.calendarName}
                  {calendar.isPrimary ? ' (Principal)' : ''}
                </option>
              ))}
            </select>
            {errors.calendarId && (
              <p className="text-sm text-red-600">{errors.calendarId}</p>
            )}
            {calendars.length === 0 && (
              <p className="text-sm text-yellow-600">
                No tienes calendarios disponibles. Conecta Google Calendar primero.
              </p>
            )}
          </div>

          {/* Title */}
          <Input
            label="Título del meeting"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Ej: Reunión de equipo semanal"
            error={errors.summary}
            required
            disabled={createMeetingMutation.isPending}
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Agrega una descripción (opcional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              disabled={createMeetingMutation.isPending}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Fecha y hora de inicio
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.startDateTime ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                disabled={createMeetingMutation.isPending}
              />
              {errors.startDateTime && (
                <p className="text-sm text-red-600">{errors.startDateTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Fecha y hora de fin
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.endDateTime ? 'border-red-300' : 'border-gray-300'
                }`}
                required
                disabled={createMeetingMutation.isPending}
              />
              {errors.endDateTime && (
                <p className="text-sm text-red-600">{errors.endDateTime}</p>
              )}
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Asistentes
            </label>
            <input
              type="text"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="ejemplo@email.com, otro@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              disabled={createMeetingMutation.isPending}
            />
            <p className="text-xs text-gray-500">
              Separa múltiples emails con comas. Los asistentes recibirán una invitación
              automática.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Video className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Google Meet automático
                </h4>
                <p className="text-sm text-blue-700">
                  Se generará un enlace de Google Meet automáticamente. El evento se agregará
                  a tu Google Calendar y los asistentes recibirán una invitación con el
                  enlace de la reunión.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMeetingMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createMeetingMutation.isPending}
              disabled={createMeetingMutation.isPending}
            >
              {createMeetingMutation.isPending ? 'Creando...' : 'Crear Meeting'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
