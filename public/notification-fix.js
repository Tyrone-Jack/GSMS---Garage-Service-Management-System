// notification-fix.js - Complete override for browser notifications
(function() {
    console.log("🔔 Notification Fix Loaded - Version 2.0");
    
    // Store original functions
    let originalSendNotification = window.sendNotification;
    let originalCheckForJobUpdates = window.checkForJobUpdates;
    
    // ========== BROWSER NOTIFICATION FUNCTION ==========
    window.showBrowserNotification = function(title, message, type = 'job_update') {
        console.log("📢 showBrowserNotification called:", title, message);
        
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("❌ Browser doesn't support notifications");
            return false;
        }
        
        // Check permission
        if (Notification.permission !== "granted") {
            console.log("⚠️ Notification permission not granted. Current status:", Notification.permission);
            
            // Request permission
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("✅ Permission granted, showing notification now");
                    showBrowserNotification(title, message, type);
                } else {
                    console.log("❌ Permission denied");
                }
            });
            return false;
        }
        
        // Create and show notification
        try {
            const notification = new Notification(title, {
                body: message,
                icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50' font-size='50'%3E🔧%3C/text%3E%3C/svg%3E",
                badge: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50' font-size='50'%3E🔧%3C/text%3E%3C/svg%3E",
                vibrate: [200, 100, 200],
                silent: false,
                requireInteraction: true,
                tag: Date.now().toString()
            });
            
            // Auto close after 8 seconds
            setTimeout(() => notification.close(), 8000);
            
            // Handle click
            notification.onclick = function() {
                console.log("🔔 Notification clicked");
                window.focus();
                notification.close();
                
                // Navigate to active jobs
                const activeJobsSection = document.getElementById("active-jobs");
                if (activeJobsSection) {
                    activeJobsSection.scrollIntoView({ behavior: "smooth" });
                }
            };
            
            console.log("✅ Notification displayed successfully");
            return true;
            
        } catch (error) {
            console.error("❌ Error showing notification:", error);
            return false;
        }
    };
    
    // ========== OVERRIDE sendNotification ==========
    window.sendNotification = function(title, message) {
        console.log("📢 sendNotification called (overridden):", title, message);
        return showBrowserNotification(title, message);
    };
    
    // ========== OVERRIDE createNotification to add popup ==========
    const originalCreateNotification = window.createNotification;
    window.createNotification = async function(userId, userRole, type, title, message) {
        console.log("📝 createNotification called:", title);
        
        // Show browser popup immediately
        showBrowserNotification(title, message, type);
        
        // Also save to database if the original function exists
        if (originalCreateNotification) {
            return originalCreateNotification(userId, userRole, type, title, message);
        } else {
            // If original doesn't exist, try API directly
            try {
                await fetch(`http://localhost:3000/api/notifications`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        user_role: userRole,
                        type: type,
                        title: title,
                        message: message,
                    }),
                });
                console.log("✅ Notification saved to database");
                
                // Update bell count
                if (window.loadUnreadNotificationCount) {
                    await window.loadUnreadNotificationCount();
                }
            } catch (error) {
                console.error("❌ Error saving notification:", error);
            }
        }
    };
    
    // ========== OVERRIDE checkForJobUpdates to ensure popups ==========
    window.checkForJobUpdates = async function() {
        console.log("🔄 checkForJobUpdates running...");
        
        try {
            const response = await fetch(`http://localhost:3000/api/customer/jobs?customerId=${window.currentUser?.id}`);
            const jobs = await response.json();
            
            for (const job of jobs) {
                const lastJob = window.lastJobStatuses?.[job.id];
                
                if (lastJob && lastJob.status !== job.status) {
                    console.log(`✅ Status change detected: ${lastJob.status} -> ${job.status}`);
                    
                    let title = "";
                    let message = "";
                    
                    switch (job.status) {
                        case "approved":
                            title = "✅ Job Approved!";
                            message = `Your ${job.service_name} has been approved. A technician will contact you soon.`;
                            break;
                        case "in_progress":
                            title = "🔧 Service Started!";
                            message = `Technician ${job.tech_name || "assigned"} has started working on your ${job.service_name}.`;
                            break;
                        case "completed":
                            title = "🎉 Service Completed!";
                            message = `Your ${job.service_name} is complete! Check your dashboard for details and invoice.`;
                            break;
                        case "cancelled":
                            title = "❌ Booking Cancelled";
                            message = `Your ${job.service_name} booking has been cancelled.`;
                            break;
                    }
                    
                    if (title) {
                        // Show popup immediately
                        console.log("🔔 Showing popup for status change");
                        showBrowserNotification(title, message);
                        
                        // Save to database
                        if (window.createNotification) {
                            await window.createNotification(
                                window.currentUser.id,
                                window.currentUser.role,
                                "job_update",
                                title,
                                message
                            );
                        }
                        
                        // Show toast
                        if (window.showToast) {
                            window.showToast(message, "info");
                        }
                    }
                }
            }
            
            // Update stored statuses
            const newStatuses = {};
            jobs.forEach(job => {
                newStatuses[job.id] = {
                    status: job.status,
                    technician_name: job.tech_name,
                    updated_at: job.updated_at
                };
            });
            window.lastJobStatuses = newStatuses;
            
        } catch (error) {
            console.error("❌ Error in checkForJobUpdates:", error);
        }
    };
    
    // ========== FIXED POLLING FUNCTION ==========
    window.startNotificationPollingFixed = function() {
        console.log("🔔 Starting notification polling...");
        
        // Clear existing interval
        if (window.notificationInterval) {
            clearInterval(window.notificationInterval);
        }
        
        // Load unread count
        if (window.loadUnreadNotificationCount) {
            window.loadUnreadNotificationCount();
        }
        
        // Start new interval
        window.notificationInterval = setInterval(async () => {
            console.log("🔄 Polling at:", new Date().toLocaleTimeString());
            await window.checkForJobUpdates();
        }, 30000);
        
        console.log("✅ Polling started, Interval ID:", window.notificationInterval);
    };
    
    // ========== TEST FUNCTION ==========
    window.testNotificationPopup = function() {
        console.log("🧪 Testing notification popup...");
        showBrowserNotification("🔔 Test Notification", "If you see this, notifications are working!");
        return "Test sent! Check for popup.";
    };
    
    // ========== AUTO-START ON PAGE LOAD ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log("📄 DOM ready, starting polling...");
            setTimeout(() => {
                if (window.startNotificationPollingFixed) {
                    window.startNotificationPollingFixed();
                }
            }, 2000);
        });
    } else {
        console.log("📄 Page already loaded, starting polling...");
        setTimeout(() => {
            if (window.startNotificationPollingFixed) {
                window.startNotificationPollingFixed();
            }
        }, 2000);
    }
    
    console.log("🔔 Notification fix loaded successfully!");
})();