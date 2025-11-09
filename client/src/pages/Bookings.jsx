import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No bookings found.</p>
          <Link to="/rooms">
            <Button>Browse Rooms</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
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
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {booking.room_title}
                  </h3>
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
                      <span className="font-semibold">Total Amount:</span> $
                      {booking.total_amount.toFixed(2)}
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
  );
}

