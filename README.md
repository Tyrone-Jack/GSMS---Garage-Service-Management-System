🚗 Garage Service Management System (GSMS)








A web-based platform for managing vehicle service requests, job cards, technician assignments, and repair tracking for auto garages.

✨ Overview

The Garage Service Management System (GSMS) is a digital solution designed to improve how automotive service centers manage repair workflows.

Many garages still rely on manual record keeping, paper job cards, and verbal communication between staff and customers. This can result in:

❌ lost records
❌ delayed service updates
❌ poor repair tracking
❌ inefficient garage operations

GSMS replaces this process with a centralized digital platform that connects customers, technicians, and administrators in one system.

🧩 Core Idea

Instead of paperwork and phone calls, the repair process becomes:

Customer Books Service
        ↓
System Creates Job Card
        ↓
Admin Assigns Technician
        ↓
Technician Updates Repair Progress
        ↓
Customer Tracks Repair Status

This creates a transparent and efficient workflow for garage operations.

👥 User Roles

The system supports three main roles.

👤 Customer

Customers can:

Book vehicle service

Track repair progress

View technician updates

Check repair status

🛠 Technician

Technicians can:

View assigned job cards

Update repair progress

Add repair notes

Upload repair images

🧑‍💼 Admin

Administrators manage the system by:

Viewing incoming service requests

Managing job cards

Assigning technicians

Monitoring repair progress

⚙️ Features

✔ User authentication system
✔ Role-based dashboards
✔ Service booking system
✔ Automatic job card creation
✔ Technician repair updates
✔ Customer repair tracking

🖥️ System Screens (Concept)
Landing Page

Entry page introducing the system and navigation to login.

Login System

Users authenticate using username or email and are redirected to their role dashboard.

Admin Dashboard

Admins manage job cards and technician assignments.

Technician Dashboard

Technicians update repair status and document repair progress.

Customer Dashboard

Customers track repair progress and job card updates.

🛠 Tech Stack
Frontend
HTML5
CSS3
Vanilla JavaScript
Backend
Express.js
SQLite Database
Node.js
CORS for API integration
📂 Project Structure
GSMS/
│
├── server.js                 # Express server entry point
├── database.js              # SQLite database setup and seeding
├── package.json             # Node.js dependencies
│
├── public/                  # Frontend files (served by Express)
│   ├── index.html          # Landing page
│   ├── login.html          # Authentication page
│   ├── book-service.html   # Service booking form
│   ├── admin-dashboard.html
│   ├── tech-dashboard.html
│   ├── customer-dashboard.html
│   └── styles.css          # Global styling
│
├── api-utils.js            # Shared API utility functions
├── gsms.db                 # SQLite database (auto-created)
└── README.md
🚀 Getting Started

Installation

npm install

Running the Server

npm start

The server will start on http://localhost:3000 and the database will be auto-created and seeded with demo data.

Demo Credentials

Admin
Username: admin
Password: admin123

Technician
Username: john_tech
Password: tech123

Customer
Username: customer1
Password: cust123

API Endpoints

Authentication
POST /api/login

Customer Endpoints
GET /api/customer/projects?customerId=ID
POST /api/customer/projects
GET /api/customer/jobs?customerId=ID
GET /api/customer/invoices?customerId=ID

Admin Endpoints
GET /api/admin/projects
PUT /api/admin/projects/:id/status
GET /api/admin/technicians
PUT /api/admin/jobs/:id/assign

Technician Endpoints
GET /api/tech/jobs?technicianId=ID
PUT /api/tech/jobs/:id/status
PUT /api/tech/jobs/:id/notes
GET /api/tech/jobs/:id/notes

Shared Endpoints
GET /api/services
GET /api/vehicles/:customerId
🚀 Future Enhancements

Planned features for future development:

🔹 Photo upload and storage
🔹 Real-time job updates with WebSockets
🔹 Notification system (email/SMS)
🔹 Advanced analytics and reporting
🔹 Technician performance tracking
🔹 Customer ratings and reviews
🔹 Payment processing integration
🔹 Mobile app development
🔹 PDF invoice generation
🔹 Email notifications

🎓 Academic Context

This project is developed as part of a Bachelor of Science in Computer Technology program.

The goal is to demonstrate how web technologies can digitize and improve real-world business processes, specifically in automotive service environments.

👨‍💻 Author

Tyrone Jack
BSc Computer Technology
Multimedia University of Kenya

⭐ Support

If you find this project interesting or useful:

⭐ Star the repository
🍴 Fork the project
📢 Share feedback
