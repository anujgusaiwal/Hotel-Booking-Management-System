import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';

export default function Bookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchBookings();
    // Check if we just came from a booking creation
    if (location.state?.bookingCreated) {
      setSuccessMessage('Booking created successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location, user, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/bookings');
      console.log('Bookings response:', response.data);
      if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to load bookings. Please try again.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const downloadReceipt = async (id) => {
    try {
      const response = await api.get(`/bookings/${id}/receipt`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  // Early return if not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">My Bookings</h1>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">Loading bookings...</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          {error}
          <button
            onClick={fetchBookings}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No bookings found.</p>
          <Link to="/rooms">
            <Button>Browse Rooms</Button>
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
            >
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
                      <span className="font-semibold">Reference:</span> {booking.reference}
                    </p>
                    <p>
                      <span className="font-semibold">Check-in:</span>{' '}
                      {new Date(booking.from_date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Check-out:</span>{' '}
                      {new Date(booking.to_date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Guests:</span> {booking.guests}
                    </p>
                    <p>
                      <span className="font-semibold">Total Amount:</span> ₹
                      {Number(booking.total_amount).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{' '}
                      <span
                        className={`capitalize ${
                          booking.status === 'confirmed'
                            ? 'text-green-600'
                            : booking.status === 'cancelled'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => downloadReceipt(booking.id)}
                    >
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

