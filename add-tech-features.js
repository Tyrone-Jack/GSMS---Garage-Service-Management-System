import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

console.log('Adding technician features...');

// Add technician availability status
try {
    db.exec(`ALTER TABLE users ADD COLUMN is_available BOOLEAN DEFAULT 1`);
    console.log('✓ Added is_available column');
} catch (e) {
    console.log('is_available column already exists');
}

// Create job_updates table for progress tracking
db.exec(`
    CREATE TABLE IF NOT EXISTS job_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        technician_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (technician_id) REFERENCES users(id)
    )
`);
console.log('✓ Created job_updates table');

// Create photos table for before/after images
db.exec(`
    CREATE TABLE IF NOT EXISTS job_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        technician_id INTEGER NOT NULL,
        photo_type TEXT CHECK(photo_type IN ('before', 'after', 'during')),
        photo_url TEXT NOT NULL,
        caption TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (technician_id) REFERENCES users(id)
    )
`);
console.log('✓ Created job_photos table');

// Create parts_used table
db.exec(`
    CREATE TABLE IF NOT EXISTS parts_used (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        part_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        supplier TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
    )
`);
console.log('✓ Created parts_used table');

// Add technician_id and acceptance fields to projects
try {
    db.exec(`ALTER TABLE projects ADD COLUMN accepted_at DATETIME`);
    console.log('✓ Added accepted_at column');
} catch (e) {
    console.log('accepted_at column already exists');
}

try {
    db.exec(`ALTER TABLE projects ADD COLUMN completed_at DATETIME`);
    console.log('✓ Added completed_at column');
} catch (e) {
    console.log('completed_at column already exists');
}

try {
    db.exec(`ALTER TABLE projects ADD COLUMN repair_notes TEXT`);
    console.log('✓ Added repair_notes column');
} catch (e) {
    console.log('repair_notes column already exists');
}

console.log('\n✅ Database migration complete!');
db.close();
// Add completed_at column if not exists
try {
    db.exec(`ALTER TABLE projects ADD COLUMN completed_at DATETIME`);
    console.log('✓ Added completed_at column');
} catch (e) {
    console.log('completed_at column already exists');
}