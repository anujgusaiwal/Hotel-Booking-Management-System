import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import Card from '../components/Card';
import useAuthStore from '../store/authStore';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    // Check if user is staff
    if (!user || user.role !== 'staff') {
      navigate('/');
      return;
    }

    if (activeTab === 'rooms') {
      fetchAssignedRooms();
    } else if (activeTab === 'bookings') {
      fetchAssignedRoomBookings();
    } else if (activeTab === 'food-orders') {
      fetchAssignedFoodOrders();
    }
  }, [activeTab, user, navigate]);

  const fetchAssignedRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/staff/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching assigned rooms:', error);
      alert(error.response?.data?.message || 'Failed to load assigned rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedRoomBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/staff/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedFoodOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/staff/food-orders');
      setFoodOrders(response.data);
    } catch (error) {
      console.error('Error fetching food orders:', error);
      alert(error.response?.data?.message || 'Failed to load food orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (roomId, newStatus) => {
    setUpdatingStatus(roomId);
    try {
      await api.put(`/staff/rooms/${roomId}/status`, { status: newStatus });
      fetchAssignedRooms();
      alert('Room status updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update room status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Early return if not staff (will redirect)
  if (!user || user.role !== 'staff') {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

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
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Staff Dashboard</h1>
        <p className="text-white mb-6 drop-shadow-md">Welcome, {user.full_name}!</p>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['rooms', 'bookings', 'food-orders'].map((tab) => (
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

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">My Assigned Rooms</h2>
            
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">Loading rooms...</p>
              </div>
            )}

            {!loading && rooms.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  No rooms assigned to you yet.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contact your administrator to get room assignments.
                </p>
              </Card>
            )}

            {!loading && rooms.length > 0 && (
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
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {room.title}
                          </h3>
                          {room.room_number && (
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              Room #{room.room_number}
                            </p>
                          )}
                        </div>
                        {room.room_type && (
                          <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded capitalize">
                            {room.room_type}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                        {room.description}
                      </p>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span className="font-medium">Current Status:</span>
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span className="font-medium">Update Status:</span>
                        </p>
                        <select
                          value={room.status}
                          onChange={(e) => handleUpdateStatus(room.id, e.target.value)}
                          disabled={updatingStatus === room.id}
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="cleaning">Cleaning</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                        {updatingStatus === room.id && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updating...</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Capacity: {room.capacity} guests</p>
                        <p>Price: ₹{Number(room.price_per_night).toFixed(2)}/night</p>
                        {room.assigned_at && (
                          <p className="text-xs mt-1">
                            Assigned: {new Date(room.assigned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Bookings for My Rooms</h2>
            
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">Loading bookings...</p>
              </div>
            )}

            {!loading && bookings.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No bookings found for your assigned rooms.
                </p>
              </Card>
            )}

            {!loading && bookings.length > 0 && (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {booking.room_image && (
                        <img
                          src={booking.room_image}
                          alt={booking.room_title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <div className="md:col-span-2">
                        <div className="mb-2">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {booking.room_title}
                          </h3>
                          {booking.room_number && (
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              Room #{booking.room_number}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <p>
                            <span className="font-medium">Reference:</span> {booking.reference}
                          </p>
                          <p>
                            <span className="font-medium">Customer:</span> {booking.customer_name}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {booking.customer_email}
                          </p>
                          <p>
                            <span className="font-medium">Check-in:</span>{' '}
                            {new Date(booking.from_date).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Check-out:</span>{' '}
                            {new Date(booking.to_date).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Guests:</span> {booking.guests}
                          </p>
                          <p>
                            <span className="font-medium">Total Amount:</span> ₹
                            {Number(booking.total_amount).toFixed(2)}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{' '}
                            <span
                              className={`capitalize font-semibold ${
                                booking.status === 'confirmed'
                                  ? 'text-green-600 dark:text-green-400'
                                  : booking.status === 'cancelled'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Food Orders Tab */}
        {activeTab === 'food-orders' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">My Assigned Food Orders</h2>
            
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">Loading food orders...</p>
              </div>
            )}

            {!loading && foodOrders.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No food orders assigned to you yet.
                </p>
              </Card>
            )}

            {!loading && foodOrders.length > 0 && (
              <div className="space-y-4">
                {foodOrders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {order.dish_name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                              order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : order.status === 'preparing'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : order.status === 'delivered'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          <p>
                            <span className="font-medium">Customer:</span> {order.customer_name} ({order.customer_email})
                          </p>
                          <p>
                            <span className="font-medium">Room:</span> {order.room_number ? `#${order.room_number} - ${order.room_title}` : order.room_title} ({order.room_type})
                          </p>
                          <p>
                            <span className="font-medium">Quantity:</span> {order.quantity}
                          </p>
                          <p>
                            <span className="font-medium">Price per item:</span> ₹{Number(order.dish_price).toFixed(2)}
                          </p>
                          <p>
                            <span className="font-medium">Total:</span> ₹{Number(order.total_price).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Ordered: {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

