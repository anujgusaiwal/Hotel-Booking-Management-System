import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!room) {
    return <div className="text-center py-12">Room not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/rooms"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
      >
        ← Back to Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative">
          {room.images && room.images.length > 0 ? (
            <>
              <img
                src={room.images[currentImageIndex]}
                alt={room.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    →
                  </button>
                  <div className="flex justify-center mt-4 space-x-2">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {room.title}
            </h1>
            {room.room_type && (
              <span className="text-sm font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full capitalize">
                {room.room_type}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {room.description}
          </p>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Price per night
              </span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${room.price_per_night}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {room.room_type && (
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="font-semibold capitalize">{room.room_type}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Capacity:</span>
                <span className="font-semibold">{room.capacity} guests</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-semibold ${
                  room.status === 'available' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {room.status}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          {room.features && Object.keys(room.features).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(room.features).map(([key, value]) => (
                  value && (
                    <span
                      key={key}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm"
                    >
                      {key.replace(/_/g, ' ')}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {room.status === 'available' ? (
            <Button
              onClick={() => {
                if (user) {
                  navigate(`/rooms/${id}/booking`);
                } else {
                  navigate('/login');
                }
              }}
              className="w-full py-3 text-lg"
            >
              Book Now
            </Button>
          ) : (
            <Button disabled className="w-full py-3 text-lg">
              Not Available
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}





