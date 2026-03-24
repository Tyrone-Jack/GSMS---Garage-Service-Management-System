# GSMS Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Port 3000 is already in use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. Find the process using port 3000:
   - **Windows:** `netstat -ano | findstr :3000`
   - **Mac/Linux:** `lsof -i :3000`

2. Kill the process:
   - **Windows:** `taskkill /PID <PID> /F`
   - **Mac/Linux:** `kill -9 <PID>`

3. Or change the port in `server.js`:
   ```javascript
   const PORT = 3001; // Change from 3000
   ```

### Issue 2: "Cannot GET /login.html"

**Error Message:**
```
Cannot GET /login.html
Error: 404 Not Found
```

**Solution:**
1. Make sure the server is started: `npm start`
2. Verify files exist in the project folder
3. Check that server.js line 15 reads:
   ```javascript
   app.use(express.static(__dirname));
   ```
4. Ensure you're using the correct URL: `http://localhost:3000/login.html`

### Issue 3: "Cannot find module" error

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
npm install
```
This installs all dependencies from package.json.

### Issue 4: "Login fails - 'Invalid credentials'"

**Common Causes:**
- Using wrong username or password
- Database not seeded properly

**Solution:**
1. Use the correct demo credentials:
   - Admin: `admin` / `admin123`
   - Technician: `john_tech` / `tech123`
   - Customer: `customer1` / `cust123`

2. Verify database was created:
   - Check if `gsms.db` file exists in project folder
   - Delete `gsms.db` and restart server to reseed

### Issue 5: "Cannot GET /api/..." API endpoints return 404

**Error Message:**
```
Cannot GET /api/login
Error: 404 Not Found
```

**Solution:**
1. Verify server.js is running
2. Check that endpoints match exactly (case-sensitive)
3. Make sure you're sending the correct HTTP method (POST vs GET)
4. Verify Content-Type header is set to `application/json`

### Issue 6: Dashboard shows "No active jobs" or data not loading

**Solution:**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Check for any red error messages
4. Go to Network tab to verify API calls succeed
5. Ensure you're logged in with correct credentials
6. Check that database has demo data by:
   - Deleting `gsms.db`
   - Restarting server with `npm start`

### Issue 7: Styling issues - CSS not applying

**Error in Console:**
```
Failed to load resource: the server responded with a status of 404
```

**Solution:**
1. Hard refresh page: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache:
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Options → Privacy & Security → Clear Data
3. Verify styles.css exists in project root

### Issue 8: Font or stylesheet loading errors

**Error in Console:**
```
Loading the stylesheet violates Content Security Policy directive
```

**This is expected** - it's a browser security warning, not a fatal error. The app will still work.

## Browser Console - What's Normal vs What's a Problem

### Normal (Safe to Ignore):
- Content Security Policy warnings about fonts
- Chrome extension errors
- Warnings about deprecated APIs

### Problems (Need to Fix):
- "Cannot GET" with 404 errors
- "TypeError: Cannot read property" errors
- "ReferenceError: function is not defined" errors
- API endpoints returning 500 errors

## Testing the Application Locally

### Step-by-Step Test:

1. **Start the server:**
   ```bash
   npm start
   ```
   You should see: `GSMS Server running on http://localhost:3000`

2. **Open in browser:**
   ```
   http://localhost:3000/index.html
   ```

3. **Click "Get Started" or "Sign In"**
   - Should navigate to login page

4. **Try all three demo accounts:**
   - Admin: `admin` / `admin123` → Admin Dashboard
   - Technician: `john_tech` / `tech123` → Tech Dashboard  
   - Customer: `customer1` / `cust123` → Customer Dashboard

5. **Test each dashboard:**
   - Admin: View booking requests, see technician list
   - Customer: View booked jobs, book new service
   - Technician: View assigned jobs, update status

## Performance Tips

- If app feels slow, check your internet connection
- Close unused browser tabs and applications
- Restart the Node server if it seems unresponsive
- Clear browser cache regularly

## Getting Help

If none of these solutions work:

1. Check the exact error message in browser console (F12)
2. Note down the error and steps to reproduce
3. Verify all files are in the correct location
4. Try a fresh start:
   ```bash
   rm gsms.db          # Delete database
   npm install         # Reinstall dependencies
   npm start           # Restart server
   ```

## File Structure Verification

Make sure these files exist in your project:

```
project-folder/
├── server.js                 ✓
├── database.js              ✓
├── package.json             ✓
├── styles.css               ✓
├── index.html               ✓
├── login.html               ✓
├── admin-dashboard.html     ✓
├── tech-dashboard.html      ✓
├── customer-dashboard.html  ✓
└── book-service.html        ✓
```

If any file is missing, the application won't work correctly.
