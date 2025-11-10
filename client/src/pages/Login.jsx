import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-300 hover:text-blue-200"
            >
              create a new account
            </Link>
          </p>
          <div className="mt-4 p-3 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-md border border-white/30">
            <p className="text-xs text-white mb-2 text-center">
              Quick Login:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    email: 'admin@hotel.com',
                    password: 'admin123'
                  });
                }}
                className="flex-1 text-xs px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    email: 'staff@hotel.com',
                    password: 'staff123'
                  });
                }}
                className="flex-1 text-xs px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                Staff
              </button>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            {(error || localError) && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                {error || localError}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

