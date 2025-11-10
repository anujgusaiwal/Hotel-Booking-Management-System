import { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setFormData({
        full_name: response.data.full_name,
        email: response.data.email,
        phone: response.data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Note: Update profile endpoint would need to be added to backend
    setEditing(false);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">My Profile</h1>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        {!editing ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Full Name:</span>
                  <p className="text-lg text-gray-800 dark:text-white">{profile?.full_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="text-lg text-gray-800 dark:text-white">{profile?.email}</p>
                </div>
                {profile?.phone && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                    <p className="text-lg text-gray-800 dark:text-white">{profile.phone}</p>
                  </div>
                )}
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
                    <p className="text-lg text-gray-800 dark:text-white capitalize">{profile?.role || 'customer'}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="flex space-x-4">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}

