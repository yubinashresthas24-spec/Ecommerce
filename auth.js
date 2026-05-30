// auth.js - Complete Authentication System (Admin + Customers)

// Database initialization
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let admin = JSON.parse(localStorage.getItem("admin")) || null;

// Initialize default admin if not exists
if (!admin) {
    admin = {
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Shrestha Suppliers Owner",
        email: "owner@shrestha.com",
        role: "admin",
        createdAt: new Date().toISOString()
    };
    localStorage.setItem("admin", JSON.stringify(admin));
}

// Initialize demo customers if none
if (customers.length === 0) {
    customers.push({
        id: 1,
        firstName: "Ram",
        lastName: "Bhandari",
        email: "ram@example.com",
        phone: "9800000000",
        address: "Kathmandu, Nepal",
        city: "Kathmandu",
        password: "customer123",
        role: "customer",
        createdAt: new Date().toISOString()
    });
    localStorage.setItem("customers", JSON.stringify(customers));
}

// Get current logged in user
function getCurrentUser() {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
}

// Check if logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Check if admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

// Check if customer
function isCustomer() {
    const user = getCurrentUser();
    return user && user.role === "customer";
}

// Admin Login
function adminLogin(username, password) {
    if (admin.username === username && admin.password === password) {
        const adminCopy = { ...admin };
        delete adminCopy.password;
        localStorage.setItem("currentUser", JSON.stringify(adminCopy));
        updateAuthUI();
        return { success: true, user: adminCopy };
    }
    return { success: false, message: "Invalid admin credentials!" };
}

// Customer Login
function customerLogin(email, password) {
    const customer = customers.find(c => c.email === email && c.password === password);
    
    if (customer) {
        const customerCopy = { ...customer };
        delete customerCopy.password;
        localStorage.setItem("currentUser", JSON.stringify(customerCopy));
        updateAuthUI();
        return { success: true, user: customerCopy };
    }
    return { success: false, message: "Invalid email or password!" };
}

// Customer Registration
function customerRegister(userData) {
    // Check if email already exists
    if (customers.find(c => c.email === userData.email)) {
        return { success: false, message: "Email already registered! Please login." };
    }
    
    // Create new customer
    const newCustomer = {
        id: customers.length + 1,
        ...userData,
        role: "customer",
        createdAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    localStorage.setItem("customers", JSON.stringify(customers));
    
    // Auto login after registration
    const { password, ...customerWithoutPassword } = newCustomer;
    localStorage.setItem("currentUser", JSON.stringify(customerWithoutPassword));
    updateAuthUI();
    
    return { success: true, user: customerWithoutPassword };
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    updateAuthUI();
    window.location.href = "index.html";
}

// Update UI based on login status
function updateAuthUI() {
    const user = getCurrentUser();
    const userNameSpan = document.getElementById("userName");
    const userIcon = document.getElementById("userIcon");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const adminPanelLink = document.getElementById("adminPanelLink");
    const loginRegisterBtn = document.getElementById("loginRegisterBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    
    if (user) {
        if (userNameSpan) {
            if (user.role === "admin") {
                userNameSpan.innerHTML = '<i class="fas fa-crown"></i> Admin';
            } else {
                userNameSpan.textContent = user.firstName || user.email.split('@')[0];
            }
        }
        
        if (dropdownMenu) dropdownMenu.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "block";
        
        // Show admin panel link only for admin
        if (adminPanelLink) {
            if (user.role === "admin") {
                adminPanelLink.style.display = "block";
            } else {
                adminPanelLink.style.display = "none";
            }
        }
        
        if (loginRegisterBtn) loginRegisterBtn.style.display = "none";
    } else {
        if (userNameSpan) userNameSpan.textContent = "Account";
        if (dropdownMenu) dropdownMenu.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (adminPanelLink) adminPanelLink.style.display = "none";
        if (loginRegisterBtn) loginRegisterBtn.style.display = "block";
    }
}

// Toast notification
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.background = type === "success" ? "#28a745" : "#dc3545";
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    updateAuthUI();
    
    // Admin Login Form
    if (document.getElementById("adminLoginForm")) {
        document.getElementById("adminLoginForm").addEventListener("submit", function(e) {
            e.preventDefault();
            const username = document.getElementById("adminUsername").value;
            const password = document.getElementById("adminPassword").value;
            
            const result = adminLogin(username, password);
            
            if (result.success) {
                showToast("Welcome Admin!", "success");
                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 1000);
            } else {
                document.getElementById("adminErrorMsg").textContent = result.message;
                document.getElementById("adminErrorMsg").style.display = "block";
            }
        });
    }
    
    // Customer Login Form
    if (document.getElementById("customerLoginForm")) {
        document.getElementById("customerLoginForm").addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("customerEmail").value;
            const password = document.getElementById("customerPassword").value;
            
            const result = customerLogin(email, password);
            
            if (result.success) {
                showToast(`Welcome back ${result.user.firstName || result.user.email}!`, "success");
                setTimeout(() => {
                    const redirect = localStorage.getItem("redirectAfterLogin") || "index.html";
                    localStorage.removeItem("redirectAfterLogin");
                    window.location.href = redirect;
                }, 1000);
            } else {
                document.getElementById("customerErrorMsg").textContent = result.message;
                document.getElementById("customerErrorMsg").style.display = "block";
            }
        });
    }
    
    // Customer Registration Form
    if (document.getElementById("customerRegisterForm")) {
        document.getElementById("customerRegisterForm").addEventListener("submit", function(e) {
            e.preventDefault();
            
            const password = document.getElementById("regPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            
            if (password !== confirmPassword) {
                document.getElementById("registerErrorMsg").textContent = "Passwords do not match!";
                document.getElementById("registerErrorMsg").style.display = "block";
                return;
            }
            
            if (password.length < 6) {
                document.getElementById("registerErrorMsg").textContent = "Password must be at least 6 characters!";
                document.getElementById("registerErrorMsg").style.display = "block";
                return;
            }
            
            const userData = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("regEmail").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                password: password
            };
            
            const result = customerRegister(userData);
            
            if (result.success) {
                showToast("Registration successful! Welcome!", "success");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                document.getElementById("registerErrorMsg").textContent = result.message;
                document.getElementById("registerErrorMsg").style.display = "block";
            }
        });
    }
    
    // Logout button
    if (document.getElementById("logoutBtn")) {
        document.getElementById("logoutBtn").addEventListener("click", function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Store redirect for after login
    if (!isLoggedIn() && !window.location.href.includes("login") && !window.location.href.includes("register")) {
        if (!window.location.href.includes("admin")) {
            localStorage.setItem("redirectAfterLogin", window.location.pathname || "index.html");
        }
    }
});