# START HERE - Running GSMS Locally

This is the quick start guide to get your Garage Service Management System running on your PC with VSCode.

## Prerequisites

Before you start, make sure you have:
1. **Node.js** installed (version 14+) - Download from https://nodejs.org/
2. **VSCode** installed - Download from https://code.visualstudio.com/
3. **The GSMS project folder** on your computer

## Step-by-Step Setup

### 1. Open the Project in VSCode

```
1. Open VSCode
2. Click "File" → "Open Folder"
3. Navigate to your GSMS project folder
4. Click "Open"
```

You should now see the project files in the Explorer panel on the left.

### 2. Open Terminal in VSCode

```
1. Click "Terminal" menu at the top
2. Select "New Terminal"
3. You should see a terminal at the bottom of VSCode
```

### 3. Install Dependencies

In the terminal, type:
```bash
npm install
```

Wait for it to complete. You'll see messages like:
```
> better-sqlite3@X.X.X install
added XX packages
```

This downloads all the required packages your app needs.

### 4. Start the Server

In the terminal, type:
```bash
npm start
```

You should see:
```
GSMS Server running on http://localhost:3000
Database initialized and seeded with demo data
```

If you see this, congratulations! Your server is running.

### 5. Open in Your Browser

Open any web browser (Chrome, Firefox, Edge) and go to:
```
http://localhost:3000/index.html
```

You should see the GSMS landing page with a nice orange theme.

## Demo Accounts

Use these to login and test the system:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Technician | `john_tech` | `tech123` |
| Customer | `customer1` | `cust123` |

Click the buttons on the landing page, or go directly to http://localhost:3000/login.html

## Testing Each Role

### Test as Admin
1. Go to login page
2. Enter username: `admin` and password: `admin123`
3. Click Login
4. You'll see the Admin Dashboard with booking requests

### Test as Technician
1. Go to login page  
2. Enter username: `john_tech` and password: `tech123`
3. Click Login
4. You'll see the Technician Dashboard with assigned jobs

### Test as Customer
1. Go to login page
2. Enter username: `customer1` and password: `cust123`
3. Click Login
4. You'll see the Customer Dashboard with job history
5. Click "Book New Service" to test booking functionality

## Stopping the Server

When you want to stop the server:
```
1. Click in the terminal
2. Press Ctrl+C
3. Type "Y" and press Enter if prompted
```

## Troubleshooting

### "npm: command not found"
Node.js is not installed. Download from https://nodejs.org/

### "Port 3000 is already in use"
Another app is using port 3000. Either:
- Stop other applications
- Or edit `server.js` line 10 to use a different port like `3001`

### Files not loading / 404 errors
Make sure the server is running (you should see "Server running on http://localhost:3000")

### Cannot login
Use the exact credentials above. Password is case-sensitive.

## Project Files Explained

- **server.js** - The Express server that runs everything
- **database.js** - SQLite database setup and demo data
- **login.html** - Login page
- **admin-dashboard.html** - Admin interface
- **tech-dashboard.html** - Technician interface
- **customer-dashboard.html** - Customer interface
- **book-service.html** - Service booking page
- **index.html** - Landing page
- **styles.css** - All styling

## Next Steps

After getting it running, here's what to test:

1. ✓ Login with all three accounts
2. ✓ View admin dashboard and booking requests
3. ✓ View technician jobs
4. ✓ View customer dashboard and book a service
5. ✓ Open browser Developer Tools (F12) and check Console for any errors

## Need Help?

See **TROUBLESHOOTING.md** for detailed solutions to common issues.

---

**Ready? Let's go!**

```bash
npm install
npm start
```

Then open http://localhost:3000/index.html in your browser.
