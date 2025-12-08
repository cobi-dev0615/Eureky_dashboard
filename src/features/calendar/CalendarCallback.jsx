import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { useOutlookCalendar } from './hooks/useOutlookCalendar';
import { useICloudCalendar } from './hooks/useICloudCalendar';

/**
 * OAuth Callback Page
 * Receives redirect from calendar providers after user authorization
 * URL: /calendar/callback?code=xxx&state=xxx&provider=google|outlook|icloud
 */
const CalendarCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  const provider = (searchParams.get('provider') || 'google').toLowerCase();

  // Initialize hooks for all providers (hooks must not be called conditionally)
  const google = useGoogleCalendar();
  const outlook = useOutlookCalendar();
  const icloud = useICloudCalendar();

  // Select the active provider based on URL param
  const {
    handleOAuthCallback,
    isHandlingCallback,
    error,
    isSuccess,
  } =
    provider === 'outlook'
      ? outlook
      : provider === 'icloud'
      ? icloud
      : google;

  const providerLabel =
    provider === 'outlook'
      ? 'Outlook Calendar'
      : provider === 'icloud'
      ? 'iCloud Calendar'
      : 'Google Calendar';

  useEffect(() => {
    const processCallback = async () => {
      // Extract code and state from URL parameters
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      // Check if user denied access
      if (errorParam) {
        setStatus('error');
        console.error('OAuth error:', errorParam);
        setTimeout(() => navigate('/dashboard/calendar'), 3000);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        console.error('Missing code or state in callback');
        setTimeout(() => navigate('/dashboard/calendar'), 3000);
        return;
      }

      // Send code and state to backend
      handleOAuthCallback({ code, state });
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, navigate, provider]);

  // Redirect to calendar on success
  useEffect(() => {
    if (isSuccess) {
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard/calendar');
      }, 2000);
    }
  }, [isSuccess, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setStatus('error');
      setTimeout(() => {
        navigate('/dashboard/calendar');
      }, 5000);
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Processing State */}
        {status === 'processing' && !error && (
          <div className="text-center">
            <RefreshCw className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Conectando con {providerLabel}
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras configuramos tu calendario...
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>✓ Autenticación completada</p>
              <p className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Importando calendarios...
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && !error && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Conexión exitosa!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu {providerLabel} ha sido conectado correctamente.
            </p>
            <div className="mt-6 space-y-2 text-sm text-green-600">
              <p>✓ Calendarios importados</p>
              <p>✓ Sincronización activa</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Redirigiendo a tu calendario...
            </p>
          </div>
        )}

        {/* Error State */}
        {(status === 'error' || error) && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error en la conexión
            </h2>
            <p className="text-gray-600 mb-4">
              {error || `No se pudo conectar con ${providerLabel}`}
            </p>
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                {error || 'Ocurrió un error al procesar la autenticación. Por favor intenta nuevamente.'}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Redirigiendo al calendario en 5 segundos...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarCallback;
