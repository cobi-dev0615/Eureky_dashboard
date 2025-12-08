import LoginForm from './components/LoginForm';

const Login = () => {
  const handleLoginSuccess = (result) => {
    console.log('Login successful:', result);
    
    if (result.success) {
      // Show success message
      console.log(`Bienvenido ${result.data.name}!`);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default Login;