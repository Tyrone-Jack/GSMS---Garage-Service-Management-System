import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'gsms.db');

const db = new Database(dbPath);

export function initializeDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('admin', 'tech', 'customer')),
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      duration_hours INTEGER NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      license_plate TEXT UNIQUE NOT NULL,
      color TEXT,
      mileage INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected', 'completed')),
      booking_date DATETIME NOT NULL,
      preferred_date DATETIME,
      notes TEXT,
      total_amount DECIMAL(10, 2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES users(id),
      FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY(service_id) REFERENCES services(id)
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      technician_id INTEGER,
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed', 'on_hold')),
      assigned_date DATETIME,
      start_date DATETIME,
      completion_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id),
      FOREIGN KEY(technician_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS job_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      description TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );

    CREATE TABLE IF NOT EXISTS job_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      note_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(technician_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS job_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      photo_url TEXT NOT NULL,
      description TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(technician_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'paid', 'overdue')),
      due_date DATETIME,
      paid_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(customer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(customer_id) REFERENCES users(id)
    );
  `);

  // Seed initial data
  seedDatabase();
}

function seedDatabase() {
  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return; // Data already seeded

  // Insert demo users
  const insertUser = db.prepare(`
    INSERT INTO users (username, password, email, phone, role, name)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('admin', 'admin123', 'admin@gsms.com', '0700000001', 'admin', 'Admin User');
  insertUser.run('john_tech', 'tech123', 'john@gsms.com', '0700000002', 'tech', 'John Muigai');
  insertUser.run('customer1', 'cust123', 'customer@gsms.com', '0700000003', 'customer', 'James Kipchoge');

  // Insert services
  const insertService = db.prepare(`
    INSERT INTO services (name, description, price, duration_hours, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertService.run('Oil Change', 'Standard oil and filter change', 1500, 1, 'Maintenance');
  insertService.run('Tire Replacement', 'Replace worn-out tires with new ones', 8000, 2, 'Maintenance');
  insertService.run('Engine Diagnostic', 'Complete engine scan and diagnosis', 2500, 1.5, 'Diagnostic');
  insertService.run('Brake Service', 'Brake pad replacement and rotor resurfacing', 5000, 2, 'Maintenance');
  insertService.run('Battery Replacement', 'Car battery replacement and testing', 3500, 0.5, 'Maintenance');
  insertService.run('General Inspection', 'Full vehicle inspection and report', 1000, 1, 'Inspection');

  // Get customer user
  const customer = db.prepare('SELECT id FROM users WHERE username = ?').get('customer1');

  // Insert vehicle
  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (customer_id, make, model, year, license_plate, color, mileage)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const vehicleId = insertVehicle.run(customer.id, 'Toyota', 'Corolla', 2020, 'KBC 999A', 'Silver', 45000).lastInsertRowid;

  // Insert sample projects/bookings
  const insertProject = db.prepare(`
    INSERT INTO projects (customer_id, vehicle_id, service_id, status, booking_date, preferred_date, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const p1 = insertProject.run(customer.id, vehicleId, 1, 'approved', now.toISOString(), tomorrow.toISOString(), 1500).lastInsertRowid;
  const p2 = insertProject.run(customer.id, vehicleId, 3, 'pending', now.toISOString(), null, 2500).lastInsertRowid;
  const p3 = insertProject.run(customer.id, vehicleId, 4, 'approved', now.toISOString(), tomorrow.toISOString(), 5000).lastInsertRowid;

  // Insert jobs for approved projects
  const insertJob = db.prepare(`
    INSERT INTO jobs (project_id, technician_id, status, assigned_date)
    VALUES (?, ?, ?, ?)
  `);

  const tech = db.prepare('SELECT id FROM users WHERE username = ?').get('john_tech');
  insertJob.run(p1, tech.id, 'in_progress', now.toISOString());
  insertJob.run(p3, tech.id, 'pending', now.toISOString());
}

export default db;
