# Staff Functionality Setup Guide

This guide explains how to set up and use the Staff functionality in the Hotel Booking Management System.

## Database Setup

1. **Run the migration script** to add staff support:
   ```bash
   mysql -u root -p hotel_booking < database/migration_add_staff.sql
   ```

   This will:
   - Add 'staff' role to the users table
   - Add new room statuses: 'occupied' and 'cleaning'
   - Create the `room_staff_assignments` table for tracking staff-room assignments

## Creating Staff Users

### Option 1: Via Admin Dashboard

1. Login as admin
2. Go to **Users** tab
3. Click **Add New User**
4. Fill in the form:
   - Full Name
   - Email
   - Password
   - Phone (optional)
   - **Role: Select "Staff"**
5. Click **Save**

### Option 2: Via SQL

```sql
-- Create a staff user
INSERT INTO users (full_name, email, password, phone, role) 
VALUES ('John Staff', 'staff@hotel.com', '$2a$10$...', '1234567890', 'staff');
```

**Note:** You'll need to hash the password using bcrypt. Use the `generate-hashes.js` script in the database folder.

## Staff Features

### Staff Dashboard

Staff members can access their personalized dashboard at `/staff` which includes:

1. **My Assigned Rooms Tab:**
   - View all rooms assigned to them
   - See room details (title, type, capacity, price)
   - Update room status:
     - Available
     - Occupied
     - Cleaning
     - Maintenance
     - Unavailable
   - View assignment date

2. **Bookings Tab:**
   - View all bookings for their assigned rooms
   - See customer information
   - View booking details (dates, guests, amount, status)

### Staff Permissions

- ✅ Can view assigned rooms
- ✅ Can update room status for assigned rooms
- ✅ Can view bookings for assigned rooms
- ❌ Cannot access admin features
- ❌ Cannot view other staff's rooms
- ❌ Cannot modify bookings
- ❌ Cannot access customer bookings outside their assigned rooms

## Admin Features for Staff Management

### Assigning Staff to Rooms

1. Login as admin
2. Go to **Staff** tab in Admin Dashboard
3. Click **Assign Staff to Room**
4. Select:
   - Room (from dropdown)
   - Staff Member (from dropdown)
5. Click **Assign**

### Viewing Assignments

In the **Staff** tab, admins can:
- View all staff members
- View current room-staff assignments
- See assignment details (room, staff, date)
- Unassign staff from rooms

### Managing Staff Users

In the **Users** tab, admins can:
- Create new staff users
- Edit staff user information
- Delete staff users
- Change user roles (including promoting/demoting staff)

## Real-Time Updates

- When admin assigns/unassigns staff to rooms, the changes are immediately visible to staff
- Staff can see their assigned rooms in real-time
- Room status updates by staff are immediately reflected in the system

## API Endpoints

### Staff Endpoints (Requires Staff Role)

- `GET /api/staff/rooms` - Get assigned rooms
- `PUT /api/staff/rooms/:id/status` - Update room status
- `GET /api/staff/bookings` - Get bookings for assigned rooms

### Admin Endpoints (Requires Admin Role)

- `GET /api/admin/staff` - Get all staff members
- `GET /api/admin/assignments` - Get all assignments
- `POST /api/admin/assign` - Assign staff to room
- `POST /api/admin/unassign` - Unassign staff from room

## Testing Staff Functionality

1. **Create a staff user:**
   - Login as admin
   - Go to Users tab
   - Create a new user with role "Staff"

2. **Assign rooms to staff:**
   - Go to Staff tab
   - Click "Assign Staff to Room"
   - Select a room and staff member
   - Click Assign

3. **Login as staff:**
   - Logout from admin account
   - Login with staff credentials
   - Navigate to Staff Dashboard
   - Verify assigned rooms are visible
   - Test updating room status
   - View bookings for assigned rooms

## Default Test Credentials

After running the seed script, you can use:
- **Admin:** admin@hotel.com / admin123
- **Staff:** Create via admin dashboard or use SQL

## Troubleshooting

### Staff can't see rooms
- Verify staff is assigned to rooms in Admin Dashboard > Staff tab
- Check staff role is correctly set to 'staff'
- Ensure staff is logged in

### Can't update room status
- Verify staff is assigned to that specific room
- Check room ID matches the assignment
- Verify staff role permissions

### Assignments not showing
- Refresh the page
- Check database for assignments in `room_staff_assignments` table
- Verify API endpoints are working

## Database Schema

### room_staff_assignments Table

```sql
CREATE TABLE room_staff_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  staff_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_assignment (room_id, staff_id)
);
```

## Security Notes

- Staff can only update status for rooms assigned to them
- Staff cannot access admin routes
- Role-based access control is enforced at both frontend and backend
- All API endpoints require proper authentication and authorization

