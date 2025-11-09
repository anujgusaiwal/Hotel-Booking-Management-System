import pool from '../config/database.js';

const generateBookingReference = () => {
  return 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const createBooking = async (req, res) => {
  try {
    const { room_id, from_date, to_date, guests } = req.body;
    const user_id = req.user.id;

    // Check if room exists and is available
    const [rooms] = await pool.execute(
      'SELECT id, price_per_night, capacity, status FROM rooms WHERE id = ?',
      [room_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];

    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    if (guests > room.capacity) {
      return res.status(400).json({ message: 'Number of guests exceeds room capacity' });
    }

    // Check for date conflicts
    const [conflicts] = await pool.execute(
      `SELECT id FROM bookings 
       WHERE room_id = ? 
       AND status != 'cancelled'
       AND ((from_date <= ? AND to_date > ?) OR (from_date < ? AND to_date >= ?))`,
      [room_id, from_date, from_date, to_date, to_date]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for these dates' });
    }

    // Calculate total amount
    const from = new Date(from_date);
    const to = new Date(to_date);
    const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    const total_amount = nights * room.price_per_night;

    // Create booking
    const reference = generateBookingReference();
    const [result] = await pool.execute(
      'INSERT INTO bookings (user_id, room_id, from_date, to_date, total_amount, guests, reference, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, room_id, from_date, to_date, total_amount, guests, reference, 'confirmed']
    );

    const [booking] = await pool.execute(
      `SELECT b.*, r.title as room_title, r.price_per_night 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json(booking[0]);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookings = async (req, res) => {
  try {
    let query = `
      SELECT b.*, r.title as room_title, r.price_per_night,
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id LIMIT 1) as room_image
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    // If not admin, only show user's bookings
    if (req.user.role !== 'admin') {
      query += ' AND b.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY b.id DESC';

    const [bookings] = await pool.execute(query, params);

    const formattedBookings = bookings.map(booking => {
      let room_image = null;
      
      // Handle room_image - check if it's already an array or a string
      if (booking.room_image) {
        if (typeof booking.room_image === 'string') {
          try {
            const parsed = JSON.parse(booking.room_image);
            room_image = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
          } catch (e) {
            room_image = null;
          }
        } else if (Array.isArray(booking.room_image) && booking.room_image.length > 0) {
          room_image = booking.room_image[0];
        }
      }
      
      return {
        ...booking,
        room_image
      };
    });

    res.json(formattedBookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT b.*, r.title as room_title, r.description as room_description, 
        r.price_per_night, r.capacity,
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as room_images
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `;
    const params = [id];

    // If not admin, verify ownership
    if (req.user.role !== 'admin') {
      query += ' AND b.user_id = ?';
      params.push(req.user.id);
    }

    const [bookings] = await pool.execute(query, params);

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];
    
    // Handle room_images - check if it's already an array or a string
    if (booking.room_images) {
      if (typeof booking.room_images === 'string') {
        try {
          booking.room_images = JSON.parse(booking.room_images);
        } catch (e) {
          booking.room_images = [];
        }
      } else if (!Array.isArray(booking.room_images)) {
        booking.room_images = [];
      }
    } else {
      booking.room_images = [];
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only admin can update booking status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update booking status' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const [result] = await pool.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const [booking] = await pool.execute(
      `SELECT b.*, r.title as room_title 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.id = ?`,
      [id]
    );

    res.json(booking[0]);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the booking or is admin
    const [bookings] = await pool.execute(
      'SELECT user_id FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && bookings[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Cancel booking instead of deleting
    await pool.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['cancelled', id]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookingReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const PDFDocument = (await import('pdfkit')).default;

    let query = `
      SELECT b.*, r.title as room_title, r.price_per_night,
        u.full_name, u.email, u.phone
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `;
    const params = [id];

    if (req.user.role !== 'admin') {
      query += ' AND b.user_id = ?';
      params.push(req.user.id);
    }

    const [bookings] = await pool.execute(query, params);

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=booking-${booking.reference}.pdf`);

    doc.pipe(res);

    // PDF content
    doc.fontSize(20).text('Hotel Booking Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Reference: ${booking.reference}`);
    doc.text(`Date: ${new Date(booking.created_at).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Guest: ${booking.full_name}`);
    doc.text(`Email: ${booking.email}`);
    if (booking.phone) doc.text(`Phone: ${booking.phone}`);
    doc.moveDown();
    doc.text(`Room: ${booking.room_title}`);
    doc.text(`Check-in: ${new Date(booking.from_date).toLocaleDateString()}`);
    doc.text(`Check-out: ${new Date(booking.to_date).toLocaleDateString()}`);
    doc.text(`Guests: ${booking.guests}`);
    doc.moveDown();
    doc.fontSize(16).text(`Total Amount: $${parseFloat(booking.total_amount).toFixed(2)}`, { align: 'right' });
    doc.text(`Status: ${booking.status.toUpperCase()}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

