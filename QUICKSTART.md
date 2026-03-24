# GSMS - Local Setup Guide for VSCode

## Prerequisites

Before you begin, ensure you have:
- **Node.js** installed (version 16 or higher) - Download from https://nodejs.org/
- **Visual Studio Code** - Download from https://code.visualstudio.com/
- **Git** (optional but recommended)

## Step-by-Step Setup Instructions

### 1. Clone or Download the Project

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/Tyrone-Jack/GSMS---Garage-Service-Management-System.git
cd GSMS---Garage-Service-Management-System
```

**Option B: Download as ZIP**
- Go to the GitHub repository
- Click "Code" → "Download ZIP"
- Extract the ZIP file to your desired location
- Open terminal/command prompt and navigate to the extracted folder

### 2. Open Project in VSCode

```bash
code .
```

Or manually:
- Open VSCode
- File → Open Folder
- Select the GSMS project folder
- Click "Open"

### 3. Install Dependencies

In VSCode's integrated terminal (Terminal → New Terminal or Ctrl+`):

```bash
npm install
```

This will install:
- **express** - Web framework
- **better-sqlite3** - SQLite database
- **cors** - Cross-Origin Resource Sharing

Wait for the installation to complete (you'll see a message like "added 87 packages").

### 4. Start the Server

```bash
npm start
```

You should see output like:
```
Server running at http://localhost:3000
Database initialized and seeded with demo data
```

### 5. Access the Application

Open your web browser and go to:
```
http://localhost:3000/login.html
```

## Demo Login Credentials

Use these credentials to test different user roles:

### Admin Account
- **Username:** admin
- **Password:** admin123
- Access to all booking management and technician assignment

### Technician Account
- **Username:** john_tech
- **Password:** tech123
- Can view assigned jobs and update job status

### Customer Account
- **Username:** customer1
- **Password:** cust123
- Can book services and track repair progress

## Testing the Application

### 1. Test Login Flow
- Try logging in with each role above
- You should be redirected to the appropriate dashboard

### 2. Test Admin Dashboard
- Login as admin
- View all bookings
- Click "Approve" or "Reject" to manage bookings
- View technician list

### 3. Test Technician Dashboard
- Login as john_tech
- View assigned jobs
- See job details and customer information

### 4. Test Customer Dashboard
- Login as customer1
- View active jobs and projects
- Contact technician feature

### 5. Test Booking Service
- Go to http://localhost:3000/book-service.html
- Select a service and vehicle
- Complete the booking form

## Stopping the Server

In VSCode terminal:
- Press `Ctrl+C` to stop the server
- You'll see the prompt return

## Common Issues & Solutions

### Issue: "npm not found"
**Solution:** Node.js is not installed. Download and install from https://nodejs.org/

### Issue: "Port 3000 already in use"
**Solution:** Another application is using port 3000. Either:
- Stop the other application
- Or modify `server.js` line 10: change `const PORT = 3000;` to `const PORT = 5000;` (or any available port)

### Issue: "Cannot find module 'better-sqlite3'"
**Solution:** Run `npm install` again. If this fails, try:
```bash
npm install --save better-sqlite3
```

### Issue: "Database lock" error
**Solution:** Make sure the server isn't running in multiple terminals. Stop all instances and restart.

### Issue: CSS/styling not loading
**Solution:** Make sure the server is running and refresh the browser (Ctrl+F5 for hard refresh)

## Development Mode

For automatic server restart on file changes:

```bash
npm run dev
```

This uses Node's `--watch` flag to automatically reload when you modify `server.js` or `database.js`.

## File Structure

```
GSMS/
├── server.js                  # Express server (main application)
├── database.js               # SQLite database setup
├── package.json              # Dependencies
├── api-utils.js              # Shared utility functions
│
├── public/
│   ├── login.html            # Login page
│   ├── index.html            # Home/landing page
│   ├── book-service.html     # Service booking
│   ├── admin-dashboard.html  # Admin panel
│   ├── tech-dashboard.html   # Technician panel
│   ├── customer-dashboard.html # Customer portal
│   └── styles.css            # Styling
│
├── gsms.db                   # SQLite database (auto-created)
└── README.md                 # Project documentation
```

## Verifying Everything Works

1. Server running at `http://localhost:3000`? ✓
2. Can access login page? ✓
3. Can log in with demo credentials? ✓
4. Can navigate between dashboards? ✓

If all these work, your setup is complete and the application is ready for presentation!

## Next Steps

### To Customize:
- Edit HTML files in the root directory to change layouts
- Edit `styles.css` for styling changes
- Modify `server.js` to add new API endpoints
- Update `database.js` for database schema changes

### To Deploy:
- Push to GitHub: `git push origin main`
- Deploy to Vercel, Render, Railway, or Heroku
- See individual platform documentation for Node.js deployment

## Support & Troubleshooting

If you encounter issues:
1. Check that Node.js and npm are properly installed
2. Ensure port 3000 is available
3. Try clearing the terminal and restarting: `Ctrl+C` then `npm start`
4. Check the browser console for JavaScript errors (F12)
5. Check the terminal for server error messages
