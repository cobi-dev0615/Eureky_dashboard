import { Calendar, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import Button from '../../../shared/components/ui/Button';

const GoogleCalendarConnect = ({ onSuccess }) => {
  const { connectGoogleCalendar, isConnecting, error, isSuccess } = useGoogleCalendar();

  const handleConnect = () => {
    connectGoogleCalendar();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm p-8">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Conectar Google Calendar
          </h2>
          <p className="text-gray-600">
            Sincroniza tu Google Calendar para ver y administrar tus eventos desde Eureky
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-red-800">Error al conectar</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-green-800">¡Conectado exitosamente!</p>
              <p className="text-sm text-green-600 mt-1">
                Tu calendario se está sincronizando...
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleConnect}
            disabled={isConnecting || isSuccess}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Conectar con Google Calendar
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 space-y-2">
            <p>Al conectar, autorizas a Eureky para:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Ver tus calendarios de Google</li>
              <li>Leer y mostrar tus eventos</li>
              <li>Crear y editar eventos en tu nombre</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarConnect;
