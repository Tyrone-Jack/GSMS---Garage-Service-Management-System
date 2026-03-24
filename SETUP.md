# GSMS Database Integration - Setup Guide

## Overview

The GSMS has been successfully transformed from a static HTML application to a full-stack application with:
- **Express.js** backend server
- **SQLite** database with 10 tables
- **RESTful API** with 15+ endpoints
- **Integrated frontend** with API calls for data persistence

## Architecture

```
User Frontend (HTML/CSS/JS)
        ↓ (HTTP/JSON)
    Express API Server
        ↓ (SQL)
    SQLite Database
```

## Files Added

### Backend Files
- **server.js** - Express server with all API endpoints
- **database.js** - SQLite schema and demo data seeding
- **package.json** - Node.js dependencies (express, better-sqlite3, cors)
- **api-utils.js** - Shared API utility functions for frontend

### Modified Frontend Files
- **login.html** - Updated to use `/api/login` endpoint
- **admin-dashboard.html** - Integrated with `/api/admin/*` endpoints
- **customer-dashboard.html** - Integrated with `/api/customer/*` endpoints
- **tech-dashboard.html** - Integrated with `/api/tech/*` endpoints
- **book-service.html** - Integrated with `/api/customer/projects` endpoint

### Configuration Files
- **.gitignore** - Excludes node_modules, database, logs
- **README.md** - Updated with new tech stack and setup instructions

## Database Schema

### Tables Created
1. **users** - User accounts (admin, technician, customer)
2. **services** - Service types and pricing
3. **vehicles** - Customer vehicles
4. **projects** - Service bookings
5. **jobs** - Technician work assignments
6. **job_progress** - Job status timeline
7. **job_notes** - Technician repair notes
8. **job_photos** - Repair documentation images
9. **invoices** - Billing records
10. **ratings** - Customer ratings

### Demo Data Seeded
- 3 demo users (admin, technician, customer)
- 6 service types with pricing
- 5 sample bookings and jobs

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will:
- Create `gsms.db` SQLite database
- Initialize all tables
- Seed demo data
- Start listening on `http://localhost:3000`

### 3. Access the Application
- **Login Page**: `http://localhost:3000/login.html`
- **Landing Page**: `http://localhost:3000/index.html`

### 4. Demo Credentials

#### Admin Account
- Username: `admin`
- Password: `admin123`
- Access: Admin Dashboard with booking management

#### Technician Account
- Username: `john_tech`
- Password: `tech123`
- Access: Technician Dashboard with job management

#### Customer Account
- Username: `customer1`
- Password: `cust123`
- Access: Customer Dashboard with booking tracking

## API Endpoints

### Authentication
```
POST /api/login
Body: { username, password }
Returns: User object with role
```

### Customer Endpoints
```
GET /api/customer/projects?customerId=ID         - Get customer bookings
POST /api/customer/projects                       - Create new booking
GET /api/customer/jobs?customerId=ID             - Get active jobs
GET /api/customer/invoices?customerId=ID         - Get invoices
```

### Admin Endpoints
```
GET /api/admin/projects                          - Get all bookings
GET /api/admin/projects?status=STATUS            - Filter by status
PUT /api/admin/projects/:id/status               - Update booking status
GET /api/admin/technicians                       - Get technician list
PUT /api/admin/jobs/:id/assign                   - Assign technician
```

### Technician Endpoints
```
GET /api/tech/jobs?technicianId=ID              - Get assigned jobs
PUT /api/tech/jobs/:id/status                   - Update job status
PUT /api/tech/jobs/:id/notes                    - Add service notes
GET /api/tech/jobs/:id/notes                    - Get job notes
```

### Shared Endpoints
```
GET /api/services                               - Get all services
GET /api/vehicles/:customerId                   - Get customer vehicles
```

## Data Flow Examples

### Customer Booking a Service
1. Customer logs in → `/api/login` validates credentials
2. Dashboard loads → `/api/customer/projects` fetches bookings
3. Customer clicks "Book Service" → fills form
4. Form submission → `POST /api/customer/projects` creates booking
5. Booking stored in database with "pending" status

### Admin Approving Booking
1. Admin logs in → `/api/login` validates credentials
2. Dashboard loads → `/api/admin/projects` fetches pending bookings
3. Admin clicks "Approve" → `PUT /api/admin/projects/:id/status` updates to "approved"
4. Job automatically created for assignment

### Technician Updating Job
1. Tech logs in → `/api/login` validates credentials
2. Dashboard loads → `/api/tech/jobs` fetches assigned jobs
3. Tech updates status → `PUT /api/tech/jobs/:id/status` updates job
4. Tech adds notes → `PUT /api/tech/jobs/:id/notes` stores notes
5. Customer sees real-time updates on dashboard

## Development Notes

### Session Management
- Uses browser `sessionStorage` to maintain login state
- User data stored as JSON in sessionStorage after login
- All API calls include user ID from sessionStorage
- Backend validates user role for authorization

### Error Handling
- All API calls wrapped in try/catch
- User-friendly error messages displayed
- Server errors logged to console
- Invalid credentials prevent login

### Database Locking
- SQLite uses file-based locking
- Safe for single-server deployments
- For production, consider migrating to PostgreSQL

## Testing the System

### Test Workflow
1. Log in as customer1/cust123
2. Navigate to "Book Service"
3. Select service, vehicle, date, and time
4. Click "Confirm Booking"
5. Log out and login as admin/admin123
6. See the pending booking in Admin Dashboard
7. Click "Approve" to approve the booking
8. Log in as john_tech/tech123 to see assigned job

### Verifying Database
The SQLite database (`gsms.db`) can be inspected with:
```bash
sqlite3 gsms.db
SELECT * FROM projects;
SELECT * FROM jobs;
.tables  # List all tables
```

## Troubleshooting

### Database Already Exists
If you want to reset the database:
```bash
rm gsms.db
npm start
```

### Port Already in Use
If port 3000 is busy, modify `server.js`:
```javascript
const PORT = 3001; // Change to different port
```

### Module Not Found
If you get "module not found" errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Session Expired
Users may need to refresh the page if session expires.
Session persists while browser tab is open.

## Next Steps

### Future Enhancements
1. Add photo upload functionality
2. Implement email notifications
3. Add real-time updates with WebSockets
4. Create mobile app
5. Add payment processing
6. Implement user registration
7. Add role-based access control (RLS)

### Database Migrations
When schema changes are needed:
1. Create a migration script in `/scripts/`
2. Update `database.js` with new schema
3. Run migration on server startup

### Performance Optimization
- Add database indexes for frequent queries
- Implement API response caching
- Compress API responses
- Consider pagination for large datasets

## Security Notes

### Current Implementation
- Passwords stored in plain text (demo only)
- No HTTPS encryption (development)
- No API key authentication
- Basic CORS enabled for all origins

### Production Recommendations
1. Use bcrypt for password hashing
2. Implement HTTPS/TLS
3. Add JWT token authentication
4. Implement proper CORS policies
5. Add rate limiting
6. Use environment variables for sensitive data
7. Implement SQL injection prevention

## Support

For issues or questions:
1. Check the console for error messages
2. Review `server.js` for API implementation
3. Check browser Network tab for API responses
4. Verify database exists with `ls -la gsms.db`
5. Check demo credentials are correct

---

Built as part of BSc Computer Technology at Multimedia University of Kenya
