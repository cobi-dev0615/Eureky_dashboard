import RegisterForm from './components/RegisterForm';

const Register = () => {
  const handleRegistrationSuccess = (result) => {
    console.log('Registration successful:', result);
    // Redirect to dashboard or show success message
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <RegisterForm onSuccess={handleRegistrationSuccess} />
      </div>
    </div>
  );
};

export default Register;