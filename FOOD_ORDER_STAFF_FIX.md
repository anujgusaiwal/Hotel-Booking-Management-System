# Food Order Staff Assignment Fix

## Issue
After a customer places a food order, the assigned staff member is not seeing the order in their dashboard.

## Root Cause
The issue can occur if:
1. The `staff_id` column doesn't exist in the `food_orders` table (migration not run)
2. The staff assignment is not being set correctly when orders are placed
3. The staff query is not finding orders correctly

## Solution Implemented

### 1. Enhanced Order Placement (`server/controllers/foodOrderController.js`)
- Added better error handling when checking staff assignments
- Added fallback logic if `staff_id` column doesn't exist
- Added detailed logging for debugging

### 2. Enhanced Staff Order Retrieval (`server/controllers/staffController.js`)
- Added fallback query that gets orders for rooms assigned to staff
- Works even if `staff_id` column doesn't exist
- Added detailed logging for debugging

### 3. Database Migration
Make sure to run the migration to add the `staff_id` column:

```bash
mysql -u root -p hotel_booking < database/migration_add_staff_to_orders.sql
```

## How It Works Now

### When Customer Places Order:
1. System checks if staff is assigned to the room
2. If staff is assigned, `staff_id` is set in the order
3. If no staff assigned, `staff_id` is NULL
4. Order is created with staff assignment

### When Staff Views Orders:
1. First tries to get orders where `staff_id` matches staff ID
2. If `staff_id` column doesn't exist, falls back to getting orders for rooms assigned to the staff
3. Returns all orders for rooms assigned to the staff member

## Testing Steps

1. **Ensure Migration is Run:**
   ```bash
   mysql -u root -p hotel_booking < database/migration_add_staff_to_orders.sql
   ```

2. **Assign Staff to Room:**
   - Login as Admin
   - Go to Staff tab
   - Assign a staff member to a room

3. **Place Food Order:**
   - Login as Customer
   - Go to Food Menu
   - Select a room (must have active booking)
   - Place an order

4. **Check Staff Dashboard:**
   - Login as the assigned Staff member
   - Go to Food Orders tab
   - Should see the order

## Debugging

Check server logs for:
- `Found staff assignment for room X: staff_id = Y`
- `Food order created with ID: X, Staff ID: Y`
- `Fetching food orders for staff ID: X`
- `Found X food orders for staff ID: Y`

If you see warnings about `staff_id` column not found, run the migration.

## Verification Query

Run this SQL to verify staff assignments:

```sql
-- Check recent orders with staff assignment
SELECT 
    fo.id,
    fo.room_id,
    fo.staff_id,
    r.room_number,
    r.title as room_title,
    staff.full_name as staff_name,
    fo.status,
    fo.created_at
FROM food_orders fo
LEFT JOIN rooms r ON fo.room_id = r.id
LEFT JOIN users staff ON fo.staff_id = staff.id
ORDER BY fo.created_at DESC
LIMIT 10;
```

## Notes

- Orders placed before staff assignment will have `staff_id = NULL`
- Staff will only see orders for rooms they are currently assigned to
- If staff is unassigned from a room, they will still see historical orders (staff_id remains set)

