import React, { useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { LogIn, Building2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { actions } = useAppState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = actions.login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <Building2 className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Abstract Group
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            IT Ticket Management System
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                  placeholder="Enter your password"
                  style={{WebkitTextSecurity: showPassword ? 'none' : 'disc'}}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                💡 All users have password: 123
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm font-medium text-gray-700 mb-3">
                🚀 Demo Users
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                <div className="flex justify-between items-center py-1 px-2 bg-white/50 rounded-lg">
                  <span className="font-medium">CEO:</span>
                  <span className="text-blue-600">minan@abstractgroup.com</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white/50 rounded-lg">
                  <span className="font-medium">COO:</span>
                  <span className="text-blue-600">rashmi@abstractgroup.com</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white/50 rounded-lg">
                  <span className="font-medium">L2 Manager:</span>
                  <span className="text-blue-600">anjali@abstractgroup.com</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white/50 rounded-lg">
                  <span className="font-medium">L1 Manager:</span>
                  <span className="text-blue-600">deepak@abstractgroup.com</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white/50 rounded-lg">
                  <span className="font-medium">IT Person:</span>
                  <span className="text-blue-600">rahul@abstractgroup.com</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 bg-white/50 rounded-lg">
                  <span className="font-medium">Employee:</span>
                  <span className="text-blue-600">tara@abstractgroup.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
