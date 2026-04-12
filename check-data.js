import Database from 'better-sqlite3';
const db = new Database('gsms.db');

console.log('=== DATABASE DATA CHECK ===\n');

// Projects
const projects = db.prepare('SELECT COUNT(*) as c FROM projects').get();
console.log('Projects count:', projects.c);

// Invoices
const invoices = db.prepare('SELECT COUNT(*) as c FROM invoices').get();
console.log('Invoices count:', invoices.c);

// Reviews
const reviews = db.prepare('SELECT COUNT(*) as c FROM reviews').get();
console.log('Reviews count:', reviews.c);

// Parts
const parts = db.prepare('SELECT COUNT(*) as c FROM parts_used').get();
console.log('Parts count:', parts.c);

// Sample project
const sampleProject = db.prepare('SELECT id, status, created_at, completed_at FROM projects LIMIT 1').get();
console.log('\nSample project:', sampleProject);

// Sample invoice
const sampleInvoice = db.prepare('SELECT * FROM invoices LIMIT 1').get();
console.log('Sample invoice:', sampleInvoice);

// Check paid invoices
const paidInvoices = db.prepare('SELECT COUNT(*) as c FROM invoices WHERE status = "paid"').get();
console.log('Paid invoices:', paidInvoices.c);

// Check completed projects
const completedProjects = db.prepare('SELECT COUNT(*) as c FROM projects WHERE status = "completed"').get();
console.log('Completed projects:', completedProjects.c);

// Check dates range
const dateRange = db.prepare('SELECT MIN(created_at) as min, MAX(created_at) as max FROM projects').get();
console.log('Date range:', dateRange);

// Check if there are any jobs with technicians
const techJobs = db.prepare('SELECT COUNT(*) as c FROM projects WHERE technician_id IS NOT NULL').get();
console.log('Jobs with technicians:', techJobs.c);

db.close();