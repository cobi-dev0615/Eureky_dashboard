import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import { useLogin } from '../hooks/useLogin';
import { validateLoginForm } from '../utils/loginValidation';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useLogin();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await login(formData);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Número de teléfono"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
          required
          placeholder="+51970505654"
        />

        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            required
            placeholder="Ingresa tu contraseña"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
          variant='primary'
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              Regístrate aquí
            </a>
          </p>
        </div>

        <div className="text-center">
          <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;