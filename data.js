// ============================================
// GSMS - Complete Fake Backend for Vercel Demo
// ============================================
// This file replaces all API calls. Include it in every HTML page
// before your main scripts, or use it with a service worker.
//
// Usage: Add this script BEFORE your main scripts:
// <script src="data.js"></script>
// ============================================
// ============================================
// GSMS - Complete Fake Backend for Vercel Demo
// ============================================

// Make DEMO_USERS globally available FIRST
window.DEMO_USERS = {
    client: {
        id: 1001,
        username: "client",
        password: "client123",
        name: "John Client",
        email: "client@example.com",
        role: "customer",
        created_at: new Date().toISOString()
    },
    john_tjau: {
        id: 2001,
        username: "john_tjau",
        password: "john123",
        name: "John Technician",
        email: "john.technician@gsms.com",
        role: "technician",
        created_at: new Date().toISOString()
    },
    admins: {
        id: 3001,
        username: "admins",
        password: "command123",
        name: "System Administrator",
        email: "admin@gsms.local",
        role: "admin",
        created_at: new Date().toISOString()
    }
};

(function () {
  "use strict";
  
  // ============================================
  // 1. DEMO DATA - All hardcoded users, jobs, services, etc.
  // ============================================

  // Helper to generate dates
  const getDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  // Make users available globally for login page
const DEMO_USERS = {
    client: {
        id: 1001,
        username: "client",
        password: "client123",
        name: "John Client",
        email: "client@example.com",
        role: "customer",
        created_at: new Date().toISOString()
    },
    john_tjau: {
        id: 2001,
        username: "john_tjau",
        password: "john123",
        name: "John Technician",
        email: "john.technician@gsms.com",
        role: "technician",
        created_at: new Date().toISOString()
    },
    admins: {
        id: 3001,
        username: "admins",
        password: "command123",
        name: "System Administrator",
        email: "admin@gsms.local",
        role: "admin",
        created_at: new Date().toISOString()
    }
};

  // Users Database
  const USERS = {
    // Customer: client / client123
    client: {
      id: 1001,
      username: "client",
      password: "client123",
      name: "John Client",
      email: "client@example.com",
      phone: "+254 712 345 678",
      location: "Nairobi, Kenya",
      role: "customer",
      is_active: 1,
      created_at: getDate(180),
      avatar: "👤",
    },
    // Technician: john_tjau / john123
    john_tjau: {
      id: 2001,
      username: "john_tjau",
      password: "john123",
      name: "John Technician",
      email: "john.technician@gsms.com",
      phone: "+254 723 456 789",
      location: "Nairobi, Kenya",
      role: "technician",
      specialization: "Engine & Transmission Specialist",
      is_available: 1,
      created_at: getDate(365),
      avatar: "🔧",
      rating: 4.8,
      total_reviews: 24,
    },
    // Admin: admins / command123
    admins: {
      id: 3001,
      username: "admins",
      password: "command123",
      name: "System Administrator",
      email: "admin@gsms.local",
      phone: "+254 700 123 456",
      location: "Nairobi, Kenya",
      role: "admin",
      created_at: getDate(730),
      avatar: "👨‍💼",
    },
  };

  // Services Database
  const SERVICES = [
    {
      id: 1,
      name: "Oil Change Service",
      description:
        "Complete oil change with filter replacement. Includes up to 5 liters of quality engine oil.",
      price: 3500,
      duration_minutes: 45,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 2,
      name: "Brake Pad Replacement",
      description:
        "Front or rear brake pad replacement. Includes inspection of rotors and brake fluid.",
      price: 4500,
      duration_minutes: 90,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 3,
      name: "Comprehensive Vehicle Inspection",
      description:
        "Full 50-point inspection covering engine, transmission, brakes, suspension, electrical system, and more.",
      price: 0,
      duration_minutes: 120,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 4,
      name: "Tire Rotation & Balancing",
      description:
        "Rotate all four tires and perform wheel balancing for smooth ride.",
      price: 2000,
      duration_minutes: 60,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 5,
      name: "Engine Diagnostic",
      description:
        "Computer diagnostic scan to identify check engine lights and performance issues.",
      price: 2500,
      duration_minutes: 60,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 6,
      name: "Battery Replacement",
      description:
        "Battery testing and replacement with quality battery. Includes installation and disposal of old battery.",
      price: 8500,
      duration_minutes: 30,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 7,
      name: "AC Service & Recharge",
      description:
        "Air conditioning system inspection, leak test, and refrigerant recharge.",
      price: 5500,
      duration_minutes: 120,
      is_active: 1,
      created_at: getDate(365),
    },
    {
      id: 8,
      name: "Full Service Package",
      description:
        "Complete service including oil change, filter replacement, brake inspection, fluid top-up, and 30-point check.",
      price: 15000,
      duration_minutes: 240,
      is_active: 1,
      created_at: getDate(365),
    },
  ];

  // Vehicles Database (per customer)
  const VEHICLES = {
    1001: [
      {
        id: 101,
        customer_id: 1001,
        make: "Toyota",
        model: "Axio",
        year: 2018,
        license_plate: "KCA 123A",
        color: "Silver",
        created_at: getDate(150),
      },
      {
        id: 102,
        customer_id: 1001,
        make: "Honda",
        model: "Fit",
        year: 2020,
        license_plate: "KCD 456B",
        color: "White",
        created_at: getDate(90),
      },
    ],
  };

  // Jobs/Projects Database
  let JOBS = [
    {
      id: 5001,
      customer_id: 1001,
      customer_name: "John Client",
      customer_username: "client",
      service_id: 1,
      service_name: "Oil Change Service",
      technician_id: 2001,
      technician_name: "John Technician",
      technician_username: "john_tjau",
      make: "Toyota",
      model: "Axio",
      year: 2018,
      license_plate: "KCA 123A",
      color: "Silver",
      price: 3500,
      amount: 3500,
      status: "completed",
      preferred_date: getDate(30),
      created_at: getDate(35),
      completed_at: getDate(28),
      notes: "Customer requested synthetic oil. Oil filter replaced.",
      repair_notes:
        "Completed oil change with full synthetic 5W-30. Checked all fluids and tire pressure. Everything looks good.",
      payment_status: "paid",
      final_price: 3500,
      reviewed: true,
    },
    {
      id: 5002,
      customer_id: 1001,
      customer_name: "John Client",
      customer_username: "client",
      service_id: 2,
      service_name: "Brake Pad Replacement",
      technician_id: 2001,
      technician_name: "John Technician",
      technician_username: "john_tjau",
      make: "Honda",
      model: "Fit",
      year: 2020,
      license_plate: "KCD 456B",
      color: "White",
      price: 4500,
      amount: 4500,
      status: "completed",
      preferred_date: getDate(15),
      created_at: getDate(20),
      completed_at: getDate(12),
      notes: "Front brake pads worn out. Customer approved replacement.",
      repair_notes:
        "Replaced front brake pads. Rotors resurfaced. Brake fluid topped up. Test drive confirmed smooth braking.",
      payment_status: "paid",
      final_price: 4500,
      reviewed: false,
    },
    {
      id: 5003,
      customer_id: 1001,
      customer_name: "John Client",
      customer_username: "client",
      service_id: 3,
      service_name: "Comprehensive Vehicle Inspection",
      technician_id: null,
      technician_name: null,
      technician_username: null,
      make: "Toyota",
      model: "Axio",
      year: 2018,
      license_plate: "KCA 123A",
      color: "Silver",
      price: 0,
      amount: 0,
      status: "pending",
      preferred_date: getDate(5),
      created_at: getDate(7),
      completed_at: null,
      notes:
        "Please inspect the vehicle thoroughly. I've noticed some unusual noise from the engine.",
      repair_notes: null,
      payment_status: "pending",
      final_price: null,
      reviewed: false,
    },
    {
      id: 5004,
      customer_id: 1001,
      customer_name: "John Client",
      customer_username: "client",
      service_id: 4,
      service_name: "Tire Rotation & Balancing",
      technician_id: 2001,
      technician_name: "John Technician",
      technician_username: "john_tjau",
      make: "Honda",
      model: "Fit",
      year: 2020,
      license_plate: "KCD 456B",
      color: "White",
      price: 2000,
      amount: 2000,
      status: "in_progress",
      preferred_date: getDate(2),
      created_at: getDate(5),
      completed_at: null,
      notes: "Tires need rotation and balancing.",
      repair_notes:
        "Started tire rotation. Waiting for customer approval on additional work.",
      payment_status: "pending",
      final_price: 2000,
      reviewed: false,
    },
  ];

  // Parts used in jobs
  const JOB_PARTS = {
    5001: [
      {
        id: 9001,
        job_id: 5001,
        part_name: "Engine Oil 5W-30 (4L)",
        quantity: 1,
        unit_price: 2500,
        total_price: 2500,
        supplier: "Total Energies",
      },
      {
        id: 9002,
        job_id: 5001,
        part_name: "Oil Filter",
        quantity: 1,
        unit_price: 600,
        total_price: 600,
        supplier: "Toyota Kenya",
      },
    ],
    5002: [
      {
        id: 9003,
        job_id: 5002,
        part_name: "Front Brake Pads",
        quantity: 1,
        unit_price: 3200,
        total_price: 3200,
        supplier: "Bendix",
      },
      {
        id: 9004,
        job_id: 5002,
        part_name: "Brake Fluid (500ml)",
        quantity: 1,
        unit_price: 800,
        total_price: 800,
        supplier: "Total Energies",
      },
    ],
  };

  // Job updates/timeline
  const JOB_UPDATES = {
    5001: [
      {
        id: 8001,
        job_id: 5001,
        status: "approved",
        technician_name: "System",
        notes: "Job approved and assigned to John Technician",
        created_at: getDate(32),
      },
      {
        id: 8002,
        job_id: 5001,
        status: "in_progress",
        technician_name: "John Technician",
        notes: "Started oil change service",
        created_at: getDate(30),
      },
      {
        id: 8003,
        job_id: 5001,
        status: "completed",
        technician_name: "John Technician",
        notes: "Oil change completed. Vehicle ready for pickup.",
        created_at: getDate(28),
      },
    ],
    5002: [
      {
        id: 8004,
        job_id: 5002,
        status: "approved",
        technician_name: "System",
        notes: "Job approved",
        created_at: getDate(18),
      },
      {
        id: 8005,
        job_id: 5002,
        status: "in_progress",
        technician_name: "John Technician",
        notes: "Started brake pad replacement",
        created_at: getDate(15),
      },
      {
        id: 8006,
        job_id: 5002,
        status: "completed",
        technician_name: "John Technician",
        notes: "Brake pads replaced. Vehicle ready.",
        created_at: getDate(12),
      },
    ],
    5004: [
      {
        id: 8007,
        job_id: 5004,
        status: "approved",
        technician_name: "System",
        notes: "Job approved",
        created_at: getDate(4),
      },
      {
        id: 8008,
        job_id: 5004,
        status: "in_progress",
        technician_name: "John Technician",
        notes: "Started tire rotation. Noticed uneven wear.",
        created_at: getDate(2),
      },
    ],
  };

  // Notifications
  let NOTIFICATIONS = [
    {
      id: 7001,
      user_id: 1001,
      user_role: "customer",
      type: "job_update",
      title: "👨‍🔧 Technician Assigned",
      message: "John Technician has been assigned to your Oil Change service.",
      read: false,
      created_at: getDate(32),
    },
    {
      id: 7002,
      user_id: 1001,
      user_role: "customer",
      type: "job_update",
      title: "🔧 Work Started",
      message:
        "Technician John Technician has started working on your Oil Change service.",
      read: true,
      created_at: getDate(30),
    },
    {
      id: 7003,
      user_id: 1001,
      user_role: "customer",
      type: "job_update",
      title: "✅ Service Complete",
      message:
        "Your Oil Change service is complete! Please check your invoice.",
      read: true,
      created_at: getDate(28),
    },
    {
      id: 7004,
      user_id: 1001,
      user_role: "customer",
      type: "payment",
      title: "💰 Payment Received",
      message: "Payment of KES 3,500 received for Oil Change service.",
      read: true,
      created_at: getDate(27),
    },
    {
      id: 7005,
      user_id: 1001,
      user_role: "customer",
      type: "job_update",
      title: "👨‍🔧 Technician Assigned",
      message:
        "John Technician has been assigned to your Brake Pad Replacement.",
      read: true,
      created_at: getDate(18),
    },
    {
      id: 7006,
      user_id: 1001,
      user_role: "customer",
      type: "job_update",
      title: "✅ Service Complete",
      message: "Your Brake Pad Replacement is complete!",
      read: false,
      created_at: getDate(12),
    },
    {
      id: 7007,
      user_id: 1001,
      user_role: "customer",
      type: "job_update",
      title: "🔧 New Job Created",
      message:
        "Your Comprehensive Vehicle Inspection has been created and pending approval.",
      read: false,
      created_at: getDate(7),
    },
  ];

  // Reviews
  let REVIEWS = [
    {
      id: 6001,
      job_id: 5001,
      customer_id: 1001,
      technician_id: 2001,
      rating: 5,
      review:
        "Excellent service! John was very professional and completed the oil change quickly. Will definitely come back.",
      created_at: getDate(25),
    },
  ];

  // Counter for IDs
  let nextJobId = 5100;
  let nextPartId = 9100;
  let nextNotificationId = 7100;
  let nextVehicleId = 110;
  let nextReviewId = 6100;

  // ============================================
  // 2. HELPER FUNCTIONS
  // ============================================

  function sendResponse(status, data) {
    return { status, data };
  }

  function findUserById(id) {
    for (let key in USERS) {
      if (USERS[key].id === parseInt(id)) {
        return { ...USERS[key], password: undefined };
      }
    }
    return null;
  }

  function findUserByUsername(username) {
    const user = USERS[username];
    if (user) {
      return { ...user, password: undefined };
    }
    return null;
  }

  function authenticateUser(username, password) {
    const user = USERS[username];
    if (user && user.password === password) {
      return { ...user, password: undefined };
    }
    return null;
  }

  function getCustomerJobs(customerId) {
    return JOBS.filter((job) => job.customer_id === parseInt(customerId)).map(
      (job) => ({
        id: job.id,
        service_name: job.service_name,
        make: job.make,
        model: job.model,
        license_plate: job.license_plate,
        status: job.status,
        price: job.price,
        amount: job.amount,
        created_at: job.created_at,
        completed_at: job.completed_at,
        preferred_date: job.preferred_date,
        tech_name: job.technician_name,
        technician_id: job.technician_id,
        notes: job.notes,
        repair_notes: job.repair_notes,
        reviewed: job.reviewed,
        payment_status: job.payment_status,
        final_price: job.final_price,
        year: job.year,
        color: job.color,
        invoice_amount: job.amount,
      }),
    );
  }

  function getTechnicianJobs(technicianId) {
    return JOBS.filter(
      (job) =>
        job.technician_id === parseInt(technicianId) &&
        job.status !== "completed",
    ).map((job) => ({
      id: job.id,
      service_name: job.service_name,
      customer_id: job.customer_id,
      customer_name: job.customer_name,
      make: job.make,
      model: job.model,
      year: job.year,
      license_plate: job.license_plate,
      status: job.status,
      price: job.price,
      preferred_date: job.preferred_date,
      accepted_at: job.created_at,
      created_at: job.created_at,
      notes: job.notes,
    }));
  }

  function getTechnicianCompletedJobs(technicianId) {
    return JOBS.filter(
      (job) =>
        job.technician_id === parseInt(technicianId) &&
        job.status === "completed",
    ).map((job) => ({
      id: job.id,
      service_name: job.service_name,
      customer_id: job.customer_id,
      customer_name: job.customer_name,
      make: job.make,
      model: job.model,
      year: job.year,
      license_plate: job.license_plate,
      invoice_amount: job.amount,
      completed_at: job.completed_at,
      payment_status: job.payment_status,
      created_at: job.created_at,
    }));
  }

  function getAvailableJobs() {
    return JOBS.filter(
      (job) => job.status === "pending" && !job.technician_id,
    ).map((job) => ({
      id: job.id,
      service_name: job.service_name,
      customer_name: job.customer_name,
      make: job.make,
      model: job.model,
      year: job.year,
      license_plate: job.license_plate,
      price: job.price,
      preferred_date: job.preferred_date,
    }));
  }

  // ============================================
  // 3. MOCK API HANDLERS (REPLACING fetch)
  // ============================================

  // Store original fetch
  const originalFetch = window.fetch;

  // Override fetch with mock implementation
  window.fetch = function (url, options = {}) {
    const method = options.method || "GET";
    const body = options.body ? JSON.parse(options.body) : null;

    console.log(`[Mock API] ${method} ${url}`, body);

    // Parse URL
    const urlPath = url.replace(API_BASE_URL, "").split("?")[0];
    const queryParams = new URLSearchParams(url.split("?")[1] || "");

    // ============ AUTH ENDPOINTS ============

    // POST /api/login
    if (urlPath === "/api/login" && method === "POST") {
      const { email, password, role } = body;
      // Find user by email
      let user = null;
      for (let key in USERS) {
        if (USERS[key].email === email && USERS[key].password === password) {
          user = USERS[key];
          break;
        }
      }
      if (user) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: { ...user, password: undefined },
            }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({ success: false, message: "Invalid credentials" }),
      });
    }

    // POST /api/user/find
    if (urlPath === "/api/user/find" && method === "POST") {
      const { identifier } = body;
      let user = null;
      for (let key in USERS) {
        if (
          USERS[key].username === identifier ||
          USERS[key].email === identifier
        ) {
          user = USERS[key];
          break;
        }
      }
      if (user) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              exists: true,
              email: user.email,
              role: user.role,
            }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ exists: false }),
      });
    }

    // POST /api/register
    if (urlPath === "/api/register" && method === "POST") {
      const { name, email, password, role } = body;
      // Check if user exists
      let exists = false;
      for (let key in USERS) {
        if (
          USERS[key].email === email ||
          USERS[key].username === name.toLowerCase().replace(/\s/g, "")
        ) {
          exists = true;
          break;
        }
      }
      if (exists) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "User already exists" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Registration successful",
          }),
      });
    }

    // ============ ADMIN ENDPOINTS ============

    // GET /api/admin/users
    if (urlPath === "/api/admin/users" && method === "GET") {
      const allUsers = Object.values(USERS).map((u) => ({
        ...u,
        password: undefined,
      }));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(allUsers),
      });
    }

    // GET /api/admin/users/{id}
    if (urlPath.match(/^\/api\/admin\/users\/\d+$/) && method === "GET") {
      const id = parseInt(urlPath.split("/").pop());
      const user = findUserById(id);
      if (user) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(user),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "User not found" }),
      });
    }

    // POST /api/admin/users (create)
    if (urlPath === "/api/admin/users" && method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: "User created" }),
      });
    }

    // PUT /api/admin/users/{id}
    if (urlPath.match(/^\/api\/admin\/users\/\d+$/) && method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: "User updated" }),
      });
    }

    // DELETE /api/admin/users/{id}
    if (urlPath.match(/^\/api\/admin\/users\/\d+$/) && method === "DELETE") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: "User deleted" }),
      });
    }

    // POST /api/admin/users/{id}/reset-password
    if (
      urlPath.match(/\/api\/admin\/users\/\d+\/reset-password$/) &&
      method === "POST"
    ) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: "Password reset successfully",
          }),
      });
    }

    // GET /api/admin/jobs
    if (urlPath === "/api/admin/jobs" && method === "GET") {
      const adminJobs = JOBS.map((job) => ({
        id: job.id,
        status: job.status,
        customer_id: job.customer_id,
        customer_name: job.customer_name,
        customer_username: job.customer_username,
        service_id: job.service_id,
        service_name: job.service_name,
        technician_id: job.technician_id,
        technician_name: job.technician_name,
        make: job.make,
        model: job.model,
        year: job.year,
        license_plate: job.license_plate,
        amount: job.amount,
        created_at: job.created_at,
        completed_at: job.completed_at,
        price: job.price,
      }));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(adminJobs),
      });
    }

    // GET /api/admin/stats
    if (urlPath === "/api/admin/stats" && method === "GET") {
      const totalJobs = JOBS.length;
      const pending = JOBS.filter((j) => j.status === "pending").length;
      const active = JOBS.filter((j) => j.status === "in_progress").length;
      const completed = JOBS.filter((j) => j.status === "completed").length;
      const totalRevenue = JOBS.filter((j) => j.status === "completed").reduce(
        (sum, j) => sum + (j.amount || 0),
        0,
      );
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalJobs,
            pending,
            active,
            completed,
            totalRevenue,
          }),
      });
    }

    // GET /api/admin/filter-options
    if (urlPath === "/api/admin/filter-options" && method === "GET") {
      const customers = Object.values(USERS)
        .filter((u) => u.role === "customer")
        .map((u) => ({ id: u.id, name: u.name, username: u.username }));
      const services = SERVICES.map((s) => ({ id: s.id, name: s.name }));
      const technicians = Object.values(USERS)
        .filter((u) => u.role === "technician")
        .map((u) => ({ id: u.id, name: u.name }));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ customers, services, technicians }),
      });
    }

    // GET /api/admin/jobs/{id}/full
    if (urlPath.match(/^\/api\/admin\/jobs\/\d+\/full$/) && method === "GET") {
      const jobId = parseInt(urlPath.split("/")[4]);
      const job = JOBS.find((j) => j.id === jobId);
      if (job) {
        const parts = JOB_PARTS[jobId] || [];
        const updates = JOB_UPDATES[jobId] || [];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...job, parts, updates }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Job not found" }),
      });
    }

    // GET /api/admin/services
    if (urlPath === "/api/admin/services" && method === "GET") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(SERVICES),
      });
    }

    // GET /api/admin/services/{id}
    if (urlPath.match(/^\/api\/admin\/services\/\d+$/) && method === "GET") {
      const id = parseInt(urlPath.split("/").pop());
      const service = SERVICES.find((s) => s.id === id);
      if (service) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(service),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Service not found" }),
      });
    }

    // POST /api/admin/services
    if (urlPath === "/api/admin/services" && method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Service created" }),
      });
    }

    // PUT /api/admin/services/{id}
    if (urlPath.match(/^\/api\/admin\/services\/\d+$/) && method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Service updated" }),
      });
    }

    // DELETE /api/admin/services/{id}
    if (urlPath.match(/^\/api\/admin\/services\/\d+$/) && method === "DELETE") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Service deleted" }),
      });
    }

    // PATCH /api/admin/services/{id}/status
    if (
      urlPath.match(/\/api\/admin\/services\/\d+\/status$/) &&
      method === "PATCH"
    ) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Status updated" }),
      });
    }

    // ============ CUSTOMER ENDPOINTS ============

    // GET /api/services
    if (urlPath === "/api/services" && method === "GET") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(SERVICES.filter((s) => s.is_active === 1)),
      });
    }

    // GET /api/vehicles/{customerId}
    if (urlPath.match(/^\/api\/vehicles\/\d+$/) && method === "GET") {
      const customerId = parseInt(urlPath.split("/").pop());
      const vehicles = VEHICLES[customerId] || [];
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(vehicles),
      });
    }

    // POST /api/vehicles
    if (urlPath === "/api/vehicles" && method === "POST") {
      const newVehicle = {
        ...body,
        id: nextVehicleId++,
        created_at: getDate(0),
      };
      if (!VEHICLES[body.customer_id]) VEHICLES[body.customer_id] = [];
      VEHICLES[body.customer_id].push(newVehicle);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newVehicle),
      });
    }

    // PUT /api/vehicles/{id}
    if (urlPath.match(/^\/api\/vehicles\/\d+$/) && method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Vehicle updated" }),
      });
    }

    // DELETE /api/vehicles/{id}
    if (urlPath.match(/^\/api\/vehicles\/\d+$/) && method === "DELETE") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Vehicle deleted" }),
      });
    }

    // POST /api/customer/projects
    if (urlPath === "/api/customer/projects" && method === "POST") {
      const newJob = {
        id: nextJobId++,
        ...body,
        status: "pending",
        created_at: getDate(0),
        completed_at: null,
        technician_name: null,
        technician_id: null,
        amount: SERVICES.find((s) => s.id === body.serviceId)?.price || 0,
        service_name:
          SERVICES.find((s) => s.id === body.serviceId)?.name ||
          "Unknown Service",
        customer_name: USERS.client.name,
        customer_username: "client",
      };
      JOBS.push(newJob);
      // Create notification
      NOTIFICATIONS.push({
        id: nextNotificationId++,
        user_id: body.customerId,
        user_role: "customer",
        type: "booking",
        title: "📅 New Booking",
        message: `Your ${newJob.service_name} has been booked for ${new Date(body.preferredDate).toLocaleString()}`,
        read: false,
        created_at: getDate(0),
      });
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Booking created" }),
      });
    }

    // GET /api/customer/jobs
    if (urlPath === "/api/customer/jobs" && method === "GET") {
      const customerId = parseInt(queryParams.get("customerId"));
      const jobs = getCustomerJobs(customerId);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(jobs),
      });
    }

    // GET /api/customer/stats
    if (urlPath === "/api/customer/stats" && method === "GET") {
      const customerId = parseInt(queryParams.get("customerId"));
      const jobs = getCustomerJobs(customerId);
      const pending = jobs.filter((j) => j.status === "pending").length;
      const active = jobs.filter((j) => j.status === "in_progress").length;
      const completed = jobs.filter((j) => j.status === "completed").length;
      const totalSpent = jobs
        .filter((j) => j.status === "completed")
        .reduce((sum, j) => sum + (j.amount || 0), 0);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ pending, active, completed, totalSpent }),
      });
    }

    // GET /api/customer/invoices
    if (urlPath === "/api/customer/invoices" && method === "GET") {
      const customerId = parseInt(queryParams.get("customerId"));
      const jobs = getCustomerJobs(customerId);
      const invoices = jobs
        .filter((j) => j.status === "completed")
        .map((j) => ({
          id: j.id,
          service_name: j.service_name,
          amount: j.amount,
          status: j.payment_status,
          created_at: j.completed_at,
        }));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(invoices),
      });
    }

    // GET /api/projects/{id}/full
    if (urlPath.match(/^\/api\/projects\/\d+\/full$/) && method === "GET") {
      const jobId = parseInt(urlPath.split("/")[3]);
      const job = JOBS.find((j) => j.id === jobId);
      if (job) {
        const parts = JOB_PARTS[jobId] || [];
        const updates = JOB_UPDATES[jobId] || [];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...job, parts, updates }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Job not found" }),
      });
    }

    // PUT /api/projects/{id}/reviewed
    if (urlPath.match(/\/api\/projects\/\d+\/reviewed$/) && method === "PUT") {
      const jobId = parseInt(urlPath.split("/")[3]);
      const job = JOBS.find((j) => j.id === jobId);
      if (job) {
        job.reviewed = true;
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }

    // GET /api/jobs/{id}/parts
    if (urlPath.match(/^\/api\/jobs\/\d+\/parts$/) && method === "GET") {
      const jobId = parseInt(urlPath.split("/")[3]);
      const parts = JOB_PARTS[jobId] || [];
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(parts),
      });
    }

    // POST /api/jobs/{id}/parts
    if (urlPath.match(/^\/api\/jobs\/\d+\/parts$/) && method === "POST") {
      const jobId = parseInt(urlPath.split("/")[3]);
      const newPart = { ...body, id: nextPartId++, job_id: jobId };
      if (!JOB_PARTS[jobId]) JOB_PARTS[jobId] = [];
      JOB_PARTS[jobId].push(newPart);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, part: newPart }),
      });
    }

    // DELETE /api/parts/{id}
    if (urlPath.match(/^\/api\/parts\/\d+$/) && method === "DELETE") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: "Part deleted" }),
      });
    }

    // GET /api/jobs/{id}/photos
    if (urlPath.match(/^\/api\/jobs\/\d+\/photos$/) && method === "GET") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }

    // POST /api/jobs/{id}/photos
    if (urlPath.match(/^\/api\/jobs\/\d+\/photos$/) && method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Photo uploaded" }),
      });
    }

    // GET /api/jobs/{id}/updates
    if (urlPath.match(/^\/api\/jobs\/\d+\/updates$/) && method === "GET") {
      const jobId = parseInt(urlPath.split("/")[3]);
      const updates = JOB_UPDATES[jobId] || [];
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updates),
      });
    }

    // GET /api/users/{id}
    if (urlPath.match(/^\/api\/users\/\d+$/) && method === "GET") {
      const id = parseInt(urlPath.split("/").pop());
      const user = findUserById(id);
      if (user) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(user),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "User not found" }),
      });
    }

    // PUT /api/users/{id}
    if (urlPath.match(/^\/api\/users\/\d+$/) && method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body),
      });
    }

    // PUT /api/users/{id}/password
    if (urlPath.match(/\/api\/users\/\d+\/password$/) && method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Password updated" }),
      });
    }

    // GET /api/reviews/customer/{id}
    if (urlPath.match(/^\/api\/reviews\/customer\/\d+$/) && method === "GET") {
      const customerId = parseInt(urlPath.split("/")[4]);
      const customerReviews = REVIEWS.filter(
        (r) => r.customer_id === customerId,
      );
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(customerReviews),
      });
    }

    // POST /api/reviews
    if (urlPath === "/api/reviews" && method === "POST") {
      const newReview = { ...body, id: nextReviewId++, created_at: getDate(0) };
      REVIEWS.push(newReview);
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Review submitted" }),
      });
    }

    // GET /api/reviews/average
    if (urlPath === "/api/reviews/average" && method === "GET") {
      const avg =
        REVIEWS.reduce((sum, r) => sum + r.rating, 0) / (REVIEWS.length || 1);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ average: avg }),
      });
    }

    // ============ TECHNICIAN ENDPOINTS ============

    // GET /api/technician/stats
    if (urlPath === "/api/technician/stats" && method === "GET") {
      const technicianId = parseInt(queryParams.get("technicianId"));
      const myJobs = getTechnicianJobs(technicianId);
      const completed = getTechnicianCompletedJobs(technicianId);
      const availableJobs = getAvailableJobs();
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            availableJobs: availableJobs.length,
            activeJobs: myJobs.length,
            completedJobs: completed.length,
            totalEarned: completed.reduce(
              (sum, j) => sum + (j.invoice_amount || 0),
              0,
            ),
          }),
      });
    }

    // GET /api/technician/completed-jobs
    if (urlPath === "/api/technician/completed-jobs" && method === "GET") {
      const technicianId = parseInt(queryParams.get("technicianId"));
      const completed = getTechnicianCompletedJobs(technicianId);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(completed),
      });
    }

    // GET /api/technician/my-jobs
    if (urlPath === "/api/technician/my-jobs" && method === "GET") {
      const technicianId = parseInt(queryParams.get("technicianId"));
      const myJobs = getTechnicianJobs(technicianId);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(myJobs),
      });
    }

    // GET /api/technician/available-jobs
    if (urlPath === "/api/technician/available-jobs" && method === "GET") {
      const available = getAvailableJobs();
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(available),
      });
    }

    // GET /api/technician/{id}/rating
    if (urlPath.match(/^\/api\/technician\/\d+\/rating$/) && method === "GET") {
      const technicianId = parseInt(urlPath.split("/")[3]);
      const techReviews = REVIEWS.filter(
        (r) => r.technician_id === technicianId,
      );
      const avg =
        techReviews.reduce((sum, r) => sum + r.rating, 0) /
        (techReviews.length || 1);
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ average: avg, total: techReviews.length }),
      });
    }

    // POST /api/technician/accept-job
    if (urlPath === "/api/technician/accept-job" && method === "POST") {
      const { projectId, technicianId } = body;
      const job = JOBS.find((j) => j.id === projectId);
      if (job) {
        job.technician_id = technicianId;
        job.technician_name = USERS.john_tjau.name;
        job.technician_username = USERS.john_tjau.username;
        job.status = "approved";
        // Add update
        if (!JOB_UPDATES[projectId]) JOB_UPDATES[projectId] = [];
        JOB_UPDATES[projectId].push({
          id: Date.now(),
          job_id: projectId,
          status: "approved",
          technician_name: USERS.john_tjau.name,
          notes: "Job accepted by technician",
          created_at: getDate(0),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: "Job accepted" }),
      });
    }

    // POST /api/technician/toggle-availability
    if (
      urlPath === "/api/technician/toggle-availability" &&
      method === "POST"
    ) {
      const { technicianId, isAvailable } = body;
      if (USERS.john_tjau) {
        USERS.john_tjau.is_available = isAvailable ? 1 : 0;
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: "Availability updated" }),
      });
    }

    // PUT /api/jobs/{id}/update
    if (urlPath.match(/^\/api\/jobs\/\d+\/update$/) && method === "PUT") {
      const jobId = parseInt(urlPath.split("/")[3]);
      const { status, notes, technicianId } = body;
      const job = JOBS.find((j) => j.id === jobId);
      if (job) {
        job.status = status;
        if (notes) job.repair_notes = notes;
        if (status === "completed") job.completed_at = getDate(0);
        // Add update to timeline
        if (!JOB_UPDATES[jobId]) JOB_UPDATES[jobId] = [];
        JOB_UPDATES[jobId].push({
          id: Date.now(),
          job_id: jobId,
          status: status,
          technician_name: USERS.john_tjau?.name || "Technician",
          notes: notes || `Status updated to ${status}`,
          created_at: getDate(0),
        });
        // Create notification
        NOTIFICATIONS.push({
          id: nextNotificationId++,
          user_id: job.customer_id,
          user_role: "customer",
          type: "job_update",
          title:
            status === "completed" ? "✅ Service Complete" : "🔧 Job Update",
          message:
            status === "completed"
              ? `Your ${job.service_name} is complete!`
              : `Your ${job.service_name} status updated to ${status}`,
          read: false,
          created_at: getDate(0),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: "Job updated" }),
      });
    }

    // ============ NOTIFICATION ENDPOINTS ============

    // GET /api/notifications
    if (urlPath === "/api/notifications" && method === "GET") {
      const userId = parseInt(queryParams.get("userId"));
      const userNotifications = NOTIFICATIONS.filter(
        (n) => n.user_id === userId,
      );
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userNotifications),
      });
    }

    // POST /api/notifications
    if (urlPath === "/api/notifications" && method === "POST") {
      const newNotif = {
        ...body,
        id: nextNotificationId++,
        read: false,
        created_at: getDate(0),
      };
      NOTIFICATIONS.push(newNotif);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, notification: newNotif }),
      });
    }

    // PUT /api/notifications/{id}/read
    if (urlPath.match(/\/api\/notifications\/\d+\/read$/) && method === "PUT") {
      const notifId = parseInt(urlPath.split("/")[3]);
      const notif = NOTIFICATIONS.find((n) => n.id === notifId);
      if (notif) notif.read = true;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }

    // PUT /api/notifications/read-all
    if (urlPath === "/api/notifications/read-all" && method === "PUT") {
      const { user_id, user_role } = body;
      NOTIFICATIONS.forEach((n) => {
        if (n.user_id === user_id) n.read = true;
      });
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }

    // GET /api/notifications/unread/count
    if (urlPath === "/api/notifications/unread/count" && method === "GET") {
      const userId = parseInt(queryParams.get("userId"));
      const unreadCount = NOTIFICATIONS.filter(
        (n) => n.user_id === userId && !n.read,
      ).length;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: unreadCount }),
      });
    }

    // ============ REPORTS ENDPOINTS ============

    // GET /api/reports/{reportId}
    if (urlPath.match(/^\/api\/reports\/[a-zA-Z]+$/) && method === "GET") {
      const reportId = urlPath.split("/")[3];
      // Return mock data for any report
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            values: [10, 15, 12, 18],
            tableData: [
              { name: "Sample Data", value: 100 },
              { name: "Sample Data 2", value: 200 },
            ],
          }),
      });
    }

    // Fallback for unknown endpoints
    console.warn(`[Mock API] Unknown endpoint: ${method} ${urlPath}`);
    return originalFetch(url, options);
  };

  // Store API_BASE_URL for reference
  const API_BASE_URL = "http://localhost:3000";

  console.log("[GSMS Mock Backend] Loaded successfully!");
  console.log("[GSMS Mock Backend] Available demo credentials:");
  console.log("  - Customer: client / client123");
  console.log("  - Technician: john_tjau / john123");
  console.log("  - Admin: admins / command123");
})();
