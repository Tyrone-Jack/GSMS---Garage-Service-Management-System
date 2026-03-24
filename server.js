import express from 'express';
import cors from 'cors';
import db from './database.js';
import { initializeDatabase } from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root directory

// Initialize database on startup
initializeDatabase();

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// CUSTOMER ENDPOINTS
// ============================================================================

app.get('/api/customer/projects', (req, res) => {
  try {
    const customerId = req.query.customerId;
    if (!customerId) return res.status(400).json({ error: 'customerId required' });

    const projects = db.prepare(`
      SELECT p.*, s.name as service_name, s.price, v.make, v.model, v.year, v.license_plate
      FROM projects p
      JOIN services s ON p.service_id = s.id
      JOIN vehicles v ON p.vehicle_id = v.id
      WHERE p.customer_id = ?
      ORDER BY p.created_at DESC
    `).all(customerId);

    res.json(projects);
  } catch (error) {
    console.error('Error fetching customer projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/customer/projects', (req, res) => {
  try {
    const { customerId, vehicleId, serviceId, preferredDate, notes } = req.body;

    if (!customerId || !vehicleId || !serviceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const service = db.prepare('SELECT price FROM services WHERE id = ?').get(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const result = db.prepare(`
      INSERT INTO projects (customer_id, vehicle_id, service_id, status, booking_date, preferred_date, notes, total_amount)
      VALUES (?, ?, ?, 'pending', datetime('now'), ?, ?, ?)
    `).run(customerId, vehicleId, serviceId, preferredDate, notes, service.price);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/customer/jobs', (req, res) => {
  try {
    const customerId = req.query.customerId;
    if (!customerId) return res.status(400).json({ error: 'customerId required' });

    const jobs = db.prepare(`
      SELECT j.*, p.id as project_id, s.name as service_name, v.make, v.model,
             u.name as tech_name
      FROM jobs j
      JOIN projects p ON j.project_id = p.id
      JOIN services s ON p.service_id = s.id
      JOIN vehicles v ON p.vehicle_id = v.id
      LEFT JOIN users u ON j.technician_id = u.id
      WHERE p.customer_id = ?
      ORDER BY j.created_at DESC
    `).all(customerId);

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching customer jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/customer/invoices', (req, res) => {
  try {
    const customerId = req.query.customerId;
    if (!customerId) return res.status(400).json({ error: 'customerId required' });

    const invoices = db.prepare(`
      SELECT i.*, j.id as job_id, p.id as project_id, s.name as service_name
      FROM invoices i
      JOIN jobs j ON i.job_id = j.id
      JOIN projects p ON j.project_id = p.id
      JOIN services s ON p.service_id = s.id
      WHERE i.customer_id = ?
      ORDER BY i.created_at DESC
    `).all(customerId);

    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

app.get('/api/admin/projects', (req, res) => {
  try {
    const status = req.query.status;
    let query = `
      SELECT p.*, s.name as service_name, s.price, v.make, v.model,
             u.name as customer_name, u.phone as customer_phone
      FROM projects p
      JOIN services s ON p.service_id = s.id
      JOIN vehicles v ON p.vehicle_id = v.id
      JOIN users u ON p.customer_id = u.id
    `;
    const params = [];

    if (status) {
      query += ' WHERE p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.created_at DESC';

    const projects = db.prepare(query).all(...params);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/projects/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare(`
      UPDATE projects SET status = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, id);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/technicians', (req, res) => {
  try {
    const technicians = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, COUNT(j.id) as active_jobs
      FROM users u
      LEFT JOIN jobs j ON u.id = j.technician_id AND j.status IN ('pending', 'in_progress')
      WHERE u.role = 'tech'
      GROUP BY u.id
      ORDER BY u.name
    `).all();

    res.json(technicians);
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/jobs/:id/assign', (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({ error: 'technicianId required' });
    }

    db.prepare(`
      UPDATE jobs SET technician_id = ?, assigned_date = datetime('now') WHERE id = ?
    `).run(technicianId, id);

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    res.json(job);
  } catch (error) {
    console.error('Error assigning job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// TECHNICIAN ENDPOINTS
// ============================================================================

app.get('/api/tech/jobs', (req, res) => {
  try {
    const technicianId = req.query.technicianId;
    if (!technicianId) return res.status(400).json({ error: 'technicianId required' });

    const jobs = db.prepare(`
      SELECT j.*, p.id as project_id, s.name as service_name, s.description,
             v.make, v.model, v.license_plate, u.name as customer_name, u.phone as customer_phone,
             u.email as customer_email
      FROM jobs j
      JOIN projects p ON j.project_id = p.id
      JOIN services s ON p.service_id = s.id
      JOIN vehicles v ON p.vehicle_id = v.id
      JOIN users u ON p.customer_id = u.id
      WHERE j.technician_id = ?
      ORDER BY j.created_at DESC
    `).all(technicianId);

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching technician jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tech/jobs/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'completed', 'on_hold'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = { status, updated_at: new Date().toISOString() };
    if (status === 'in_progress') updates.start_date = new Date().toISOString();
    if (status === 'completed') updates.completion_date = new Date().toISOString();

    db.prepare(`
      UPDATE jobs SET status = ?, updated_at = ?, ${status === 'in_progress' ? 'start_date = ?,' : ''} ${status === 'completed' ? 'completion_date = ?' : ''}
      WHERE id = ?
    `).run(status, updates.updated_at, id);

    // Add progress record
    db.prepare(`
      INSERT INTO job_progress (job_id, status, description)
      VALUES (?, ?, ?)
    `).run(id, status, `Job status updated to ${status}`);

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tech/jobs/:id/notes', (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId, noteText } = req.body;

    if (!technicianId || !noteText) {
      return res.status(400).json({ error: 'technicianId and noteText required' });
    }

    const result = db.prepare(`
      INSERT INTO job_notes (job_id, technician_id, note_text)
      VALUES (?, ?, ?)
    `).run(id, technicianId, noteText);

    const note = db.prepare('SELECT * FROM job_notes WHERE id = ?').get(result.lastInsertRowid);
    res.json(note);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/tech/jobs/:id/notes', (req, res) => {
  try {
    const { id } = req.params;

    const notes = db.prepare(`
      SELECT jn.*, u.name as technician_name
      FROM job_notes jn
      JOIN users u ON jn.technician_id = u.id
      WHERE jn.job_id = ?
      ORDER BY jn.created_at DESC
    `).all(id);

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// SHARED ENDPOINTS
// ============================================================================

app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY name').all();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/vehicles/:customerId', (req, res) => {
  try {
    const { customerId } = req.params;

    const vehicles = db.prepare(`
      SELECT * FROM vehicles WHERE customer_id = ? ORDER BY created_at DESC
    `).all(customerId);

    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`GSMS Server running on http://localhost:${PORT}`);
});
