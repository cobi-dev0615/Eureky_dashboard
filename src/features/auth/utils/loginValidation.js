export const validateLoginForm = (data) => {
  const errors = {};

  // Phone validation
  const phoneRegex = /^\+\d{10,15}$/;
  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'El número de teléfono es requerido';
  } else if (!phoneRegex.test(data.phoneNumber)) {
    errors.phoneNumber = 'Ingresa un número válido (ej: +51970505654)';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'La contraseña es requerida';
  } else if (data.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errors;
};