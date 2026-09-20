import { Link } from 'react-router-dom';
import { FiMessageCircle, FiMenu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass dark:glass-dark py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiMessageCircle className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl dark:text-white tracking-tight">Novachate</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <Link to="/login" className="text-gray-700 dark:text-gray-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-indigo-500/30">
              Sign up
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button className="text-gray-700 dark:text-gray-200">
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
