import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiShield, FiFile, FiLayout } from 'react-icons/fi';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Connect. <span className="text-gradient">Chat.</span> Share.
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Experience real-time messaging reimagined. Secure, fast, and beautiful communication for modern teams and friends.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/30">
              Get Started for Free
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold transition-all shadow border border-gray-200 dark:border-gray-700">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <FiMessageCircle className="w-8 h-8" />, title: 'Real-time Messaging', desc: 'Lightning fast message delivery with typing indicators and read receipts.' },
            { icon: <FiShield className="w-8 h-8" />, title: 'Secure Encryption', desc: 'Your conversations are private and secured with industry standard encryption.' },
            { icon: <FiFile className="w-8 h-8" />, title: 'File Sharing', desc: 'Share photos, documents, and media seamlessly within your chats.' },
            { icon: <FiLayout className="w-8 h-8" />, title: 'Beautiful UI', desc: 'A clean, modern interface with dark mode support built for focus.' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl glass dark:glass-dark hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiMessageCircle className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl dark:text-white">Novachate</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">© {new Date().getFullYear()} Novachate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
