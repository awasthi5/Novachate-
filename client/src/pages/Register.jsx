import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-md w-full space-y-8 glass dark:glass-dark p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join Novachate today</p>
        </div>
        
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <FiUser className="absolute top-3 left-3 text-gray-400" />
              <input name="name" type="text" required className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="relative">
              <FiUser className="absolute top-3 left-3 text-gray-400" />
              <input name="username" type="text" required className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input name="email" type="email" required className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email address" value={formData.email} onChange={handleChange} />
            </div>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input name="password" type={showPassword ? 'text' : 'password'} required className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Password" value={formData.password} onChange={handleChange} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input name="confirmPassword" type={showPassword ? 'text' : 'password'} required className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
