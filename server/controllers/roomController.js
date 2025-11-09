import pool from '../config/database.js';

export const getRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, capacity, status, room_type } = req.query;
    
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

    if (room_type) {
      query += ' AND r.room_type = ?';
      params.push(room_type);
    }

    query += ' ORDER BY r.id DESC';

    const [rooms] = await pool.execute(query, params);

    // Parse JSON fields
    const formattedRooms = rooms.map(room => {
      let features = {};
      let images = [];
      
      // Handle features - check if it's already an object or a string
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
      
      // Handle images - check if it's already an array or a string
      if (room.images) {
        if (typeof room.images === 'string') {
          try {
            images = JSON.parse(room.images);
          } catch (e) {
            images = [];
          }
        } else if (Array.isArray(room.images)) {
          images = room.images;
        } else {
          images = [];
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
    
    // Handle features - check if it's already an object or a string
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
    
    // Handle images - check if it's already an array or a string
    if (room.images) {
      if (typeof room.images === 'string') {
        try {
          room.images = JSON.parse(room.images);
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
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { title, description, capacity, price_per_night, features, status, images, room_type } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO rooms (title, description, capacity, price_per_night, features, status, room_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, capacity, price_per_night, JSON.stringify(features || {}), status || 'available', room_type || 'standard']
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

    if (newRoom.length === 0) {
      return res.status(500).json({ message: 'Failed to retrieve created room' });
    }

    const room = newRoom[0];
    
    // Handle features - check if it's already an object or a string
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
    
    // Handle images - check if it's already an array or a string
    if (room.images) {
      if (typeof room.images === 'string') {
        try {
          room.images = JSON.parse(room.images);
        } catch (e) {
          room.images = [];
        }
      } else if (!Array.isArray(room.images)) {
        room.images = [];
      }
    } else {
      room.images = [];
    }

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, capacity, price_per_night, features, status, images, room_type } = req.body;

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
    if (room_type !== undefined) {
      updateFields.push('room_type = ?');
      params.push(room_type);
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
    
    // Handle features - check if it's already an object or a string
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
    
    // Handle images - check if it's already an array or a string
    if (room.images) {
      if (typeof room.images === 'string') {
        try {
          room.images = JSON.parse(room.images);
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

