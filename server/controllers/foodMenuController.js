import pool from '../config/database.js';

// Get all food menu items
export const getFoodMenu = async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT * FROM food_menu ORDER BY name ASC'
    );

    res.json(items);
  } catch (error) {
    console.error('Get food menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get food menu item by ID
export const getFoodMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const [items] = await pool.execute(
      'SELECT * FROM food_menu WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error('Get food menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create food menu item (Admin only)
export const createFoodMenuItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO food_menu (name, description, price) VALUES (?, ?, ?)',
      [name, description || null, price]
    );

    const [newItem] = await pool.execute(
      'SELECT * FROM food_menu WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Create food menu item error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Food item with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update food menu item (Admin only)
export const updateFoodMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const updateFields = [];
    const params = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      params.push(description);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      params.push(price);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(id);

    const [result] = await pool.execute(
      `UPDATE food_menu SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const [updatedItem] = await pool.execute(
      'SELECT * FROM food_menu WHERE id = ?',
      [id]
    );

    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Update food menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete food menu item (Admin only)
export const deleteFoodMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM food_menu WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

