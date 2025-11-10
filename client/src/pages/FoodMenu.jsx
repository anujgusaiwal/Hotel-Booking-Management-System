import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import useAuthStore from '../store/authStore';

export default function FoodMenu() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [menuItems, setMenuItems] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchMenu();
    fetchActiveBookings();
  }, [user, navigate]);

  const fetchMenu = async () => {
    setMenuLoading(true);
    try {
      const response = await api.get('/food-menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setError('Failed to load menu');
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const response = await api.get('/food-orders/active-bookings');
      setActiveBookings(response.data);
      if (response.data.length > 0) {
        setSelectedRoom(response.data[0].room_id.toString());
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
    }
  };

  const handleQuantityChange = (dishId, value) => {
    const qty = parseInt(value) || 0;
    if (qty < 0) return;
    
    setQuantities(prev => ({
      ...prev,
      [dishId]: qty
    }));
  };

  const handlePlaceOrder = async (dishId) => {
    if (!selectedRoom) {
      setError('Please select a room');
      return;
    }

    const quantity = quantities[dishId] || 1;
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/food-orders', {
        room_id: parseInt(selectedRoom),
        dish_id: dishId,
        quantity: quantity
      });
      
      setSuccess('Order placed successfully!');
      setQuantities(prev => ({ ...prev, [dishId]: 0 }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Food Menu</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
            {success}
          </div>
        )}

        {activeBookings.length === 0 && (
          <Card className="p-6 mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You need to have an active booking to place food orders.
            </p>
            <Button onClick={() => navigate('/rooms')}>
              Browse Rooms
            </Button>
          </Card>
        )}

        {activeBookings.length > 0 && (
          <Card className="p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Room for Order:
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {activeBookings.map((booking) => (
                <option key={booking.id} value={booking.room_id}>
                  {booking.room_number ? `#${booking.room_number} - ${booking.room_title}` : booking.room_title} ({booking.room_type}) - Check-in: {new Date(booking.from_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </Card>
        )}

        {menuLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Loading menu...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">No food items available.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  {activeBookings.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity:
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={quantities[item.id] || ''}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-20"
                          placeholder="0"
                        />
                      </div>
                      <Button
                        onClick={() => handlePlaceOrder(item.id)}
                        disabled={loading || !quantities[item.id] || quantities[item.id] < 1}
                        className="w-full"
                      >
                        {loading ? 'Placing Order...' : 'Add to Order'}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Book a room to order
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

