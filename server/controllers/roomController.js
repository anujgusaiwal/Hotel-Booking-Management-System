import pool from '../config/database.js';

export const getRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, capacity, status } = req.query;
    
    let query = `
      SELECT r.*, 
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as images
      FROM rooms r
      WHERE 1=1
    `;
    const params = [];

    if (minPrice) {
      query += ' AND r.price_per_night >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND r.price_per_night <= ?';
      params.push(maxPrice);
    }

    if (capacity) {
      query += ' AND r.capacity >= ?';
      params.push(capacity);
    }

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.id DESC';

    const [rooms] = await pool.execute(query, params);

    // Parse JSON fields
    const formattedRooms = rooms.map(room => ({
      ...room,
      features: JSON.parse(room.features || '{}'),
      images: room.images ? JSON.parse(room.images) : []
    }));

    res.json(formattedRooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rooms] = await pool.execute(
      `SELECT r.*, 
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as images
       FROM rooms r WHERE r.id = ?`,
      [id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];
    room.features = JSON.parse(room.features || '{}');
    room.images = room.images ? JSON.parse(room.images) : [];

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { title, description, capacity, price_per_night, features, status, images } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO rooms (title, description, capacity, price_per_night, features, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, capacity, price_per_night, JSON.stringify(features || {}), status || 'available']
    );

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const imageValues = images.map(url => [result.insertId, url]);
      await pool.query(
        'INSERT INTO room_images (room_id, url) VALUES ?',
        [imageValues]
      );
    }

    const [newRoom] = await pool.execute(
      `SELECT r.*, 
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as images
       FROM rooms r WHERE r.id = ?`,
      [result.insertId]
    );

    const room = newRoom[0];
    room.features = JSON.parse(room.features || '{}');
    room.images = room.images ? JSON.parse(room.images) : [];

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, capacity, price_per_night, features, status, images } = req.body;

    const updateFields = [];
    const params = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      params.push(description);
    }
    if (capacity !== undefined) {
      updateFields.push('capacity = ?');
      params.push(capacity);
    }
    if (price_per_night !== undefined) {
      updateFields.push('price_per_night = ?');
      params.push(price_per_night);
    }
    if (features !== undefined) {
      updateFields.push('features = ?');
      params.push(JSON.stringify(features));
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
    }

    if (updateFields.length > 0) {
      params.push(id);
      await pool.execute(
        `UPDATE rooms SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );
    }

    // Update images if provided
    if (images && Array.isArray(images)) {
      await pool.execute('DELETE FROM room_images WHERE room_id = ?', [id]);
      if (images.length > 0) {
        const imageValues = images.map(url => [id, url]);
        await pool.query(
          'INSERT INTO room_images (room_id, url) VALUES ?',
          [imageValues]
        );
      }
    }

    const [updatedRoom] = await pool.execute(
      `SELECT r.*, 
        (SELECT JSON_ARRAYAGG(url) FROM room_images WHERE room_id = r.id) as images
       FROM rooms r WHERE r.id = ?`,
      [id]
    );

    if (updatedRoom.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = updatedRoom[0];
    room.features = JSON.parse(room.features || '{}');
    room.images = room.images ? JSON.parse(room.images) : [];

    res.json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete images first
    await pool.execute('DELETE FROM room_images WHERE room_id = ?', [id]);

    // Delete room
    const [result] = await pool.execute('DELETE FROM rooms WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

