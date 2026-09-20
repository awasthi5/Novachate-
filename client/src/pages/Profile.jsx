import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiUser, FiMail, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { users } from '../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const { data } = await users.updateAvatar(fd);
        updateUser({ avatar: data.avatar });
      }

      const { data } = await users.updateProfile(formData);
      updateUser(data);
      setMsg({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto glass dark:glass-dark rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center">
          <button onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors mr-4">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Edit Profile</h1>
        </div>

        <div className="p-6 sm:p-10">
          {msg.text && (
            <div className={`mb-6 p-4 rounded-lg ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-700">
                  {avatarPreview ? (
                    <img src={avatarPreview.startsWith('blob:') || avatarPreview.startsWith('http') ? avatarPreview : `http://localhost:5000${avatarPreview}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-full h-full p-6 text-gray-400" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <FiCamera className="w-8 h-8" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click to change avatar</span>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar" placeholder="Tell us about yourself..."></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
