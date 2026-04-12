import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delete existing database if it exists
const dbPath = path.join(__dirname, 'gsms.db');
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Old database deleted');
}

// Create new database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create all tables
console.log('Creating tables...');

// Users table
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'technician', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Vehicles table
db.exec(`
    CREATE TABLE vehicles (
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

// Services table
db.exec(`
    CREATE TABLE services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1
    )
`);

// Projects table
db.exec(`
    CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        vehicle_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        technician_id INTEGER,
        preferred_date DATETIME NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (technician_id) REFERENCES users(id)
    )
`);

// Invoices table
db.exec(`
    CREATE TABLE invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')),
        payment_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
    )
`);

console.log('Tables created successfully');

// Insert default services
console.log('Inserting default services...');
const insertService = db.prepare(`
    INSERT INTO services (name, description, price, duration_minutes) 
    VALUES (?, ?, ?, ?)
`);

const defaultServices = [
    ['Oil Change', 'Standard oil and filter replacement service', 49.99, 30],
    ['Brake Service', 'Brake pad and rotor inspection', 129.99, 90],
    ['AC Service', 'Air conditioning system service', 129.99, 90],
    ['Battery Replacement', 'Battery test and replacement', 89.99, 30],
    ['Tire Rotation', 'Rotate and balance all four tires', 65.00, 45],
    ['Engine Diagnostic', 'Complete engine system diagnostic', 99.99, 60]
];

for (const service of defaultServices) {
    insertService.run(...service);
}
console.log('Default services inserted');

// Insert a sample customer for testing
console.log('Inserting sample customer...');
const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
`);

try {
    insertUser.run('John Doe', 'john@example.com', 'password123', 'customer');
    insertUser.run('Jane Smith', 'jane@example.com', 'password123', 'customer');
    insertUser.run('Mike Technician', 'mike@example.com', 'password123', 'technician');
    console.log('Sample users inserted');
} catch (error) {
    console.log('Sample users already exist or error:', error.message);
}

// Insert sample vehicles
console.log('Inserting sample vehicles...');
const insertVehicle = db.prepare(`
    INSERT INTO vehicles (customer_id, make, model, year, license_plate, color) 
    VALUES (?, ?, ?, ?, ?, ?)
`);

try {
    insertVehicle.run(1, 'Toyota', 'Camry', 2020, 'ABC123', 'Silver');
    insertVehicle.run(1, 'Honda', 'Civic', 2018, 'XYZ789', 'Black');
    console.log('Sample vehicles inserted');
} catch (error) {
    console.log('Sample vehicles already exist or error:', error.message);
}

console.log('Database setup complete!');
console.log('\nTest users:');
console.log('Customer - john@example.com / password123');
console.log('Technician - mike@example.com / password123');

db.close();