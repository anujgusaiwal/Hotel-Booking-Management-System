import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;
    
    // Validate required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }
    
    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Validate role
    const userRole = role === 'admin' ? 'admin' : role === 'staff' ? 'staff' : 'customer';
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, phone || null, userRole]
    );
    
    // Get created user (without password)
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, role, password } = req.body;
    
    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id, email FROM users WHERE id = ?',
      [id]
    );
    
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const existingUser = existingUsers[0];
    
    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const [emailCheck] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      
      if (emailCheck.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone || null);
    }
    
    if (role) {
      const userRole = role === 'admin' ? 'admin' : role === 'staff' ? 'staff' : 'customer';
      updates.push('role = ?');
      values.push(userRole);
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    values.push(id);
    
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    // Get updated user
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    res.json({
      message: 'User updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    
    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user (cascade will handle related bookings)
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

