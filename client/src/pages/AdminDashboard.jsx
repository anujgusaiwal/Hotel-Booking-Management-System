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
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [foodMenu, setFoodMenu] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFoodMenuModal, setShowFoodMenuModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    room_id: '',
    staff_id: ''
  });
  const [roomForm, setRoomForm] = useState({
    title: '',
    room_number: '',
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
  const [foodMenuForm, setFoodMenuForm] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [editingFoodItem, setEditingFoodItem] = useState(null);

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
    } else if (activeTab === 'staff') {
      fetchStaff();
      fetchAssignments();
      fetchRooms(); // Fetch rooms for assignment modal
    } else if (activeTab === 'food-menu') {
      fetchFoodMenu();
    } else if (activeTab === 'food-orders') {
      fetchFoodOrders();
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

  const fetchStaff = async () => {
    try {
      const response = await api.get('/admin/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/admin/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAssignStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/assign', assignmentForm);
      setShowAssignmentModal(false);
      setAssignmentForm({ room_id: '', staff_id: '' });
      fetchAssignments();
      fetchRooms(); // Refresh rooms to show assignments
      alert('Staff assigned successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign staff');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignStaff = async (roomId, staffId) => {
    if (window.confirm('Are you sure you want to unassign this staff member from the room?')) {
      try {
        await api.post('/admin/unassign', { room_id: roomId, staff_id: staffId });
        fetchAssignments();
        fetchRooms(); // Refresh rooms
        alert('Staff unassigned successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to unassign staff');
      }
    }
  };

  const fetchFoodMenu = async () => {
    try {
      const response = await api.get('/food-menu');
      setFoodMenu(response.data);
    } catch (error) {
      console.error('Error fetching food menu:', error);
    }
  };

  const fetchFoodOrders = async () => {
    try {
      const response = await api.get('/food-orders/all');
      setFoodOrders(response.data);
    } catch (error) {
      console.error('Error fetching food orders:', error);
    }
  };

  const handleFoodMenuSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingFoodItem) {
        await api.put(`/food-menu/${editingFoodItem.id}`, foodMenuForm);
      } else {
        await api.post('/food-menu', foodMenuForm);
      }
      setShowFoodMenuModal(false);
      setEditingFoodItem(null);
      resetFoodMenuForm();
      fetchFoodMenu();
      alert(editingFoodItem ? 'Food item updated successfully' : 'Food item added successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save food item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.delete(`/food-menu/${id}`);
        fetchFoodMenu();
        alert('Food item deleted successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete food item');
      }
    }
  };

  const handleEditFoodItem = (item) => {
    setEditingFoodItem(item);
    setFoodMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price
    });
    setShowFoodMenuModal(true);
  };

  const resetFoodMenuForm = () => {
    setFoodMenuForm({
      name: '',
      description: '',
      price: ''
    });
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/food-orders/${orderId}/status`, { status });
      fetchFoodOrders();
      alert('Order status updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status');
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
      room_number: room.room_number || '',
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

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking? The customer will be notified.')) {
      try {
        await api.put(`/bookings/${id}`, { status: 'cancelled' });
        fetchBookings();
        alert('Booking cancelled successfully. The customer will see the updated status.');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const resetRoomForm = () => {
    setRoomForm({
      title: '',
      room_number: '',
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
          {['analytics', 'rooms', 'bookings', 'users', 'staff', 'food-menu', 'food-orders'].map((tab) => (
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
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {booking.room_title}
                      </h3>
                      {booking.room_number && (
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Room #{booking.room_number}
                        </p>
                      )}
                    </div>
                    {booking.customer_name && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Customer: <span className="text-gray-800 dark:text-white">{booking.customer_name}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.customer_email}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Reference:</span> {booking.reference}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Dates:</span>{' '}
                        {new Date(booking.from_date).toLocaleDateString()} -{' '}
                        {new Date(booking.to_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Guests:</span> {booking.guests}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Total:</span> ${Number(booking.total_amount).toFixed(2)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>{' '}
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
                  <div className="flex flex-col space-y-2 ml-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                      className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    {booking.status !== 'cancelled' && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-sm"
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Staff Assignments Tab */}
      {activeTab === 'staff' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Staff-Room Assignments</h2>
            <Button onClick={async () => {
              setAssignmentForm({ room_id: '', staff_id: '' });
              // Ensure rooms are loaded before opening modal
              if (rooms.length === 0) {
                await fetchRooms();
              }
              setShowAssignmentModal(true);
            }}>
              Assign Staff to Room
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">All Staff Members</h3>
              <div className="space-y-2">
                {staff.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No staff members found. Create staff users in the Users tab.</p>
                ) : (
                  staff.map((staffMember) => (
                    <div key={staffMember.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="font-medium text-gray-800 dark:text-white">{staffMember.full_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{staffMember.email}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Current Assignments</h3>
              <div className="space-y-2">
                {assignments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No assignments yet.</p>
                ) : (
                  assignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{assignment.staff_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Room: {assignment.room_number ? `#${assignment.room_number} - ${assignment.room_title}` : assignment.room_title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleUnassignStaff(assignment.room_id, assignment.staff_id)}
                        className="text-xs"
                      >
                        Unassign
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Room Assignments Overview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Assigned Staff
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        {assignment.room_number ? `#${assignment.room_number} - ${assignment.room_title}` : assignment.room_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {assignment.staff_name} ({assignment.staff_email})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(assignment.assigned_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="danger"
                          onClick={() => handleUnassignStaff(assignment.room_id, assignment.staff_id)}
                          className="text-xs"
                        >
                          Unassign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Food Menu Management Tab */}
      {activeTab === 'food-menu' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Food Menu Management</h2>
            <Button onClick={() => {
              resetFoodMenuForm();
              setEditingFoodItem(null);
              setShowFoodMenuModal(true);
            }}>
              Add Food Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodMenu.map((item) => (
              <Card key={item.id} className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {item.description}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  ₹{Number(item.price).toFixed(2)}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditFoodItem(item)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteFoodItem(item.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Food Orders Management Tab */}
      {activeTab === 'food-orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Food Orders</h2>
          <div className="space-y-4">
            {foodOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
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
                      {order.staff_name ? (
                        <p>
                          <span className="font-medium">Assigned Staff:</span> {order.staff_name}
                          {order.staff_email && ` (${order.staff_email})`}
                        </p>
                      ) : (
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                          ⚠️ No staff assigned to this room
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ordered: {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
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
                          : userItem.role === 'staff'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
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
                label="Room Number"
                value={roomForm.room_number}
                onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })}
                placeholder="e.g., 101, 201, A-101"
                required
              />
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
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
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

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Assign Staff to Room
            </h2>
            <form onSubmit={handleAssignStaff}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignmentForm.room_id}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, room_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.title} - {room.room_type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff Member <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignmentForm.staff_id}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, staff_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a staff member</option>
                  {staff.map((staffMember) => (
                    <option key={staffMember.id} value={staffMember.id}>
                      {staffMember.full_name} ({staffMember.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Assigning...' : 'Assign'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setAssignmentForm({ room_id: '', staff_id: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Food Menu Modal */}
      {showFoodMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingFoodItem ? 'Edit Food Item' : 'Add New Food Item'}
            </h2>
            <form onSubmit={handleFoodMenuSubmit}>
              <Input
                label="Name"
                value={foodMenuForm.name}
                onChange={(e) => setFoodMenuForm({ ...foodMenuForm, name: e.target.value })}
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={foodMenuForm.description}
                  onChange={(e) => setFoodMenuForm({ ...foodMenuForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="4"
                />
              </div>
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                min="0"
                value={foodMenuForm.price}
                onChange={(e) => setFoodMenuForm({ ...foodMenuForm, price: e.target.value })}
                required
              />
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowFoodMenuModal(false);
                    setEditingFoodItem(null);
                    resetFoodMenuForm();
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
                  <option value="staff">Staff</option>
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

