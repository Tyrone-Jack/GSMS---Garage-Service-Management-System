import express from "express";
import cors from "cors";
import db, { initializeDatabase } from "./database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increase payload limit for photo uploads (50MB limit)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

// Welcome endpoint
app.get("/api/", (req, res) => {
  res.json({
    message: "GSMS API Server",
    version: "1.0.0",
    endpoints: {
      services: "/api/services",
      vehicles: "/api/vehicles/:customerId",
      bookings: "/api/customer/projects",
      jobs: "/api/customer/jobs?customerId=1",
      invoices: "/api/customer/invoices?customerId=1",
    },
  });
});

// Initialize database on startup
initializeDatabase();

// ==================== AUTHENTICATION ROUTES ====================

/*// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    
    console.log('Login attempt:', { email, role }); // Debug log
    
    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ? AND role = ?').get(email, password, role);
        
        if (user) {
            console.log('Login successful for:', email);
            // Don't send password back
            delete user.password;
            res.json({ success: true, user });
        } else {
            console.log('Login failed for:', email);
            res.status(401).json({ success: false, message: 'Invalid email, password, or role combination' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});*/
// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;

  console.log("Login attempt:", { email, role });

  try {
    // Check if email is actually a username
    let user = db
      .prepare(
        "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?",
      )
      .get(email, password, role);

    // If not found by email, try by username
    if (!user) {
      user = db
        .prepare(
          "SELECT * FROM users WHERE username = ? AND password = ? AND role = ?",
        )
        .get(email, password, role);
    }

    if (user) {
      console.log("Login successful for:", email);
      // Don't send password back
      delete user.password;
      res.json({ success: true, user });
    } else {
      console.log("Login failed for:", email);
      res
        .status(401)
        .json({
          success: false,
          message: "Invalid email/username, password, or role combination",
        });
    }
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
});
// Find user by username or email
app.post("/api/user/find", (req, res) => {
  const { identifier } = req.body;

  try {
    // Check if identifier is email or username
    const user = db
      .prepare(
        `
            SELECT id, name, email, role, username 
            FROM users 
            WHERE email = ? OR username = ?
        `,
      )
      .get(identifier, identifier);

    if (user) {
      res.json({
        exists: true,
        email: user.email,
        role: user.role,
        name: user.name,
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/*// Register endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    
    console.log('Registration attempt:', { name, email, role }); // Debug log
    
    // Validate required fields
    if (!name || !email || !password || !role) {
        console.log('Missing fields:', { name, email, password, role });
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Validate role
    if (!['customer', 'technician', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    
    try {
        // Check if user already exists
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        // Insert new user
        const stmt = db.prepare(`
            INSERT INTO users (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(name, email, password, role);
        console.log('User inserted, ID:', result.lastInsertRowid);
        
        // Get the created user (without password)
        const newUser = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        
        console.log('Registration successful for:', email);
        
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Registration error details:', error);
        
        // Check for specific SQLite errors
        if (error.code === 'SQLITE_CONSTRAINT') {
            if (error.message.includes('UNIQUE')) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration: ' + error.message 
        });
    }
});*/
// Register endpoint
app.post("/api/register", (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("Registration attempt:", { name, email, role });

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Validate role
  if (!["customer", "technician", "admin"].includes(role)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid role selected" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 6 characters",
      });
  }

  try {
    // Check if user already exists
    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Generate username from email
    let username = email.split("@")[0];
    let counter = 1;
    let originalUsername = username;

    // Make username unique
    while (true) {
      const existing = db
        .prepare("SELECT id FROM users WHERE username = ?")
        .get(username);
      if (!existing) break;
      username = `${originalUsername}${counter}`;
      counter++;
    }

    // Insert new user
    const stmt = db.prepare(`
            INSERT INTO users (name, email, username, password, role) 
            VALUES (?, ?, ?, ?, ?)
        `);

    const result = stmt.run(name, email, username, password, role);

    // Get the created user
    const newUser = db
      .prepare(
        "SELECT id, name, email, username, role, created_at FROM users WHERE id = ?",
      )
      .get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during registration: " + error.message,
      });
  }
});

// ==================== SERVICE ROUTES ====================

// Get all services
app.get("/api/services", (req, res) => {
  try {
    const services = db
      .prepare("SELECT * FROM services WHERE is_active = 1")
      .all();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Get single service
app.get("/api/services/:id", (req, res) => {
  try {
    const service = db
      .prepare("SELECT * FROM services WHERE id = ?")
      .get(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// ==================== VEHICLE ROUTES ====================

// Get vehicles by customer ID
app.get("/api/vehicles/:customerId", (req, res) => {
  try {
    const vehicles = db
      .prepare("SELECT * FROM vehicles WHERE customer_id = ?")
      .all(req.params.customerId);
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// Add new vehicle
app.post("/api/vehicles", (req, res) => {
  const { customer_id, make, model, year, license_plate, color } = req.body;

  try {
    const stmt = db.prepare(`
            INSERT INTO vehicles (customer_id, make, model, year, license_plate, color) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);
    const result = stmt.run(
      customer_id,
      make,
      model,
      year,
      license_plate,
      color,
    );

    const newVehicle = db
      .prepare("SELECT * FROM vehicles WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("Error adding vehicle:", error);
    if (error.message.includes("UNIQUE constraint")) {
      res.status(400).json({ error: "License plate already exists" });
    } else {
      res.status(500).json({ error: "Failed to add vehicle" });
    }
  }
});

// ==================== PROJECT/BOOKING ROUTES ====================

// Create new booking
app.post("/api/customer/projects", (req, res) => {
  const { customerId, vehicleId, serviceId, preferredDate, notes } = req.body;

  try {
    const stmt = db.prepare(`
            INSERT INTO projects (customer_id, vehicle_id, service_id, preferred_date, notes, status) 
            VALUES (?, ?, ?, ?, ?, 'pending')
        `);
    const result = stmt.run(
      customerId,
      vehicleId,
      serviceId,
      preferredDate,
      notes,
    );

    const newProject = db
      .prepare(
        `
            SELECT p.*, s.name as service_name, s.price, v.make, v.model, v.license_plate 
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            WHERE p.id = ?
        `,
      )
      .get(result.lastInsertRowid);

    // Create invoice for this project
    const invoiceStmt = db.prepare(`
            INSERT INTO invoices (project_id, amount, status) 
            VALUES (?, ?, 'pending')
        `);
    invoiceStmt.run(result.lastInsertRowid, newProject.price);

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

/*// Get customer's projects (jobs)
app.get('/api/customer/jobs', (req, res) => {
    const { customerId } = req.query;
    
    try {
        const jobs = db.prepare(`
            SELECT 
                p.*,
                s.name as service_name,
                s.price,
                v.make,
                v.model,
                v.license_plate,
                u.name as tech_name
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            LEFT JOIN users u ON p.technician_id = u.id
            WHERE p.customer_id = ?
            ORDER BY p.created_at DESC
        `).all(customerId);
        
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});*/
// Get customer's projects (jobs) - add reviewed field
app.get("/api/customer/jobs", (req, res) => {
  const { customerId } = req.query;

  try {
    const jobs = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.price,
                v.make,
                v.model,
                v.license_plate,
                u.name as tech_name,
                COALESCE(p.reviewed, 0) as reviewed
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            LEFT JOIN users u ON p.technician_id = u.id
            WHERE p.customer_id = ?
            ORDER BY p.created_at DESC
        `,
      )
      .all(customerId);

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get single project details
app.get("/api/projects/:id", (req, res) => {
  try {
    const project = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.price,
                s.duration_minutes,
                v.make,
                v.model,
                v.license_plate,
                v.year,
                v.color,
                u.name as tech_name,
                u.email as tech_email
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            LEFT JOIN users u ON p.technician_id = u.id
            WHERE p.id = ?
        `,
      )
      .get(req.params.id);

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Update project status (for technicians/admins)
app.patch("/api/projects/:id/status", (req, res) => {
  const { status, technicianId } = req.body;
  const projectId = req.params.id;

  try {
    const updateData = { status };
    if (technicianId) updateData.technician_id = technicianId;

    const stmt = db.prepare(`
            UPDATE projects 
            SET status = ?, 
                technician_id = COALESCE(?, technician_id),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
    stmt.run(status, technicianId || null, projectId);

    const updatedProject = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(projectId);
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});
// Get all jobs for admin
app.get("/api/admin/jobs", (req, res) => {
  try {
    const jobs = db
      .prepare(
        `
            SELECT 
                p.id,
                p.status,
                p.preferred_date,
                p.created_at,
                p.completed_at,
                p.notes,
                p.repair_notes,
                p.final_price,
                s.name as service_name,
                s.price as service_price,
                v.make,
                v.model,
                v.year,
                v.license_plate,
                v.color,
                c.name as customer_name,
                c.username as customer_username,
                t.name as technician_name,
                t.username as technician_username,
                i.amount,
                i.status as payment_status
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users c ON p.customer_id = c.id
            LEFT JOIN users t ON p.technician_id = t.id
            LEFT JOIN invoices i ON p.id = i.project_id
            ORDER BY p.created_at DESC
        `,
      )
      .all();

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});
// Get full job details for admin (for download)
app.get("/api/admin/jobs/:id/full", (req, res) => {
  const jobId = req.params.id;

  try {
    const job = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.price,
                s.description,
                v.make,
                v.model,
                v.year,
                v.license_plate,
                v.color,
                c.name as customer_name,
                c.username as customer_username,
                t.name as technician_name,
                t.username as technician_username,
                i.amount as invoice_amount,
                i.status as payment_status
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users c ON p.customer_id = c.id
            LEFT JOIN users t ON p.technician_id = t.id
            LEFT JOIN invoices i ON p.id = i.project_id
            WHERE p.id = ?
        `,
      )
      .get(jobId);

    if (job) {
      // Get parts
      job.parts = db
        .prepare("SELECT * FROM parts_used WHERE project_id = ?")
        .all(jobId);

      // Get photos
      job.photos = db
        .prepare("SELECT * FROM job_photos WHERE project_id = ?")
        .all(jobId);

      // Get updates
      job.updates = db
        .prepare(
          `
                SELECT ju.*, u.name as technician_name 
                FROM job_updates ju
                JOIN users u ON ju.technician_id = u.id
                WHERE ju.project_id = ?
                ORDER BY ju.created_at DESC
            `,
        )
        .all(jobId);

      res.json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
});

// Get filter options for admin dashboard
app.get("/api/admin/filter-options", (req, res) => {
  try {
    const customers = db
      .prepare(
        `
            SELECT DISTINCT u.id, u.name, u.username 
            FROM users u
            JOIN projects p ON u.id = p.customer_id
            ORDER BY u.name
        `,
      )
      .all();

    const services = db
      .prepare(
        `
            SELECT DISTINCT s.id, s.name 
            FROM services s
            JOIN projects p ON s.id = p.service_id
            ORDER BY s.name
        `,
      )
      .all();

    const technicians = db
      .prepare(
        `
            SELECT DISTINCT u.id, u.name, u.username 
            FROM users u
            JOIN projects p ON u.id = p.technician_id
            WHERE p.technician_id IS NOT NULL
            ORDER BY u.name
        `,
      )
      .all();

    res.json({ customers, services, technicians });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});

// ==================== INVOICE ROUTES ====================

// Get customer invoices
app.get("/api/customer/invoices", (req, res) => {
  const { customerId } = req.query;

  try {
    const invoices = db
      .prepare(
        `
            SELECT 
                i.*,
                p.customer_id,
                s.name as service_name
            FROM invoices i
            JOIN projects p ON i.project_id = p.id
            JOIN services s ON p.service_id = s.id
            WHERE p.customer_id = ?
            ORDER BY i.created_at DESC
        `,
      )
      .all(customerId);

    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// Pay invoice (update status)
app.patch("/api/invoices/:id/pay", (req, res) => {
  const invoiceId = req.params.id;

  try {
    const stmt = db.prepare(`
            UPDATE invoices 
            SET status = 'paid', 
                payment_date = CURRENT_TIMESTAMP 
            WHERE id = ?
        `);
    stmt.run(invoiceId);

    const updatedInvoice = db
      .prepare("SELECT * FROM invoices WHERE id = ?")
      .get(invoiceId);
    res.json(updatedInvoice);
  } catch (error) {
    console.error("Error paying invoice:", error);
    res.status(500).json({ error: "Failed to pay invoice" });
  }
});

// ==================== TECHNICIAN ROUTES ====================

// Get technician's assigned jobs
app.get("/api/technician/jobs", (req, res) => {
  const { technicianId } = req.query;

  try {
    const jobs = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.duration_minutes,
                v.make,
                v.model,
                v.license_plate,
                u.name as customer_name
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users u ON p.customer_id = u.id
            WHERE p.technician_id = ?
            ORDER BY p.preferred_date ASC
        `,
      )
      .all(technicianId);

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching technician jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ==================== DASHBOARD STATS ====================

/*(// Get customer dashboard stats
app.get('/api/customer/stats', (req, res) => {
    const { customerId } = req.query;
    
    try {
        const pendingCount = db.prepare(`
            SELECT COUNT(*) as count FROM projects 
            WHERE customer_id = ? AND status = 'pending'
        `).get(customerId);
        
        const activeCount = db.prepare(`
            SELECT COUNT(*) as count FROM projects 
            WHERE customer_id = ? AND status IN ('approved', 'in_progress')
        `).get(customerId);
        
        const completedCount = db.prepare(`
            SELECT COUNT(*) as count FROM projects 
            WHERE customer_id = ? AND status = 'completed'
        `).get(customerId);
        
        const totalSpent = db.prepare(`
            SELECT SUM(i.amount) as total FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE p.customer_id = ? AND i.status = 'paid'
        `).get(customerId);
        
        res.json({
            pending: pendingCount.count,
            active: activeCount.count,
            completed: completedCount.count,
            totalSpent: totalSpent.total || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});*/
// Get customer dashboard stats
app.get("/api/customer/stats", (req, res) => {
  const { customerId } = req.query;

  try {
    // Pending bookings count
    const pendingCount = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE customer_id = ? AND status = 'pending'
        `,
      )
      .get(customerId);

    // Active jobs count
    const activeCount = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE customer_id = ? AND status IN ('approved', 'in_progress')
        `,
      )
      .get(customerId);

    // Completed jobs count
    const completedCount = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE customer_id = ? AND status = 'completed'
        `,
      )
      .get(customerId);

    // Total spent - get from paid invoices
    let totalSpent = db
      .prepare(
        `
            SELECT COALESCE(SUM(i.amount), 0) as total 
            FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE p.customer_id = ? AND i.status = 'paid'
        `,
      )
      .get(customerId);

    // If no paid invoices, check completed projects with final_price
    if (totalSpent.total === 0) {
      const completedTotal = db
        .prepare(
          `
                SELECT COALESCE(SUM(final_price), 0) as total 
                FROM projects 
                WHERE customer_id = ? AND status = 'completed' AND final_price IS NOT NULL
            `,
        )
        .get(customerId);
      totalSpent.total = completedTotal.total;
    }

    // If still 0, use service prices from completed jobs
    if (totalSpent.total === 0) {
      const serviceTotal = db
        .prepare(
          `
                SELECT COALESCE(SUM(s.price), 0) as total 
                FROM projects p
                JOIN services s ON p.service_id = s.id
                WHERE p.customer_id = ? AND p.status = 'completed'
            `,
        )
        .get(customerId);
      totalSpent.total = serviceTotal.total;
    }

    res.json({
      pending: pendingCount.count || 0,
      active: activeCount.count || 0,
      completed: completedCount.count || 0,
      totalSpent: totalSpent.total || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.json({
      pending: 0,
      active: 0,
      completed: 0,
      totalSpent: 0,
    });
  }
});

// Get reviews for a customer
app.get("/api/reviews/customer/:customerId", (req, res) => {
  const { customerId } = req.params;

  try {
    const reviews = db
      .prepare(
        `
            SELECT r.*, s.name as service_name, p.service_id
            FROM reviews r
            JOIN projects p ON r.job_id = p.id
            JOIN services s ON p.service_id = s.id
            WHERE r.customer_id = ?
            ORDER BY r.created_at DESC
        `,
      )
      .all(customerId);

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Submit a review
app.post("/api/reviews", (req, res) => {
  const { job_id, customer_id, technician_id, rating, review } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // Check if already reviewed
    const existing = db
      .prepare("SELECT * FROM reviews WHERE job_id = ? AND customer_id = ?")
      .get(job_id, customer_id);
    if (existing) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this job" });
    }

    // Insert review
    const stmt = db.prepare(`
            INSERT INTO reviews (job_id, customer_id, technician_id, rating, review)
            VALUES (?, ?, ?, ?, ?)
        `);
    stmt.run(job_id, customer_id, technician_id, rating, review);

    // Mark project as reviewed
    db.prepare("UPDATE projects SET reviewed = 1 WHERE id = ?").run(job_id);

    res.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// Mark project as reviewed
app.put("/api/projects/:id/reviewed", (req, res) => {
  const projectId = req.params.id;

  try {
    db.prepare("UPDATE projects SET reviewed = 1 WHERE id = ?").run(projectId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking as reviewed:", error);
    res.status(500).json({ error: "Failed to update" });
  }
});

// Get average rating for a technician
app.get("/api/technician/:id/rating", (req, res) => {
  const { id } = req.params;

  try {
    const rating = db
      .prepare(
        `
            SELECT AVG(rating) as average, COUNT(*) as total
            FROM reviews
            WHERE technician_id = ?
        `,
      )
      .get(id);

    res.json({
      average: rating.average || 0,
      total: rating.total || 0,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ error: "Failed to fetch rating" });
  }
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`GSMS Server running on ${PORT}`);
  console.log(`API endpoints available at ${PORT}/api/`);
});
// Update user profile
app.put("/api/users/:id", (req, res) => {
  const { name, email, phone, location } = req.body;
  const userId = req.params.id;

  try {
    const stmt = db.prepare(`
            UPDATE users 
            SET name = ?, email = ?, phone = ?, location = ?
            WHERE id = ?
        `);
    stmt.run(name, email, phone || null, location || null, userId);

    const updatedUser = db
      .prepare(
        "SELECT id, name, email, phone, location, role, created_at FROM users WHERE id = ?",
      )
      .get(userId);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Change password
app.put("/api/users/:id/password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // Verify current password
    const user = db
      .prepare("SELECT * FROM users WHERE id = ? AND password = ?")
      .get(userId, currentPassword);

    if (!user) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    const stmt = db.prepare("UPDATE users SET password = ? WHERE id = ?");
    stmt.run(newPassword, userId);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Update vehicle
app.put("/api/vehicles/:id", (req, res) => {
  const { make, model, year, license_plate, color, customer_id } = req.body;
  const vehicleId = req.params.id;

  try {
    const stmt = db.prepare(`
            UPDATE vehicles 
            SET make = ?, model = ?, year = ?, license_plate = ?, color = ?
            WHERE id = ? AND customer_id = ?
        `);
    stmt.run(make, model, year, license_plate, color, vehicleId, customer_id);

    const updatedVehicle = db
      .prepare("SELECT * FROM vehicles WHERE id = ?")
      .get(vehicleId);
    res.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
});

// Delete vehicle
app.delete("/api/vehicles/:id", (req, res) => {
  const vehicleId = req.params.id;

  try {
    // Check if vehicle has any projects
    const projectCount = db
      .prepare("SELECT COUNT(*) as count FROM projects WHERE vehicle_id = ?")
      .get(vehicleId);

    if (projectCount.count > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete vehicle with existing service history" });
    }

    const stmt = db.prepare("DELETE FROM vehicles WHERE id = ?");
    stmt.run(vehicleId);

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});
// ==================== TECHNICIAN DASHBOARD API ENDPOINTS ====================

// Get technician dashboard stats
app.get("/api/technician/stats", (req, res) => {
  const { technicianId } = req.query;

  try {
    // Available jobs count (pending jobs not assigned to anyone)
    const availableJobs = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE status = 'pending' AND technician_id IS NULL
        `,
      )
      .get();

    // Active jobs for this technician
    const activeJobs = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE technician_id = ? AND status IN ('approved', 'in_progress')
        `,
      )
      .get(technicianId);

    // Completed jobs count for this technician
    const completedJobs = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE technician_id = ? AND status = 'completed'
        `,
      )
      .get(technicianId);

    // Completed jobs today
    const completedToday = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM projects 
            WHERE technician_id = ? AND status = 'completed' AND DATE(completed_at) = DATE('now')
        `,
      )
      .get(technicianId);

    // Total earned from completed jobs (from invoices)
    const totalEarned = db
      .prepare(
        `
            SELECT COALESCE(SUM(i.amount), 0) as total FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE p.technician_id = ? AND p.status = 'completed' AND i.status = 'paid'
        `,
      )
      .get(technicianId);

    // Today's earnings
    const todayEarnings = db
      .prepare(
        `
            SELECT COALESCE(SUM(i.amount), 0) as total FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE p.technician_id = ? AND p.status = 'completed' AND DATE(i.payment_date) = DATE('now') AND i.status = 'paid'
        `,
      )
      .get(technicianId);

    // Monthly earnings
    const monthlyEarnings = db
      .prepare(
        `
            SELECT COALESCE(SUM(i.amount), 0) as total FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE p.technician_id = ? AND p.status = 'completed' AND strftime('%Y-%m', i.payment_date) = strftime('%Y-%m', 'now') AND i.status = 'paid'
        `,
      )
      .get(technicianId);

    res.json({
      availableJobs: availableJobs.count || 0,
      activeJobs: activeJobs.count || 0,
      completedJobs: completedJobs.count || 0,
      completedToday: completedToday.count || 0,
      totalEarned: totalEarned.total || 0,
      todayEarnings: todayEarnings.total || 0,
      monthlyEarnings: monthlyEarnings.total || 0,
    });
  } catch (error) {
    console.error("Error fetching technician stats:", error);
    res.json({
      availableJobs: 0,
      activeJobs: 0,
      completedJobs: 0,
      completedToday: 0,
      totalEarned: 0,
      todayEarnings: 0,
      monthlyEarnings: 0,
    });
  }
});
// Get available jobs for technicians - FIXED
app.get("/api/technician/available-jobs", (req, res) => {
  try {
    const jobs = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.price,
                s.duration_minutes,
                v.make,
                v.model,
                v.year,
                v.license_plate,
                u.name as customer_name,
                u.email as customer_email,
                u.phone as customer_phone
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users u ON p.customer_id = u.id
            WHERE p.status = 'pending' AND (p.technician_id IS NULL OR p.technician_id = 0)
            ORDER BY p.preferred_date ASC
        `,
      )
      .all();

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching available jobs:", error);
    res.status(500).json({ error: "Failed to fetch available jobs" });
  }
});

// Get technician's assigned jobs
app.get("/api/technician/my-jobs", (req, res) => {
  const { technicianId } = req.query;

  try {
    const jobs = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.price,
                s.duration_minutes,
                v.make,
                v.model,
                v.year,
                v.license_plate,
                u.name as customer_name,
                u.email as customer_email,
                u.phone as customer_phone
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users u ON p.customer_id = u.id
            WHERE p.technician_id = ? AND p.status != 'completed'
            ORDER BY p.preferred_date ASC
        `,
      )
      .all(technicianId);

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching my jobs:", error);
    res.status(500).json({ error: "Failed to fetch my jobs" });
  }
});

// Accept a job - FIXED
app.post("/api/technician/accept-job", (req, res) => {
  const { projectId, technicianId } = req.body;

  try {
    // Check if job is still available
    const job = db
      .prepare(
        `
            SELECT * FROM projects 
            WHERE id = ? AND status = 'pending' AND (technician_id IS NULL OR technician_id = 0)
        `,
      )
      .get(projectId);

    if (!job) {
      return res.status(400).json({ error: "Job is no longer available" });
    }

    // Assign job to technician
    const stmt = db.prepare(`
            UPDATE projects 
            SET technician_id = ?, status = 'approved', accepted_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
    stmt.run(technicianId, projectId);

    // Add job update record
    const updateStmt = db.prepare(`
            INSERT INTO job_updates (project_id, technician_id, status, notes)
            VALUES (?, ?, ?, ?)
        `);
    updateStmt.run(
      projectId,
      technicianId,
      "approved",
      "Job accepted by technician",
    );

    res.json({ success: true, message: "Job accepted successfully" });
  } catch (error) {
    console.error("Error accepting job:", error);
    res.status(500).json({ error: "Failed to accept job: " + error.message });
  }
});

// Update job progress
app.put("/api/jobs/:id/update", (req, res) => {
  const { status, notes, technicianId } = req.body;
  const projectId = req.params.id;

  try {
    // Update project status
    const updateData = { status };
    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    const stmt = db.prepare(`
            UPDATE projects 
            SET status = ?, 
                completed_at = COALESCE(?, completed_at),
                repair_notes = COALESCE(?, repair_notes),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
    stmt.run(
      status,
      status === "completed" ? new Date().toISOString() : null,
      notes,
      projectId,
    );

    // Add job update record
    const updateStmt = db.prepare(`
            INSERT INTO job_updates (project_id, technician_id, status, notes)
            VALUES (?, ?, ?, ?)
        `);
    updateStmt.run(projectId, technicianId, status, notes);

    /* // If job is completed, update invoice
        if (status === 'completed') {
            // Get project details for invoice
            const project = db.prepare(`
                SELECT p.*, s.price as service_price 
                FROM projects p
                JOIN services s ON p.service_id = s.id
                WHERE p.id = ?
            `).get(projectId);
            
            // Calculate total (service price + parts)
            const partsTotal = db.prepare(`
                SELECT SUM(total_price) as total FROM parts_used WHERE project_id = ?
            `).get(projectId);
            
            const totalAmount = (project.service_price || 0) + (partsTotal.total || 0);
            
            // Update or create invoice
            const invoiceStmt = db.prepare(`
                UPDATE invoices SET amount = ? WHERE project_id = ?
            `);
            invoiceStmt.run(totalAmount, projectId);
        }*/
    // When job is completed, update/create invoice
    if (status === "completed") {
      // Get project details
      const project = db
        .prepare(
          `
        SELECT p.*, s.price as service_price 
        FROM projects p
        JOIN services s ON p.service_id = s.id
        WHERE p.id = ?
    `,
        )
        .get(projectId);

      // Calculate total (use final_price if set, otherwise service price)
      const partsTotal = db
        .prepare(
          `
        SELECT COALESCE(SUM(total_price), 0) as total FROM parts_used WHERE project_id = ?
    `,
        )
        .get(projectId);

      const serviceAmount = project.service_price || 0;
      const totalAmount = serviceAmount + (partsTotal.total || 0);

      // Check if invoice exists
      const existingInvoice = db
        .prepare("SELECT * FROM invoices WHERE project_id = ?")
        .get(projectId);

      if (existingInvoice) {
        db.prepare("UPDATE invoices SET amount = ? WHERE project_id = ?").run(
          totalAmount,
          projectId,
        );
        console.log(
          `Updated invoice for project ${projectId} to KES ${totalAmount}`,
        );
      } else {
        db.prepare(
          `
            INSERT INTO invoices (project_id, amount, status, created_at)
            VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
        `,
        ).run(projectId, totalAmount);
        console.log(
          `Created invoice for project ${projectId} for KES ${totalAmount}`,
        );
      }
    }

    res.json({ success: true, message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating job progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// Get job photos
app.get("/api/jobs/:id/photos", (req, res) => {
  const jobId = req.params.id;

  try {
    const photos = db
      .prepare(
        `
            SELECT * FROM job_photos 
            WHERE project_id = ? 
            ORDER BY uploaded_at DESC
        `,
      )
      .all(jobId);

    res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Upload job photo (base64 for simplicity, use file upload in production)
app.post("/api/jobs/:id/photos", (req, res) => {
  const { photo_type, photo_url, caption, technicianId } = req.body;
  const jobId = req.params.id;

  try {
    const stmt = db.prepare(`
            INSERT INTO job_photos (project_id, technician_id, photo_type, photo_url, caption)
            VALUES (?, ?, ?, ?, ?)
        `);
    stmt.run(jobId, technicianId, photo_type, photo_url, caption);

    res.json({ success: true, message: "Photo uploaded successfully" });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// Get job parts
app.get("/api/jobs/:id/parts", (req, res) => {
  const jobId = req.params.id;

  try {
    const parts = db
      .prepare(
        `
            SELECT * FROM parts_used 
            WHERE project_id = ? 
            ORDER BY created_at DESC
        `,
      )
      .all(jobId);

    res.json(parts);
  } catch (error) {
    console.error("Error fetching parts:", error);
    res.status(500).json({ error: "Failed to fetch parts" });
  }
});

// Add part to job
app.post("/api/jobs/:id/parts", (req, res) => {
  const { part_name, quantity, unit_price, total_price, supplier } = req.body;
  const jobId = req.params.id;

  try {
    const stmt = db.prepare(`
            INSERT INTO parts_used (project_id, part_name, quantity, unit_price, total_price, supplier)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
    stmt.run(jobId, part_name, quantity, unit_price, total_price, supplier);

    res.json({ success: true, message: "Part added successfully" });
  } catch (error) {
    console.error("Error adding part:", error);
    res.status(500).json({ error: "Failed to add part" });
  }
});

// Delete part
app.delete("/api/parts/:id", (req, res) => {
  const partId = req.params.id;

  try {
    const stmt = db.prepare("DELETE FROM parts_used WHERE id = ?");
    stmt.run(partId);

    res.json({ success: true, message: "Part deleted successfully" });
  } catch (error) {
    console.error("Error deleting part:", error);
    res.status(500).json({ error: "Failed to delete part" });
  }
});

// Toggle technician availability
app.post("/api/technician/toggle-availability", (req, res) => {
  const { technicianId, isAvailable } = req.body;

  try {
    const stmt = db.prepare("UPDATE users SET is_available = ? WHERE id = ?");
    stmt.run(isAvailable ? 1 : 0, technicianId);

    res.json({ success: true, message: "Availability updated" });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ error: "Failed to update availability" });
  }
});

/*// Get technician's completed jobs history
app.get('/api/technician/completed-jobs', (req, res) => {
    const { technicianId } = req.query;
    
    try {
        const jobs = db.prepare(`
            SELECT 
                p.*,
                s.name as service_name,
                v.make,
                v.model,
                v.license_plate,
                u.name as customer_name,
                i.amount as invoice_amount,
                i.status as payment_status
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users u ON p.customer_id = u.id
            LEFT JOIN invoices i ON p.id = i.project_id
            WHERE p.technician_id = ? AND p.status = 'completed'
            ORDER BY p.completed_at DESC
        `).all(technicianId);
        
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching completed jobs:', error);
        res.status(500).json({ error: 'Failed to fetch completed jobs' });
    }
});
*/
// Get technician's completed jobs history
app.get("/api/technician/completed-jobs", (req, res) => {
  const { technicianId } = req.query;

  try {
    const jobs = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                v.make,
                v.model,
                v.license_plate,
                u.name as customer_name,
                COALESCE(i.amount, p.final_price, s.price, 0) as invoice_amount,
                i.status as payment_status,
                i.payment_date
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users u ON p.customer_id = u.id
            LEFT JOIN invoices i ON p.id = i.project_id
            WHERE p.technician_id = ? AND p.status = 'completed'
            ORDER BY p.completed_at DESC
        `,
      )
      .all(technicianId);

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching completed jobs:", error);
    res.status(500).json({ error: "Failed to fetch completed jobs" });
  }
});
// Get job update history
app.get("/api/jobs/:id/updates", (req, res) => {
  const jobId = req.params.id;

  try {
    const updates = db
      .prepare(
        `
            SELECT ju.*, u.name as technician_name
            FROM job_updates ju
            JOIN users u ON ju.technician_id = u.id
            WHERE ju.project_id = ?
            ORDER BY ju.created_at DESC
        `,
      )
      .all(jobId);

    res.json(updates);
  } catch (error) {
    console.error("Error fetching job updates:", error);
    res.status(500).json({ error: "Failed to fetch job updates" });
  }
});

// Get project with full details (enhanced version)
app.get("/api/projects/:id/full", (req, res) => {
  const projectId = req.params.id;

  try {
    const project = db
      .prepare(
        `
            SELECT 
                p.*,
                s.name as service_name,
                s.description as service_description,
                s.price as service_price,
                s.duration_minutes,
                v.make,
                v.model,
                v.year,
                v.license_plate,
                v.color,
                u.name as customer_name,
                u.email as customer_email,
                u.phone as customer_phone,
                t.name as technician_name,
                t.phone as technician_phone
            FROM projects p
            JOIN services s ON p.service_id = s.id
            JOIN vehicles v ON p.vehicle_id = v.id
            JOIN users u ON p.customer_id = u.id
            LEFT JOIN users t ON p.technician_id = t.id
            WHERE p.id = ?
        `,
      )
      .get(projectId);

    if (project) {
      // Get parts used
      project.parts = db
        .prepare("SELECT * FROM parts_used WHERE project_id = ?")
        .all(projectId);

      // Get photos
      project.photos = db
        .prepare("SELECT * FROM job_photos WHERE project_id = ?")
        .all(projectId);

      // Get updates
      project.updates = db
        .prepare(
          `
                SELECT ju.*, u.name as technician_name 
                FROM job_updates ju
                JOIN users u ON ju.technician_id = u.id
                WHERE ju.project_id = ?
                ORDER BY ju.created_at DESC
            `,
        )
        .all(projectId);

      res.json(project);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Failed to fetch project details" });
  }
});
// Create notification
app.post("/api/notifications", (req, res) => {
  const { user_id, user_role, type, title, message } = req.body;

  try {
    const stmt = db.prepare(`
            INSERT INTO notifications (user_id, user_role, type, title, message, read)
            VALUES (?, ?, ?, ?, ?, 0)
        `);
    stmt.run(user_id, user_role, type, title, message);
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// Get notifications for user
app.get("/api/notifications", (req, res) => {
  const { userId, role } = req.query;

  try {
    const notifications = db
      .prepare(
        `
            SELECT * FROM notifications 
            WHERE user_id = ? AND user_role = ?
            ORDER BY created_at DESC
            LIMIT 50
        `,
      )
      .all(userId, role);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Get unread count
app.get("/api/notifications/unread/count", (req, res) => {
  const { userId, role } = req.query;

  try {
    const result = db
      .prepare(
        `
            SELECT COUNT(*) as count FROM notifications 
            WHERE user_id = ? AND user_role = ? AND read = 0
        `,
      )
      .get(userId, role);

    res.json({ count: result.count || 0 });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.json({ count: 0 });
  }
});

// Mark notification as read
app.put("/api/notifications/:id/read", (req, res) => {
  const { id } = req.params;

  try {
    db.prepare("UPDATE notifications SET read = 1 WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking as read:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// Mark all as read
app.put("/api/notifications/read-all", (req, res) => {
  const { user_id, user_role } = req.body;

  try {
    db.prepare(
      "UPDATE notifications SET read = 1 WHERE user_id = ? AND user_role = ?",
    ).run(user_id, user_role);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});
// ==================== ADMIN STATS ENDPOINT ====================

// Get admin stats
app.get("/api/admin/stats", (req, res) => {
  try {
    // Total jobs
    const totalJobs = db
      .prepare("SELECT COUNT(*) as count FROM projects")
      .get();

    // Pending jobs (status = 'pending')
    const pending = db
      .prepare(
        "SELECT COUNT(*) as count FROM projects WHERE status = 'pending'",
      )
      .get();

    // Active jobs (approved or in_progress)
    const active = db
      .prepare(
        "SELECT COUNT(*) as count FROM projects WHERE status IN ('approved', 'in_progress')",
      )
      .get();

    // Completed jobs
    const completed = db
      .prepare(
        "SELECT COUNT(*) as count FROM projects WHERE status = 'completed'",
      )
      .get();

    // Total revenue from paid invoices
    const totalRevenue = db
      .prepare(
        "SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'paid'",
      )
      .get();

    console.log("Admin stats:", {
      totalJobs: totalJobs.count,
      pending: pending.count,
      active: active.count,
      completed: completed.count,
      totalRevenue: totalRevenue.total,
    });

    res.json({
      totalJobs: totalJobs.count || 0,
      pending: pending.count || 0,
      active: active.count || 0,
      completed: completed.count || 0,
      totalRevenue: totalRevenue.total || 0,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.json({
      totalJobs: 0,
      pending: 0,
      active: 0,
      completed: 0,
      totalRevenue: 0,
    });
  }
});
// ==================== SERVICE MANAGEMENT API ENDPOINTS ====================

// Get all services (for admin)
app.get('/api/admin/services', (req, res) => {
    try {
        const services = db.prepare('SELECT * FROM services ORDER BY name').all();
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Get single service
app.get('/api/admin/services/:id', (req, res) => {
    try {
        const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});

// Create new service
app.post('/api/admin/services', (req, res) => {
    const { name, description, price, duration_minutes, is_active } = req.body;
    
    if (!name || !price || !duration_minutes) {
        return res.status(400).json({ error: 'Name, price, and duration are required' });
    }
    
    try {
        const stmt = db.prepare(`
            INSERT INTO services (name, description, price, duration_minutes, is_active)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(name, description || '', price, duration_minutes, is_active !== undefined ? is_active : 1);
        
        const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(newService);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// Update service
app.put('/api/admin/services/:id', (req, res) => {
    const { name, description, price, duration_minutes, is_active } = req.body;
    const serviceId = req.params.id;
    
    try {
        const stmt = db.prepare(`
            UPDATE services 
            SET name = ?, description = ?, price = ?, duration_minutes = ?, is_active = ?
            WHERE id = ?
        `);
        stmt.run(name, description || '', price, duration_minutes, is_active, serviceId);
        
        const updatedService = db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
        res.json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// Delete service
app.delete('/api/admin/services/:id', (req, res) => {
    const serviceId = req.params.id;
    
    try {
        // Check if service is used in any projects
        const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects WHERE service_id = ?').get(serviceId);
        
        if (projectCount.count > 0) {
            return res.status(400).json({ error: 'Cannot delete service that has existing jobs. Consider deactivating instead.' });
        }
        
        const stmt = db.prepare('DELETE FROM services WHERE id = ?');
        stmt.run(serviceId);
        
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

// Toggle service status (activate/deactivate)
app.patch('/api/admin/services/:id/status', (req, res) => {
    const { is_active } = req.body;
    const serviceId = req.params.id;
    
    try {
        const stmt = db.prepare('UPDATE services SET is_active = ? WHERE id = ?');
        stmt.run(is_active, serviceId);
        
        const updatedService = db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
        res.json(updatedService);
    } catch (error) {
        console.error('Error updating service status:', error);
        res.status(500).json({ error: 'Failed to update service status' });
    }
});
// ==================== USER MANAGEMENT API ENDPOINTS ====================

// Get all users (for admin)
app.get('/api/admin/users', (req, res) => {
    try {
        const users = db.prepare(`
            SELECT id, name, email, username, phone, location, role, is_available, created_at 
            FROM users 
            ORDER BY created_at DESC
        `).all();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get single user
app.get('/api/admin/users/:id', (req, res) => {
    try {
        const user = db.prepare(`
            SELECT id, name, email, username, phone, location, role, is_available, created_at 
            FROM users WHERE id = ?
        `).get(req.params.id);
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
app.post('/api/admin/users', (req, res) => {
    const { name, email, username, password, phone, location, role } = req.body;
    
    if (!name || !email || !username || !password || !role) {
        return res.status(400).json({ error: 'Name, email, username, password, and role are required' });
    }
    
    try {
        // Check if email exists
        const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        // Check if username exists
        const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        const stmt = db.prepare(`
            INSERT INTO users (name, email, username, password, phone, location, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(name, email, username, password, phone || null, location || null, role);
        
        const newUser = db.prepare('SELECT id, name, email, username, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
app.put('/api/admin/users/:id', (req, res) => {
    const { name, email, username, password, phone, location, role } = req.body;
    const userId = req.params.id;
    
    try {
        // Check if email exists for another user
        const existingEmail = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        // Check if username exists for another user
        const existingUsername = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId);
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        let query, params;
        if (password) {
            query = `UPDATE users SET name = ?, email = ?, username = ?, password = ?, phone = ?, location = ?, role = ? WHERE id = ?`;
            params = [name, email, username, password, phone || null, location || null, role, userId];
        } else {
            query = `UPDATE users SET name = ?, email = ?, username = ?, phone = ?, location = ?, role = ? WHERE id = ?`;
            params = [name, email, username, phone || null, location || null, role, userId];
        }
        
        db.prepare(query).run(...params);
        
        const updatedUser = db.prepare('SELECT id, name, email, username, role, created_at FROM users WHERE id = ?').get(userId);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Reset user password
app.post('/api/admin/users/:id/reset-password', (req, res) => {
    const { password } = req.body;
    const userId = req.params.id;
    
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    try {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(password, userId);
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Delete user
app.delete('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;
    
    try {
        // Check if user has any projects
        const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects WHERE customer_id = ? OR technician_id = ?').get(userId, userId);
        
        if (projectCount.count > 0) {
            return res.status(400).json({ error: 'Cannot delete user with existing jobs. Consider deactivating instead.' });
        }
        
        // Delete user's vehicles first
        db.prepare('DELETE FROM vehicles WHERE customer_id = ?').run(userId);
        
        // Delete user
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


// Revenue Report - FIXED (ambiguous column)
app.get('/api/reports/revenue', (req, res) => {
    try {
        const revenue = db.prepare(`
            SELECT 
                date(i.created_at) as date,
                COUNT(p.id) as jobs,
                SUM(i.amount) as revenue
            FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE i.status = 'paid'
            GROUP BY date(i.created_at)
            ORDER BY date(i.created_at) DESC
            LIMIT 30
        `).all();
        
        res.json({
            labels: revenue.map(r => r.date || 'N/A'),
            values: revenue.map(r => r.revenue || 0),
            tableData: revenue
        });
    } catch (error) {
        console.error('Revenue report error:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Monthly Trends Report - FIXED (ambiguous column)
app.get('/api/reports/monthlyTrends', (req, res) => {
    try {
        const trends = db.prepare(`
            SELECT 
                strftime('%Y-%m', p.created_at) as month,
                COUNT(p.id) as jobs,
                COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.amount ELSE 0 END), 0) as revenue
            FROM projects p
            LEFT JOIN invoices i ON p.id = i.project_id
            GROUP BY strftime('%Y-%m', p.created_at)
            ORDER BY month DESC
            LIMIT 12
        `).all();
        
        res.json({
            labels: trends.map(t => t.month),
            jobs: trends.map(t => t.jobs),
            revenue: trends.map(t => t.revenue),
            tableData: trends
        });
    } catch (error) {
        console.error('Monthly trends report error:', error);
        res.json({ labels: [], jobs: [], revenue: [], tableData: [] });
    }
});

// Daily Activity Report - FIXED (ambiguous column)
app.get('/api/reports/dailyActivity', (req, res) => {
    try {
        const activity = db.prepare(`
            SELECT 
                date(p.created_at) as date,
                COUNT(p.id) as created,
                SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM projects p
            GROUP BY date(p.created_at)
            ORDER BY date(p.created_at) DESC
            LIMIT 30
        `).all();
        
        const tableData = activity.map(a => ({
            date: a.date,
            created: a.created,
            completed: a.completed || 0,
            active: (a.created - (a.completed || 0))
        }));
        
        res.json({
            labels: activity.map(a => a.date),
            created: activity.map(a => a.created),
            completed: activity.map(a => a.completed || 0),
            tableData: tableData
        });
    } catch (error) {
        console.error('Daily activity report error:', error);
        res.json({ labels: [], created: [], completed: [], tableData: [] });
    }
});

// Service Revenue Breakdown - FIXED (use p.created_at)
app.get('/api/reports/serviceRevenue', (req, res) => {
    try {
        const services = db.prepare(`
            SELECT 
                s.name as service,
                COUNT(p.id) as jobs,
                COALESCE(SUM(i.amount), 0) as revenue
            FROM services s
            JOIN projects p ON s.id = p.service_id
            LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
            GROUP BY s.id
            ORDER BY revenue DESC
        `).all();
        
        const total = services.reduce((sum, s) => sum + s.revenue, 0);
        const tableData = services.map(s => ({
            service: s.service,
            jobs: s.jobs,
            revenue: s.revenue,
            percentage: total > 0 ? ((s.revenue / total) * 100).toFixed(1) + '%' : '0%'
        }));
        
        res.json({
            labels: services.map(s => s.service),
            values: services.map(s => s.revenue),
            tableData: tableData
        });
    } catch (error) {
        console.error('Service revenue report error:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Top Customers Report - FIXED (use p.created_at for filtering if needed)
app.get('/api/reports/topCustomers', (req, res) => {
    try {
        const customers = db.prepare(`
            SELECT 
                u.name as customer,
                COUNT(p.id) as jobs,
                COALESCE(SUM(i.amount), 0) as total_spent
            FROM users u
            JOIN projects p ON u.id = p.customer_id
            LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
            GROUP BY u.id
            ORDER BY total_spent DESC
            LIMIT 10
        `).all();
        
        res.json({
            labels: customers.map(c => c.customer),
            values: customers.map(c => c.total_spent),
            tableData: customers
        });
    } catch (error) {
        console.error('Top customers report error:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// ==================== COMPLETE REPORTS API ENDPOINTS ====================

// Get average rating for reports
app.get('/api/reviews/average', (req, res) => {
    try {
        const result = db.prepare("SELECT AVG(rating) as average, COUNT(*) as total FROM reviews").get();
        res.json({ average: result.average || 0, total: result.total || 0 });
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.json({ average: 0, total: 0 });
    }
});

// Revenue Report
app.get('/api/reports/revenue', (req, res) => {
    const { from, to } = req.query;
    try {
        const revenue = db.prepare(`
            SELECT 
                DATE(i.created_at) as date,
                COUNT(p.id) as jobs,
                COALESCE(SUM(i.amount), 0) as revenue,
                COALESCE(AVG(i.amount), 0) as average
            FROM invoices i
            JOIN projects p ON i.project_id = p.id
            WHERE i.status = 'paid' 
            AND DATE(i.created_at) BETWEEN ? AND ?
            GROUP BY DATE(i.created_at)
            ORDER BY date
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: revenue.map(r => r.date),
            values: revenue.map(r => r.revenue),
            tableData: revenue
        });
    } catch (error) {
        console.error('Error generating revenue report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Technician Earnings Report - FIXED
app.get('/api/reports/techEarnings', (req, res) => {
    try {
        // First, get all technicians
        const technicians = db.prepare(`
            SELECT id, name FROM users WHERE role = 'technician'
        `).all();
        
        console.log('Technicians found:', technicians);
        
        if (technicians.length === 0) {
            return res.json({ 
                labels: [], 
                values: [], 
                tableData: [] 
            });
        }
        
        // For each technician, calculate earnings
        const earnings = [];
        for (const tech of technicians) {
            // Get completed jobs count and earnings
            const stats = db.prepare(`
                SELECT 
                    COUNT(p.id) as jobs,
                    COALESCE(SUM(i.amount), 0) as earnings
                FROM projects p
                LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
                WHERE p.technician_id = ? AND p.status = 'completed'
            `).get(tech.id);
            
            earnings.push({
                technician: tech.name,
                jobs: stats.jobs || 0,
                earnings: stats.earnings || 0,
                avg_per_job: stats.jobs > 0 ? (stats.earnings / stats.jobs) : 0
            });
        }
        
        // Filter out technicians with zero jobs (optional - remove if you want to show all)
        const filteredEarnings = earnings.filter(e => e.jobs > 0);
        
        // If no technicians have jobs, show message in table
        if (filteredEarnings.length === 0) {
            return res.json({
                labels: [],
                values: [],
                tableData: [],
                message: 'No completed jobs with earnings yet'
            });
        }
        
        res.json({
            labels: filteredEarnings.map(e => e.technician),
            values: filteredEarnings.map(e => e.earnings),
            tableData: filteredEarnings
        });
    } catch (error) {
        console.error('Tech earnings report error:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Pending Payments Report
app.get('/api/reports/pendingPayments', (req, res) => {
    try {
        const pending = db.prepare(`
            SELECT 
                i.id as invoice_id,
                u.name as customer,
                s.name as service,
                i.amount,
                ROUND(julianday('now') - julianday(i.created_at)) as days_overdue,
                i.status
            FROM invoices i
            JOIN projects p ON i.project_id = p.id
            JOIN users u ON p.customer_id = u.id
            JOIN services s ON p.service_id = s.id
            WHERE i.status = 'pending'
            ORDER BY days_overdue DESC
        `).all();
        
        res.json({ data: pending });
    } catch (error) {
        console.error('Error generating pending payments report:', error);
        res.json({ data: [] });
    }
});

// Service Revenue Breakdown
app.get('/api/reports/serviceRevenue', (req, res) => {
    const { from, to } = req.query;
    try {
        const services = db.prepare(`
            SELECT 
                s.name as service,
                COUNT(p.id) as jobs,
                COALESCE(SUM(i.amount), 0) as revenue
            FROM services s
            JOIN projects p ON s.id = p.service_id
            LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
            WHERE i.id IS NULL OR DATE(i.created_at) BETWEEN ? AND ?
            GROUP BY s.id
            ORDER BY revenue DESC
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        const total = services.reduce((sum, s) => sum + s.revenue, 0);
        const tableData = services.map(s => ({
            ...s,
            percentage: total > 0 ? ((s.revenue / total) * 100).toFixed(1) + '%' : '0%'
        }));
        
        res.json({
            labels: services.map(s => s.service),
            values: services.map(s => s.revenue),
            tableData: tableData
        });
    } catch (error) {
        console.error('Error generating service revenue report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Job Status Report
app.get('/api/reports/jobStatus', (req, res) => {
    try {
        const statuses = db.prepare(`
            SELECT 
                status,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM projects), 1) as percentage
            FROM projects
            GROUP BY status
        `).all();
        
        res.json({
            labels: statuses.map(s => s.status),
            values: statuses.map(s => s.count),
            tableData: statuses
        });
    } catch (error) {
        console.error('Error generating job status report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Technician Performance Report - FIXED
app.get('/api/reports/techPerformance', (req, res) => {
    try {
        // Get all technicians with their stats
        const techs = db.prepare(`
            SELECT 
                u.id,
                u.name as technician,
                COUNT(p.id) as jobs,
                COALESCE(ROUND(AVG(r.rating), 1), 0) as rating,
                COALESCE(SUM(i.amount), 0) as earnings
            FROM users u
            LEFT JOIN projects p ON u.id = p.technician_id AND p.status = 'completed'
            LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
            LEFT JOIN reviews r ON p.id = r.job_id
            WHERE u.role = 'technician'
            GROUP BY u.id
            ORDER BY jobs DESC
        `).all();
        
        // Filter out technicians with zero jobs if desired
        const activeTechs = techs.filter(t => t.jobs > 0);
        
        res.json({
            labels: activeTechs.map(t => t.technician),
            jobsData: activeTechs.map(t => t.jobs),
            ratingData: activeTechs.map(t => t.rating),
            tableData: activeTechs
        });
    } catch (error) {
        console.error('Tech performance report error:', error);
        res.json({ labels: [], jobsData: [], ratingData: [], tableData: [] });
    }
});

// Daily Activity Report
app.get('/api/reports/dailyActivity', (req, res) => {
    const { from, to } = req.query;
    try {
        const activity = db.prepare(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as created,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM projects
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY date
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        const tableData = activity.map(a => ({
            date: a.date,
            created: a.created,
            completed: a.completed,
            active: a.created - a.completed
        }));
        
        res.json({
            labels: activity.map(a => a.date),
            created: activity.map(a => a.created),
            completed: activity.map(a => a.completed),
            tableData: tableData
        });
    } catch (error) {
        console.error('Error generating daily activity report:', error);
        res.json({ labels: [], created: [], completed: [], tableData: [] });
    }
});

// Top Customers Report
app.get('/api/reports/topCustomers', (req, res) => {
    const { from, to } = req.query;
    try {
        const customers = db.prepare(`
            SELECT 
                u.name as customer,
                COUNT(p.id) as jobs,
                COALESCE(SUM(i.amount), 0) as total_spent,
                COALESCE(AVG(i.amount), 0) as avg_per_job
            FROM users u
            JOIN projects p ON u.id = p.customer_id
            LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
            WHERE i.id IS NULL OR DATE(i.created_at) BETWEEN ? AND ?
            GROUP BY u.id
            ORDER BY total_spent DESC
            LIMIT 10
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: customers.map(c => c.customer),
            values: customers.map(c => c.total_spent),
            tableData: customers
        });
    } catch (error) {
        console.error('Error generating top customers report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Popular Services Report
app.get('/api/reports/popularServices', (req, res) => {
    const { from, to } = req.query;
    try {
        const services = db.prepare(`
            SELECT 
                s.name as service,
                COUNT(p.id) as jobs,
                COALESCE(SUM(i.amount), 0) as revenue,
                ROUND(COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM projects WHERE DATE(created_at) BETWEEN ? AND ?), 1) as percentage
            FROM services s
            JOIN projects p ON s.id = p.service_id
            LEFT JOIN invoices i ON p.id = i.project_id AND i.status = 'paid'
            WHERE DATE(p.created_at) BETWEEN ? AND ?
            GROUP BY s.id
            ORDER BY jobs DESC
            LIMIT 10
        `).all(from || '2024-01-01', to || '2099-12-31', from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: services.map(s => s.service),
            values: services.map(s => s.jobs),
            tableData: services
        });
    } catch (error) {
        console.error('Error generating popular services report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Monthly Trends Report
app.get('/api/reports/monthlyTrends', (req, res) => {
    const { from, to } = req.query;
    try {
        const trends = db.prepare(`
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as jobs,
                COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.amount ELSE 0 END), 0) as revenue
            FROM projects p
            LEFT JOIN invoices i ON p.id = i.project_id
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: trends.map(t => t.month),
            jobs: trends.map(t => t.jobs),
            revenue: trends.map(t => t.revenue),
            tableData: trends
        });
    } catch (error) {
        console.error('Error generating monthly trends report:', error);
        res.json({ labels: [], jobs: [], revenue: [], tableData: [] });
    }
});

// Parts Usage Report
app.get('/api/reports/partsUsage', (req, res) => {
    const { from, to } = req.query;
    try {
        const parts = db.prepare(`
            SELECT 
                part_name as part,
                SUM(quantity) as quantity,
                SUM(total_price) as total_cost,
                COUNT(DISTINCT project_id) as jobs_used
            FROM parts_used
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY part_name
            ORDER BY quantity DESC
            LIMIT 15
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: parts.map(p => p.part),
            values: parts.map(p => p.quantity),
            tableData: parts
        });
    } catch (error) {
        console.error('Error generating parts usage report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Service Duration Analysis
app.get('/api/reports/serviceDuration', (req, res) => {
    const { from, to } = req.query;
    try {
        const durations = db.prepare(`
            SELECT 
                s.name as service,
                s.duration_minutes as estimated,
                AVG( julianday(completed_at) - julianday(created_at) ) * 24 * 60 as actual_avg,
                (AVG( julianday(completed_at) - julianday(created_at) ) * 24 * 60) - s.duration_minutes as variance
            FROM projects p
            JOIN services s ON p.service_id = s.id
            WHERE p.status = 'completed' 
            AND p.completed_at IS NOT NULL
            AND DATE(p.created_at) BETWEEN ? AND ?
            GROUP BY s.id
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: durations.map(d => d.service),
            estimated: durations.map(d => d.estimated),
            actual: durations.map(d => Math.round(d.actual_avg)),
            tableData: durations
        });
    } catch (error) {
        console.error('Error generating service duration report:', error);
        res.json({ labels: [], estimated: [], actual: [], tableData: [] });
    }
});

// Customer Retention Report
app.get('/api/reports/customerRetention', (req, res) => {
    const { from, to } = req.query;
    try {
        const retention = db.prepare(`
            SELECT 
                DATE(created_at) as date,
                COUNT(DISTINCT CASE WHEN (SELECT COUNT(*) FROM projects p2 WHERE p2.customer_id = p.customer_id AND p2.id < p.id) = 0 THEN p.customer_id END) as new_customers,
                COUNT(DISTINCT CASE WHEN (SELECT COUNT(*) FROM projects p2 WHERE p2.customer_id = p.customer_id AND p2.id < p.id) > 0 THEN p.customer_id END) as returning_customers
            FROM projects p
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY date
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            labels: retention.map(r => r.date),
            newCustomers: retention.map(r => r.new_customers),
            returningCustomers: retention.map(r => r.returning_customers),
            tableData: retention
        });
    } catch (error) {
        console.error('Error generating customer retention report:', error);
        res.json({ labels: [], newCustomers: [], returningCustomers: [], tableData: [] });
    }
});

// Customer Satisfaction Report
app.get('/api/reports/satisfaction', (req, res) => {
    const { from, to } = req.query;
    try {
        const ratings = db.prepare(`
            SELECT 
                rating,
                COUNT(*) as count
            FROM reviews r
            JOIN projects p ON r.job_id = p.id
            WHERE DATE(r.created_at) BETWEEN ? AND ?
            GROUP BY rating
            ORDER BY rating DESC
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        const total = ratings.reduce((sum, r) => sum + r.count, 0);
        const tableData = ratings.map(r => ({
            rating: r.rating + ' stars',
            count: r.count,
            percentage: total > 0 ? ((r.count / total) * 100).toFixed(1) + '%' : '0%'
        }));
        
        res.json({
            labels: ratings.map(r => r.rating + ' ★'),
            values: ratings.map(r => r.count),
            tableData: tableData
        });
    } catch (error) {
        console.error('Error generating satisfaction report:', error);
        res.json({ labels: [], values: [], tableData: [] });
    }
});

// Peak Hours Report
app.get('/api/reports/peakHours', (req, res) => {
    const { from, to } = req.query;
    try {
        const hours = db.prepare(`
            SELECT 
                strftime('%H', preferred_date) as hour,
                COUNT(*) as jobs
            FROM projects
            WHERE DATE(preferred_date) BETWEEN ? AND ?
            GROUP BY strftime('%H', preferred_date)
            ORDER BY hour
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        const days = db.prepare(`
            SELECT 
                CASE CAST(strftime('%w', preferred_date) AS INTEGER)
                    WHEN 0 THEN 'Sunday'
                    WHEN 1 THEN 'Monday'
                    WHEN 2 THEN 'Tuesday'
                    WHEN 3 THEN 'Wednesday'
                    WHEN 4 THEN 'Thursday'
                    WHEN 5 THEN 'Friday'
                    WHEN 6 THEN 'Saturday'
                END as day,
                COUNT(*) as jobs
            FROM projects
            WHERE DATE(preferred_date) BETWEEN ? AND ?
            GROUP BY strftime('%w', preferred_date)
            ORDER BY 
                CASE CAST(strftime('%w', preferred_date) AS INTEGER)
                    WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3
                    WHEN 4 THEN 4 WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 0 THEN 7
                END
        `).all(from || '2024-01-01', to || '2099-12-31');
        
        res.json({
            hourly: { labels: hours.map(h => h.hour + ':00'), values: hours.map(h => h.jobs) },
            daily: { labels: days.map(d => d.day), values: days.map(d => d.jobs) },
            tableData: { hours, days }
        });
    } catch (error) {
        console.error('Error generating peak hours report:', error);
        res.json({ hourly: { labels: [], values: [] }, daily: { labels: [], values: [] }, tableData: {} });
    }
});
