import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database connection
const db = new Database(path.join(__dirname, "gsms.db"));

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Function to initialize database tables
export function initializeDatabase() {
  // Create users table (updated with username)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'technician', 'admin')),
        phone TEXT,
        location TEXT,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

  // Create vehicles table
  db.exec(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            make TEXT NOT NULL,
            model TEXT NOT NULL,
            year INTEGER NOT NULL,
            license_plate TEXT UNIQUE NOT NULL,
            color TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

  // Create services table
  db.exec(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            duration_minutes INTEGER NOT NULL,
            is_active BOOLEAN DEFAULT 1
        )
    `);

  // Create projects/jobs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        vehicle_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        technician_id INTEGER,
        preferred_date DATETIME NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
        final_price DECIMAL(10,2),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (technician_id) REFERENCES users(id)
    )
`);

  // Create invoices table
  db.exec(`
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')),
            payment_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )
    `);

  // Insert default services if they don't exist
  const serviceCount = db
    .prepare("SELECT COUNT(*) as count FROM services")
    .get();

  if (serviceCount.count === 0) {
    const insertService = db.prepare(`
            INSERT INTO services (name, description, price, duration_minutes) 
            VALUES (?, ?, ?, ?)
        `);

    const defaultServices = [
      ["Oil Change", "Standard oil and filter replacement service", 49.99, 30],
      ["Brake Service", "Brake pad and rotor inspection", 129.99, 90],
      ["AC Service", "Air conditioning system service", 129.99, 90],
      ["Battery Replacement", "Battery test and replacement", 89.99, 30],
      ["Tire Rotation", "Rotate and balance all four tires", 65.0, 45],
      ["Engine Diagnostic", "Complete engine system diagnostic", 99.99, 60],
    ];

    for (const service of defaultServices) {
      insertService.run(...service);
    }
    console.log("Default services inserted");
  }

  // Insert sample users if none exist
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();

  if (userCount.count === 0) {
    // Insert sample users with usernames
    const insertUser = db.prepare(`
    INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)
`);

    insertUser.run(
      "John Doe",
      "john@example.com",
      "john",
      "password123",
      "customer",
    );
    insertUser.run(
      "Jane Smith",
      "jane@example.com",
      "jane",
      "password123",
      "customer",
    );
    insertUser.run(
      "Mike Technician",
      "mike@example.com",
      "mike",
      "password123",
      "technician",
    );
    insertUser.run(
      "Admin User",
      "admin@example.com",
      "adminuser",
      "admin123",
      "admin",
    );

    console.log("Sample users inserted");
  }

  // Insert sample vehicles
  const vehicleCount = db
    .prepare("SELECT COUNT(*) as count FROM vehicles")
    .get();

  if (vehicleCount.count === 0) {
    const insertVehicle = db.prepare(`
            INSERT INTO vehicles (customer_id, make, model, year, license_plate, color) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);

    insertVehicle.run(1, "Toyota", "Camry", 2020, "ABC123", "Silver");
    insertVehicle.run(1, "Honda", "Civic", 2018, "XYZ789", "Black");
    insertVehicle.run(2, "Ford", "F-150", 2021, "DEF456", "White");

    console.log("Sample vehicles inserted");
  }

  console.log("Database initialized successfully");
}

// Export database instance
export default db;
