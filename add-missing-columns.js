import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

console.log('Adding missing columns to projects table...');

// Add final_price column
try {
    db.exec(`ALTER TABLE projects ADD COLUMN final_price DECIMAL(10,2)`);
    console.log('✓ Added final_price column');
} catch (e) {
    console.log('final_price column already exists or error:', e.message);
}

// Add reviewed column for reviews
try {
    db.exec(`ALTER TABLE projects ADD COLUMN reviewed BOOLEAN DEFAULT 0`);
    console.log('✓ Added reviewed column');
} catch (e) {
    console.log('reviewed column already exists or error:', e.message);
}

// Create reviews table if not exists
db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        technician_id INTEGER NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        review TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES projects(id),
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (technician_id) REFERENCES users(id)
    )
`);
console.log('✓ Created reviews table');

// Create notifications table
db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_role TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);
console.log('✓ Created notifications table');

console.log('\n✅ Database update complete!');
db.close();