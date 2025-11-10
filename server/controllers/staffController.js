import pool from '../config/database.js';

// Get assigned rooms for staff
export const getAssignedRooms = async (req, res) => {
  try {
    const staffId = req.user.id;

    const [rooms] = await pool.execute(
      `SELECT r.*, 
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id LIMIT 1) as images,
        rsa.assigned_at
       FROM rooms r
       INNER JOIN room_staff_assignments rsa ON r.id = rsa.room_id
       WHERE rsa.staff_id = ?
       ORDER BY r.id DESC`,
      [staffId]
    );

    // Parse JSON fields
    const formattedRooms = rooms.map(room => {
      let features = {};
      let images = [];
      
      if (room.features) {
        if (typeof room.features === 'string') {
          try {
            features = JSON.parse(room.features);
          } catch (e) {
            features = {};
          }
        } else {
          features = room.features;
        }
      }
      
      if (room.images) {
        if (typeof room.images === 'string') {
          try {
            const parsed = JSON.parse(room.images);
            images = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            images = [];
          }
        } else if (Array.isArray(room.images)) {
          images = room.images;
        }
      }
      
      return {
        ...room,
        features,
        images
      };
    });

    res.json(formattedRooms);
  } catch (error) {
    console.error('Get assigned rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update room status (staff can update their assigned rooms)
export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const staffId = req.user.id;

    // Validate status
    const validStatuses = ['available', 'unavailable', 'maintenance', 'occupied', 'cleaning'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if staff is assigned to this room
    const [assignments] = await pool.execute(
      'SELECT id FROM room_staff_assignments WHERE room_id = ? AND staff_id = ?',
      [id, staffId]
    );

    if (assignments.length === 0) {
      return res.status(403).json({ message: 'You are not assigned to this room' });
    }

    // Update room status
    const [result] = await pool.execute(
      'UPDATE rooms SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Get updated room
    const [rooms] = await pool.execute(
      `SELECT r.*, 
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id LIMIT 1) as images
       FROM rooms r WHERE r.id = ?`,
      [id]
    );

    const room = rooms[0];
    
    // Handle features
    if (room.features) {
      if (typeof room.features === 'string') {
        try {
          room.features = JSON.parse(room.features);
        } catch (e) {
          room.features = {};
        }
      }
    } else {
      room.features = {};
    }
    
    // Handle images
    if (room.images) {
      if (typeof room.images === 'string') {
        try {
          const parsed = JSON.parse(room.images);
          room.images = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          room.images = [];
        }
      } else if (!Array.isArray(room.images)) {
        room.images = [];
      }
    } else {
      room.images = [];
    }

    res.json(room);
  } catch (error) {
    console.error('Update room status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookings for assigned rooms
export const getAssignedRoomBookings = async (req, res) => {
  try {
    const staffId = req.user.id;

    const [bookings] = await pool.execute(
      `SELECT b.*, r.title as room_title, r.room_number, r.price_per_night,
        u.full_name as customer_name, u.email as customer_email,
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id LIMIT 1) as room_image
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       INNER JOIN room_staff_assignments rsa ON r.id = rsa.room_id
       WHERE rsa.staff_id = ?
       ORDER BY b.from_date DESC`,
      [staffId]
    );

    const formattedBookings = bookings.map(booking => {
      let room_image = null;
      
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
    console.error('Get assigned room bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get food orders assigned to staff
export const getAssignedFoodOrders = async (req, res) => {
  try {
    const staffId = req.user.id;

    console.log('Fetching food orders for staff ID:', staffId);

    // Get orders where staff_id matches OR orders for rooms currently assigned to this staff
    // This ensures staff see all relevant orders, even if placed before assignment
    let orders = [];
    
    try {
      // Try query with staff_id column - get orders assigned to staff OR for assigned rooms
      const [ordersWithStaffId] = await pool.execute(
        `SELECT DISTINCT fo.*, 
          fm.name as dish_name, fm.description as dish_description, fm.price as dish_price,
          r.title as room_title, r.room_number, r.room_type,
          u.full_name as customer_name, u.email as customer_email
         FROM food_orders fo
         JOIN food_menu fm ON fo.dish_id = fm.id
         JOIN rooms r ON fo.room_id = r.id
         JOIN users u ON fo.customer_id = u.id
         LEFT JOIN room_staff_assignments rsa ON fo.room_id = rsa.room_id
         WHERE fo.staff_id = ? OR rsa.staff_id = ?
         ORDER BY fo.created_at DESC`,
        [staffId, staffId]
      );
      orders = ordersWithStaffId;
      console.log('Found', orders.length, 'food orders for staff ID:', staffId);
    } catch (error) {
      // If staff_id column doesn't exist, get orders for rooms assigned to this staff
      if (error.code === 'ER_BAD_FIELD_ERROR' || error.message.includes('staff_id')) {
        console.warn('staff_id column not found, falling back to room-based query. Please run migration_add_staff_to_orders.sql');
        
        const [ordersByRoom] = await pool.execute(
          `SELECT fo.*, 
            fm.name as dish_name, fm.description as dish_description, fm.price as dish_price,
            r.title as room_title, r.room_number, r.room_type,
            u.full_name as customer_name, u.email as customer_email
           FROM food_orders fo
           JOIN food_menu fm ON fo.dish_id = fm.id
           JOIN rooms r ON fo.room_id = r.id
           JOIN users u ON fo.customer_id = u.id
           JOIN room_staff_assignments rsa ON fo.room_id = rsa.room_id
           WHERE rsa.staff_id = ?
           ORDER BY fo.created_at DESC`,
          [staffId]
        );
        orders = ordersByRoom;
        console.log('Found', orders.length, 'food orders for assigned rooms for staff ID:', staffId);
      } else {
        throw error;
      }
    }

    res.json(orders);
  } catch (error) {
    console.error('Get assigned food orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Assign staff to room
export const assignStaffToRoom = async (req, res) => {
  try {
    const { room_id, staff_id } = req.body;

    if (!room_id || !staff_id) {
      return res.status(400).json({ message: 'room_id and staff_id are required' });
    }

    // Verify staff exists and is actually a staff member
    const [staff] = await pool.execute(
      'SELECT id, role FROM users WHERE id = ?',
      [staff_id]
    );

    if (staff.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (staff[0].role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    // Verify room exists
    const [rooms] = await pool.execute(
      'SELECT id FROM rooms WHERE id = ?',
      [room_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if assignment already exists
    const [existing] = await pool.execute(
      'SELECT id FROM room_staff_assignments WHERE room_id = ? AND staff_id = ?',
      [room_id, staff_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Staff is already assigned to this room' });
    }

    // Create assignment
    await pool.execute(
      'INSERT INTO room_staff_assignments (room_id, staff_id, assigned_by) VALUES (?, ?, ?)',
      [room_id, staff_id, req.user.id]
    );

    res.status(201).json({ message: 'Staff assigned to room successfully' });
  } catch (error) {
    console.error('Assign staff to room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Unassign staff from room
export const unassignStaffFromRoom = async (req, res) => {
  try {
    const { room_id, staff_id } = req.body;

    if (!room_id || !staff_id) {
      return res.status(400).json({ message: 'room_id and staff_id are required' });
    }

    const [result] = await pool.execute(
      'DELETE FROM room_staff_assignments WHERE room_id = ? AND staff_id = ?',
      [room_id, staff_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Staff unassigned from room successfully' });
  } catch (error) {
    console.error('Unassign staff from room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all staff-room assignments
export const getAllAssignments = async (req, res) => {
  try {
    const [assignments] = await pool.execute(
      `SELECT rsa.*, 
        r.title as room_title, r.room_number, r.status as room_status,
        u.full_name as staff_name, u.email as staff_email,
        admin.full_name as assigned_by_name
       FROM room_staff_assignments rsa
       JOIN rooms r ON rsa.room_id = r.id
       JOIN users u ON rsa.staff_id = u.id
       LEFT JOIN users admin ON rsa.assigned_by = admin.id
       ORDER BY rsa.assigned_at DESC`
    );

    res.json(assignments);
  } catch (error) {
    console.error('Get all assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const [staff] = await pool.execute(
      'SELECT id, full_name, email, phone, created_at FROM users WHERE role = ? ORDER BY full_name',
      ['staff']
    );

    res.json(staff);
  } catch (error) {
    console.error('Get all staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

