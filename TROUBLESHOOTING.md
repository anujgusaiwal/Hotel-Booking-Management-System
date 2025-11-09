# Troubleshooting Guide

## Blank Page on My Bookings

If you see a completely blank page (white screen), follow these steps:

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to the **Console** tab
3. Look for any **red error messages**
4. Share the error message if you see one

### Step 2: Check if You're Logged In
1. Look at the top right of the page
2. If you see "Login" and "Register" buttons, you're **not logged in**
3. **Solution**: Click "Login" and sign in first

### Step 3: Check Network Requests
1. Press **F12** → Go to **Network** tab
2. Refresh the page
3. Look for a request to `/api/bookings`
4. Check the status code:
   - **200** = Success (but might have no bookings)
   - **401** = Not logged in
   - **500** = Server error

### Step 4: Verify Server is Running
1. Check your terminal where the server is running
2. You should see: `Server running on port 5000`
3. If not, start the server:
   ```bash
   cd server
   npm run dev
   ```

### Step 5: Verify Frontend is Running
1. Check your terminal where the frontend is running
2. You should see: `Local: http://localhost:5173` (or similar)
3. If not, start the frontend:
   ```bash
   cd client
   npm run dev
   ```

### Step 6: Clear Browser Cache
1. Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page with **Ctrl+Shift+R** (hard refresh)

## Common Issues and Solutions

### Issue: "Not authorized, no token"
**Solution**: You're not logged in. Login first.

### Issue: "Server error" or 500 error
**Solution**: 
- Check if MySQL is running
- Check your `.env` file in the `server` folder
- Check server console for detailed errors

### Issue: Page is blank but no errors
**Solution**:
- Make sure both server and client are running
- Check if you're accessing the correct URL
- Try accessing `http://localhost:5173` (or the port shown in terminal)

### Issue: Bookings not showing after creating one
**Solution**:
- Make sure you're logged in
- Check browser console for errors
- Try refreshing the page
- Check if the booking was actually created (check database or admin panel)

## Quick Fixes

1. **Restart everything**:
   - Stop both servers (Ctrl+C)
   - Start server: `cd server && npm run dev`
   - Start client: `cd client && npm run dev` (in new terminal)

2. **Clear localStorage**:
   - Press F12 → Console tab
   - Type: `localStorage.clear()`
   - Press Enter
   - Refresh page and login again

3. **Check database**:
   - Make sure MySQL is running
   - Verify database exists: `SHOW DATABASES;`
   - Check if bookings table exists: `USE hotel_booking; SHOW TABLES;`

