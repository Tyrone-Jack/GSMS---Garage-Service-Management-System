import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'gsms.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Updating services for Kenyan market...');

try {
    // Start a transaction to ensure data consistency
    const transaction = db.transaction(() => {
        // Check if there are any projects
        const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
        
        if (projectCount.count > 0) {
            console.log(`Found ${projectCount.count} existing projects. Deleting them to allow service update...`);
            // Delete invoices first (they reference projects)
            db.prepare('DELETE FROM invoices').run();
            console.log('✓ Deleted invoices');
            
            // Then delete projects
            db.prepare('DELETE FROM projects').run();
            console.log('✓ Deleted projects');
        }
        
        // Now clear existing services
        const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
        if (serviceCount.count > 0) {
            db.prepare('DELETE FROM services').run();
            console.log(`✓ Cleared ${serviceCount.count} existing services`);
        } else {
            console.log('No existing services found');
        }
        
        // Insert Kenyan services with KES pricing
        const insertService = db.prepare(`
            INSERT INTO services (name, description, price, duration_minutes, is_active) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const kenyanServices = [
            ['Comprehensive Vehicle Inspection', 'Complete vehicle inspection to diagnose unknown issues. Includes engine, transmission, brakes, suspension, electrical systems, and fluid checks. Price quoted after inspection.', 0, 120, 1],
            ['Oil Change Service', 'Complete oil change with quality oil and filter replacement. Includes oil level check and top-up.', 3500, 45, 1],
            ['Brake Service', 'Brake pad replacement, rotor inspection, and brake fluid check. Complete brake system service.', 5500, 90, 1],
            ['AC Service & Recharge', 'Air conditioning system inspection, gas recharge, and performance test.', 4500, 60, 1],
            ['Battery Replacement', 'Battery testing and replacement with warranty. Includes terminal cleaning and charging system check.', 8500, 30, 1],
            ['Tire Rotation & Balancing', 'Rotate all four tires, wheel balancing, and pressure check.', 2500, 45, 1],
            ['Engine Diagnostic', 'Complete computer diagnostic scan, code reading, and system analysis.', 3500, 60, 1],
            ['Transmission Service', 'Transmission fluid change, filter replacement, and system inspection.', 7500, 90, 1],
            ['Suspension Check', 'Full suspension system inspection including shocks, struts, and alignment check.', 4000, 60, 1],
            ['Cooling System Service', 'Radiator flush, coolant replacement, and cooling system pressure test.', 4500, 60, 1],
            ['Fuel System Cleaning', 'Fuel injector cleaning, throttle body service, and fuel system inspection.', 5500, 90, 1],
            ['Wheel Alignment', 'Complete wheel alignment with computer adjustment.', 3000, 60, 1],
            ['Electrical System Check', 'Full electrical system diagnosis including alternator, starter, and wiring.', 4000, 60, 1],
            ['Full Car Detailing', 'Interior and exterior professional cleaning, polishing, and waxing.', 6500, 180, 1],
            ['Timing Belt Replacement', 'Timing belt/chain replacement with tensioner inspection.', 12000, 180, 1]
        ];
        
        for (const service of kenyanServices) {
            insertService.run(...service);
        }
        
        console.log(`✓ Inserted ${kenyanServices.length} Kenyan services`);
    });
    
    // Execute the transaction
    transaction();
    
    // Verify insertion
    const services = db.prepare('SELECT * FROM services ORDER BY CASE WHEN price = 0 THEN 0 ELSE 1 END, price').all();
    console.log('\n' + '='.repeat(50));
    console.log('Available Services:');
    console.log('='.repeat(50));
    services.forEach((service, index) => {
        const priceDisplay = service.price === 0 ? 'Price Pending' : `KES ${service.price.toLocaleString()}`;
        console.log(`${index + 1}. ${service.name}`);
        console.log(`   Price: ${priceDisplay} | Duration: ${service.duration_minutes} mins`);
        console.log(`   ${service.description}\n`);
    });
    
    console.log('✅ Database update complete!');
    
} catch (error) {
    console.error('❌ Error updating database:', error.message);
    if (error.message.includes('FOREIGN KEY')) {
        console.log('\nTip: Make sure to close any applications using the database and try again.');
    }
} finally {
    db.close();
}