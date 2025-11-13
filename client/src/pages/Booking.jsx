import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_date: null,
    to_date: null,
    guests: 1
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoom();
  }, [id]);

  useEffect(() => {
    calculateTotal();
  }, [formData.from_date, formData.to_date, room]);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data);
      setFormData(prev => ({ ...prev, guests: Math.min(prev.guests, Number(response.data.capacity) || 1) }));
    } catch (error) {
      console.error('Error fetching room:', error);
    }
  };

  const calculateTotal = () => {
    if (formData.from_date && formData.to_date && room) {
      const from = new Date(formData.from_date);
      const to = new Date(formData.to_date);
      const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        setTotalAmount(nights * Number(room.price_per_night) || 0);
      } else {
        setTotalAmount(0);
      }
    } else {
      setTotalAmount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.from_date || !formData.to_date) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (formData.guests > Number(room.capacity)) {
      setError(`Maximum capacity is ${room.capacity} guests`);
      return;
    }

    if (formData.guests < 1) {
      setError('At least 1 guest is required');
      return;
    }

    const from = new Date(formData.from_date);
    const to = new Date(formData.to_date);
    if (to <= from) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/bookings', {
        room_id: parseInt(id),
        from_date: formData.from_date.toISOString().split('T')[0],
        to_date: formData.to_date.toISOString().split('T')[0],
        guests: parseInt(formData.guests)
      });

      // Navigate to bookings page to show all bookings with success state
      navigate('/bookings', { state: { bookingCreated: true } });
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

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
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {room.title}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.from_date}
                onChange={(date) => setFormData({ ...formData, from_date: date })}
                minDate={minDate}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select check-in date"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Check-out Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.to_date}
                onChange={(date) => setFormData({ ...formData, to_date: date })}
                minDate={formData.from_date || minDate}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select check-out date"
              />
            </div>

            <Input
              label="Number of Guests"
              type="number"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
              min={1}
              max={Number(room.capacity) || 1}
              required
            />

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl h-fit backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Booking Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Room:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{room.title}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Price per night:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
₹{Number(room.price_per_night).toFixed(2)}
              </span>
            </div>

            {formData.from_date && formData.to_date && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Check-in:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {formData.from_date.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Check-out:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {formData.to_date.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Nights:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {Math.ceil((formData.to_date - formData.from_date) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Guests:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {formData.guests}
                  </span>
                </div>
              </>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-800 dark:text-white">Total:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

