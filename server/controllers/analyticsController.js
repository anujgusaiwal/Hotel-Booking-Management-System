import pool from '../config/database.js';

const getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Total bookings
    const [totalBookings] = await pool.execute(
      "SELECT COUNT(*) as count FROM bookings WHERE status != 'cancelled'"
    );

    // Total revenue
    const [totalRevenue] = await pool.execute(
      "SELECT SUM(total_amount) as total FROM bookings WHERE status != 'cancelled'"
    );

    // This month's bookings
    const [monthBookings] = await pool.execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE status != 'cancelled' 
       AND MONTH(created_at) = MONTH(CURRENT_DATE())
       AND YEAR(created_at) = YEAR(CURRENT_DATE())`
    );

    // This month's revenue
    const [monthRevenue] = await pool.execute(
      `SELECT SUM(total_amount) as total FROM bookings 
       WHERE status != 'cancelled' 
       AND MONTH(created_at) = MONTH(CURRENT_DATE())
       AND YEAR(created_at) = YEAR(CURRENT_DATE())`
    );

    // Occupancy rate (booked nights / available nights)
    const [occupancy] = await pool.execute(
      `SELECT 
        SUM(DATEDIFF(to_date, from_date)) as booked_nights,
        (SELECT COUNT(*) * 30 FROM rooms WHERE status = 'available') as available_nights
       FROM bookings 
       WHERE status != 'cancelled' 
       AND from_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)`
    );

    const bookedNights = occupancy[0].booked_nights || 0;
    const availableNights = occupancy[0].available_nights || 1;
    const occupancyRate = ((bookedNights / availableNights) * 100).toFixed(2);

    // Recent bookings
    const [recentBookings] = await pool.execute(
      `SELECT b.*, r.title as room_title, u.full_name 
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC
       LIMIT 10`
    );

    res.json({
      totalBookings: totalBookings[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      monthBookings: monthBookings[0].count,
      monthRevenue: monthRevenue[0].total || 0,
      occupancyRate: parseFloat(occupancyRate),
      recentBookings
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAnalytics };

