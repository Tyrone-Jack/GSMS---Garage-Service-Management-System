import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

console.log('Fixing database schema...');

// Check current table structure
try {
    const tableInfo = db.prepare("PRAGMA table_info(projects)").all();
    console.log('\nCurrent projects table columns:');
    tableInfo.forEach(col => {
        console.log(`- ${col.name} (${col.type})`);
    });
    
    // Check if status column exists
    const statusColumn = tableInfo.find(col => col.name === 'status');
    if (!statusColumn) {
        console.log('\nAdding status column...');
        db.exec(`ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'pending'`);
        console.log('✓ Added status column');
    }
    
    // Update any NULL statuses to 'pending'
    db.prepare(`UPDATE projects SET status = 'pending' WHERE status IS NULL`).run();
    
    // Check if accepted_at column exists
    const acceptedAtColumn = tableInfo.find(col => col.name === 'accepted_at');
    if (!acceptedAtColumn) {
        console.log('Adding accepted_at column...');
        db.exec(`ALTER TABLE projects ADD COLUMN accepted_at DATETIME`);
        console.log('✓ Added accepted_at column');
    }
    
    // Check if completed_at column exists
    const completedAtColumn = tableInfo.find(col => col.name === 'completed_at');
    if (!completedAtColumn) {
        console.log('Adding completed_at column...');
        db.exec(`ALTER TABLE projects ADD COLUMN completed_at DATETIME`);
        console.log('✓ Added completed_at column');
    }
    
    // Check if repair_notes column exists
    const repairNotesColumn = tableInfo.find(col => col.name === 'repair_notes');
    if (!repairNotesColumn) {
        console.log('Adding repair_notes column...');
        db.exec(`ALTER TABLE projects ADD COLUMN repair_notes TEXT`);
        console.log('✓ Added repair_notes column');
    }
    
    // Verify current status values
    const statuses = db.prepare("SELECT DISTINCT status FROM projects").all();
    console.log('\nCurrent status values in database:', statuses.map(s => s.status));
    
    // Create job_updates table if not exists
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
    console.log('✓ Created/verified job_updates table');
    
    // Create job_photos table if not exists
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
    console.log('✓ Created/verified job_photos table');
    
    // Create parts_used table if not exists
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
    console.log('✓ Created/verified parts_used table');
    
    // Add is_available column to users if not exists
    const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
    const isAvailableColumn = userTableInfo.find(col => col.name === 'is_available');
    if (!isAvailableColumn) {
        console.log('Adding is_available column to users...');
        db.exec(`ALTER TABLE users ADD COLUMN is_available BOOLEAN DEFAULT 1`);
        console.log('✓ Added is_available column');
    }
    
    // Create a test project if none exists
    const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get();
    if (projectCount.count === 0) {
        console.log('\nCreating a test project...');
        const insertProject = db.prepare(`
            INSERT INTO projects (customer_id, vehicle_id, service_id, preferred_date, status, notes)
            VALUES (?, ?, ?, datetime('now', '+1 day'), 'pending', 'Test booking for technician demo')
        `);
        insertProject.run(1, 1, 1);
        console.log('✓ Created test project');
    }
    
    console.log('\n✅ Database schema fixed successfully!');
    
    // Display current projects
    const projects = db.prepare(`
        SELECT p.*, s.name as service_name, u.name as customer_name 
        FROM projects p
        JOIN services s ON p.service_id = s.id
        JOIN users u ON p.customer_id = u.id
        LIMIT 5
    `).all();
    
    console.log('\nCurrent projects:');
    projects.forEach(project => {
        console.log(`- Project #${project.id}: ${project.service_name} for ${project.customer_name} (Status: ${project.status})`);
    });
    
} catch (error) {
    console.error('Error fixing database:', error);
} finally {
    db.close();
}