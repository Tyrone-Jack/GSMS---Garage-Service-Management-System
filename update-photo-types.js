// Update photo types
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

// Update the check constraint to include 'parts'
try {
    db.exec(`DROP TABLE IF EXISTS job_photos_backup`);
    db.exec(`CREATE TABLE job_photos_backup AS SELECT * FROM job_photos`);
    console.log('Created backup of job_photos table');
} catch (e) {
    console.log('Backup creation skipped');
}

try {
    // Recreate table with updated constraint
    db.exec(`
        CREATE TABLE IF NOT EXISTS job_photos_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            technician_id INTEGER NOT NULL,
            photo_type TEXT CHECK(photo_type IN ('before', 'parts', 'after')),
            photo_url TEXT NOT NULL,
            caption TEXT,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id),
            FOREIGN KEY (technician_id) REFERENCES users(id)
        )
    `);
    
    // Copy data from old table if exists
    try {
        db.exec(`
            INSERT INTO job_photos_new (id, project_id, technician_id, photo_type, photo_url, caption, uploaded_at)
            SELECT id, project_id, technician_id, 
                   CASE WHEN photo_type = 'during' THEN 'parts' ELSE photo_type END,
                   photo_url, caption, uploaded_at
            FROM job_photos
        `);
        console.log('Copied data to new table');
        
        // Drop old table and rename new one
        db.exec(`DROP TABLE job_photos`);
        db.exec(`ALTER TABLE job_photos_new RENAME TO job_photos`);
        console.log('✓ Updated job_photos table with "parts" photo type');
    } catch (e) {
        console.log('No existing data to copy or error:', e.message);
        db.exec(`DROP TABLE IF EXISTS job_photos`);
        db.exec(`ALTER TABLE job_photos_new RENAME TO job_photos`);
    }
} catch (error) {
    console.error('Error updating table:', error);
}

db.close();
console.log('Migration complete!');