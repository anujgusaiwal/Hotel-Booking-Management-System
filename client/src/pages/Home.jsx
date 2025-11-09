import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../utils/api';
import { useState } from 'react';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms?status=available');
        setRooms(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Our Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Experience luxury and comfort like never before
          </p>
          <Link
            to="/rooms"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Rooms
          </Link>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Featured Rooms
          </h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {room.images && room.images.length > 0 && (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {room.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${room.price_per_night}/night
                      </span>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Luxury Accommodation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comfortable rooms with modern amenities
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Best Service
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                World-class hospitality and service
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Prime Location
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Centrally located with easy access
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

