// Add phone and location columns to users table
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

try {
    // Add phone column if it doesn't exist
    db.exec(`ALTER TABLE users ADD COLUMN phone TEXT`);
    console.log('Added phone column');
} catch (e) {
    console.log('Phone column already exists');
}

try {
    // Add location column if it doesn't exist
    db.exec(`ALTER TABLE users ADD COLUMN location TEXT`);
    console.log('Added location column');
} catch (e) {
    console.log('Location column already exists');
}

db.close();
console.log('Database migration complete!');