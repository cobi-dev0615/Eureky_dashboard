export const validateRegisterForm = (data) => {
  const errors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

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
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
};