import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import useAuthStore from '../store/authStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roomForm, setRoomForm] = useState({
    title: '',
    room_type: 'standard',
    description: '',
    capacity: '',
    price_per_night: '',
    status: 'available',
    features: {},
    images: []
  });
  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'rooms') {
      fetchRooms();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, roomForm);
      } else {
        await api.post('/rooms', roomForm);
      }
      setShowRoomModal(false);
      setEditingRoom(null);
      resetRoomForm();
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete room');
      }
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      title: room.title,
      room_type: room.room_type || 'standard',
      description: room.description,
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      status: room.status,
      features: room.features || {},
      images: room.images || []
    });
    setShowRoomModal(true);
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const resetRoomForm = () => {
    setRoomForm({
      title: '',
      room_type: 'standard',
      description: '',
      capacity: '',
      price_per_night: '',
      status: 'available',
      features: {},
      images: []
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, userForm);
      } else {
        await api.post('/users', userForm);
      }
      setShowUserModal(false);
      setEditingUser(null);
      resetUserForm();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their bookings.')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      full_name: user.full_name,
      email: user.email,
      password: '', // Don't pre-fill password
      phone: user.phone || '',
      role: user.role
    });
    setShowUserModal(true);
  };

  const resetUserForm = () => {
    setUserForm({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      role: 'customer'
    });
  };

  // Early return if not admin (will redirect)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['analytics', 'rooms', 'bookings', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Bookings
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {analytics.totalBookings}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              ${Number(analytics.totalRevenue).toFixed(2)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              This Month
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {analytics.monthBookings}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Occupancy Rate
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {analytics.occupancyRate}%
            </p>
          </Card>
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Rooms</h2>
            <Button onClick={() => {
              resetRoomForm();
              setEditingRoom(null);
              setShowRoomModal(true);
            }}>
              Add New Room
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                {room.images && room.images.length > 0 && (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {room.title}
                    </h3>
                    {room.room_type && (
                      <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded capitalize">
                        {room.room_type}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {room.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${room.price_per_night}/night
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Capacity: {room.capacity}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditRoom(room)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteRoom(room.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {booking.room_title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Reference: {booking.reference}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(booking.from_date).toLocaleDateString()} -{' '}
                      {new Date(booking.to_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Total: ${Number(booking.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                      className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Users</h2>
            <Button onClick={() => {
              resetUserForm();
              setEditingUser(null);
              setShowUserModal(true);
            }}>
              Add New User
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                      {userItem.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {userItem.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {userItem.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        userItem.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditUser(userItem)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteUser(userItem.id)}
                        className="text-xs"
                        disabled={userItem.id === user?.id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h2>
            <form onSubmit={handleRoomSubmit}>
              <Input
                label="Title"
                value={roomForm.title}
                onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={roomForm.room_type}
                  onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="executive">Executive</option>
                  <option value="family">Family</option>
                  <option value="economy">Economy</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="presidential">Presidential</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="4"
                  required
                />
              </div>
              <Input
                label="Capacity"
                type="number"
                value={roomForm.capacity}
                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                required
              />
              <Input
                label="Price per Night"
                type="number"
                step="0.01"
                value={roomForm.price_per_night}
                onChange={(e) => setRoomForm({ ...roomForm, price_per_night: e.target.value })}
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                    resetRoomForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleUserSubmit}>
              <Input
                label="Full Name"
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
              <Input
                label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!editingUser}
              />
              <Input
                label="Phone"
                type="tel"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                    resetUserForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

