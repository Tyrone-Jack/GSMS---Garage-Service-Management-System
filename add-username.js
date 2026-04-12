import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

console.log('Adding username column to users table...');

try {
    // Add username column (without UNIQUE constraint first)
    db.exec(`ALTER TABLE users ADD COLUMN username TEXT`);
    console.log('✓ Added username column');
} catch (e) {
    console.log('Username column already exists or error:', e.message);
}

// Update existing users with usernames from email
const users = db.prepare('SELECT id, email FROM users').all();
console.log(`Found ${users.length} users to update`);

for (const user of users) {
    let username = user.email.split('@')[0];
    // Make username unique by adding number if exists
    let counter = 1;
    let originalUsername = username;
    while (true) {
        const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, user.id);
        if (!existing) break;
        username = `${originalUsername}${counter}`;
        counter++;
    }
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, user.id);
    console.log(`Updated user ${user.id}: ${user.email} -> username: ${username}`);
}

// Now add UNIQUE constraint
try {
    db.exec(`CREATE UNIQUE INDEX idx_users_username ON users(username)`);
    console.log('✓ Added UNIQUE constraint on username');
} catch (e) {
    console.log('Unique constraint already exists or error:', e.message);
}

// Verify
const updated = db.prepare('SELECT id, name, email, username, role FROM users').all();
console.log('\nCurrent users:');
updated.forEach(user => {
    console.log(`- ID:${user.id} | Name:${user.name} | Username:${user.username} | Role:${user.role}`);
});

db.close();
console.log('\n✅ Done!');