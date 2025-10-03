import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  role: 'admin' | 'restaurant_owner' | 'public_user';
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onSwitchToRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('Username and password are required');
      return;
    }
    
    const success = await login(formData, role);
    
    if (success) {
      toast.success('Login successful!');
      
      // Close the modal first
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      // For public users, redirect to home page after login
      if (role === 'public_user') {
        navigate('/');
      }
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'admin': return 'Admin Login';
      case 'restaurant_owner': return 'Restaurant Owner Login';
      case 'public_user': return 'User Login';
      default: return 'Login';
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{getRoleTitle()}</h2>
        <p className="text-gray-600 mt-2">
          Enter your username and password to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {role === 'admin' ? 'Admin Username/Email/Phone' : 'Username'}
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={role === 'admin' ? 'Enter admin credentials' : 'Enter username'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {role === 'admin' ? 'Admin Password' : 'Password'}
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={role === 'admin' ? 'Enter admin password' : 'Enter password'}
          />
          {role === 'restaurant_owner' && (
            <div className="text-right mt-1">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => {
                  const subject = encodeURIComponent('Password reset request - Restaurant Owner');
                  const body = encodeURIComponent(`Hello Admin,\n\nI forgot my restaurant owner password. Please reset my credentials and share them to this email.\n\nUsername: ${formData.username || '(not provided)'}\nRole: restaurant_owner\n\nThank you.`);
                  const url = `https://mail.google.com/mail/?view=cm&to=tablooofficial1@gmail.com&su=${subject}&body=${body}`;
                  window.open(url, '_blank');
                }}
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </button>

        {role === 'restaurant_owner' && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/restaurant-owner'}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        )}

        {role === 'public_user' && onSwitchToRegister && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;