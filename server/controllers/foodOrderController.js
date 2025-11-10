import pool from '../config/database.js';

// Place food order (Customer only)
export const placeFoodOrder = async (req, res) => {
  try {
    const { room_id, dish_id, quantity } = req.body;
    const customer_id = req.user.id;

    if (!room_id || !dish_id || !quantity) {
      return res.status(400).json({ message: 'Room ID, dish ID, and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Verify room exists
    const [rooms] = await pool.execute(
      'SELECT id FROM rooms WHERE id = ?',
      [room_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Verify dish exists
    const [dishes] = await pool.execute(
      'SELECT id, price FROM food_menu WHERE id = ?',
      [dish_id]
    );

    if (dishes.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const dish = dishes[0];
    const total_price = dish.price * quantity;

    // Check if customer has an active booking for this room
    const [bookings] = await pool.execute(
      `SELECT id FROM bookings 
       WHERE user_id = ? AND room_id = ? 
       AND status = 'confirmed' 
       AND from_date <= CURDATE() 
       AND to_date >= CURDATE()`,
      [customer_id, room_id]
    );

    if (bookings.length === 0) {
      return res.status(400).json({ 
        message: 'You must have an active booking for this room to place an order' 
      });
    }

    // Check if there's a staff assigned to this room
    let staff_id = null;
    try {
      const [assignments] = await pool.execute(
        `SELECT staff_id FROM room_staff_assignments 
         WHERE room_id = ? 
         ORDER BY assigned_at DESC 
         LIMIT 1`,
        [room_id]
      );

      if (assignments.length > 0) {
        staff_id = assignments[0].staff_id;
        console.log(`Found staff assignment for room ${room_id}: staff_id = ${staff_id}`);
      } else {
        console.log(`No staff assigned to room ${room_id}`);
      }
    } catch (error) {
      console.error('Error checking staff assignment:', error);
      // Continue without staff assignment if there's an error
    }

    // Log for debugging
    console.log('Placing food order:', {
      customer_id,
      room_id,
      staff_id,
      dish_id,
      quantity,
      total_price
    });

    // Create order with staff assignment
    // Check if staff_id column exists, if not, insert without it
    let result;
    try {
      [result] = await pool.execute(
        'INSERT INTO food_orders (customer_id, room_id, staff_id, dish_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [customer_id, room_id, staff_id, dish_id, quantity, total_price, 'pending']
      );
      console.log('Food order created with ID:', result.insertId, 'Staff ID:', staff_id);
    } catch (error) {
      // If staff_id column doesn't exist, try without it
      if (error.message.includes('staff_id') || error.code === 'ER_BAD_FIELD_ERROR') {
        console.warn('staff_id column not found, inserting without it. Please run migration_add_staff_to_orders.sql');
        [result] = await pool.execute(
          'INSERT INTO food_orders (customer_id, room_id, dish_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
          [customer_id, room_id, dish_id, quantity, total_price, 'pending']
        );
        console.log('Food order created with ID:', result.insertId, '(without staff_id)');
      } else {
        throw error;
      }
    }

    // Get created order with details
    const [orders] = await pool.execute(
      `SELECT fo.*, 
        fm.name as dish_name, fm.description as dish_description, fm.price as dish_price,
        r.title as room_title, r.room_number,
        u.full_name as customer_name,
        staff.full_name as staff_name, staff.email as staff_email
       FROM food_orders fo
       JOIN food_menu fm ON fo.dish_id = fm.id
       JOIN rooms r ON fo.room_id = r.id
       JOIN users u ON fo.customer_id = u.id
       LEFT JOIN users staff ON fo.staff_id = staff.id
       WHERE fo.id = ?`,
      [result.insertId]
    );

    res.status(201).json(orders[0]);
  } catch (error) {
    console.error('Place food order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get customer's food orders
export const getCustomerOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;

    const [orders] = await pool.execute(
      `SELECT fo.*, 
        fm.name as dish_name, fm.description as dish_description, fm.price as dish_price,
        r.title as room_title, r.room_number, r.room_type,
        staff.full_name as staff_name, staff.email as staff_email
       FROM food_orders fo
       JOIN food_menu fm ON fo.dish_id = fm.id
       JOIN rooms r ON fo.room_id = r.id
       LEFT JOIN users staff ON fo.staff_id = staff.id
       WHERE fo.customer_id = ?
       ORDER BY fo.created_at DESC`,
      [customer_id]
    );

    res.json(orders);
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all food orders (Admin only)
export const getAllFoodOrders = async (req, res) => {
  try {
    // Get orders with staff assigned at order time, and also current room assignment
    // Use subquery to get the most recent staff assignment for each room
    const [orders] = await pool.execute(
      `SELECT fo.*, 
        fm.name as dish_name, fm.description as dish_description, fm.price as dish_price,
        r.title as room_title, r.room_number, r.room_type,
        u.full_name as customer_name, u.email as customer_email,
        staff.full_name as staff_name, staff.email as staff_email,
        current_staff.full_name as current_room_staff_name, 
        current_staff.email as current_room_staff_email
       FROM food_orders fo
       JOIN food_menu fm ON fo.dish_id = fm.id
       JOIN rooms r ON fo.room_id = r.id
       JOIN users u ON fo.customer_id = u.id
       LEFT JOIN users staff ON fo.staff_id = staff.id
       LEFT JOIN (
         SELECT rsa1.room_id, rsa1.staff_id
         FROM room_staff_assignments rsa1
         INNER JOIN (
           SELECT room_id, MAX(assigned_at) as max_assigned_at
           FROM room_staff_assignments
           GROUP BY room_id
         ) rsa2 ON rsa1.room_id = rsa2.room_id AND rsa1.assigned_at = rsa2.max_assigned_at
       ) latest_assignment ON fo.room_id = latest_assignment.room_id
       LEFT JOIN users current_staff ON latest_assignment.staff_id = current_staff.id
       ORDER BY fo.created_at DESC`
    );

    // Process orders to use current room staff if order staff is null
    const processedOrders = orders.map(order => {
      // If order has no staff assigned, but room has current staff, use current staff
      if (!order.staff_name && order.current_room_staff_name) {
        return {
          ...order,
          staff_name: order.current_room_staff_name,
          staff_email: order.current_room_staff_email
        };
      }
      return order;
    });

    res.json(processedOrders);
  } catch (error) {
    console.error('Get all food orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update food order status (Admin only)
export const updateFoodOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const [result] = await pool.execute(
      'UPDATE food_orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get updated order with details
    const [orders] = await pool.execute(
      `SELECT fo.*, 
        fm.name as dish_name, fm.description as dish_description, fm.price as dish_price,
        r.title as room_title, r.room_number, r.room_type,
        u.full_name as customer_name, u.email as customer_email,
        staff.full_name as staff_name, staff.email as staff_email
       FROM food_orders fo
       JOIN food_menu fm ON fo.dish_id = fm.id
       JOIN rooms r ON fo.room_id = r.id
       JOIN users u ON fo.customer_id = u.id
       LEFT JOIN users staff ON fo.staff_id = staff.id
       WHERE fo.id = ?`,
      [id]
    );

    res.json(orders[0]);
  } catch (error) {
    console.error('Update food order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get customer's active bookings for room selection
export const getCustomerActiveBookings = async (req, res) => {
  try {
    const customer_id = req.user.id;

    const [bookings] = await pool.execute(
      `SELECT b.id, b.room_id, b.from_date, b.to_date,
        r.title as room_title, r.room_number, r.room_type
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = ? 
       AND b.status = 'confirmed' 
       AND b.from_date <= CURDATE() 
       AND b.to_date >= CURDATE()
       ORDER BY b.from_date DESC`,
      [customer_id]
    );

    res.json(bookings);
  } catch (error) {
    console.error('Get customer active bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

