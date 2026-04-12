import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

// Mark all invoices as paid
const result = db.prepare("UPDATE invoices SET status = 'paid', payment_date = datetime('now') WHERE status != 'paid'").run();
console.log(`Updated ${result.changes} invoices to paid status`);

// Calculate total revenue
const total = db.prepare("SELECT SUM(amount) as total FROM invoices WHERE status = 'paid'").get();
console.log(`Total Revenue: KES ${total.total || 0}`);

db.close();