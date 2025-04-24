// ✅ Toggle Login/Register Forms
function showLogin() {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-tab").classList.add("active");
    document.getElementById("register-tab").classList.remove("active");
}

function showRegister() {
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-tab").classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
}

// ✅ Handle Admin Login
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

    const data = { username, password };

    try {
        // Updated URL to match backend running on 8080
        const response = await fetch("http://127.0.0.1:8080/api/admin/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem("adminToken", result.token);
            alert("Login Successful!");
            window.location.href = "../admin_auth/dashboard/dashboard.html"; // Redirect to Admin Dashboard
        } else {
            alert(result.message || "Login Failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to the server.");
    }
}

// ✅ Handle Admin Registration
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("reg-admin-username").value;
    const email = document.getElementById("reg-admin-email").value;
    const password = document.getElementById("reg-admin-password").value;

    const data = { username, email, password };

    try {
        // Updated URL to match backend running on 8080
        const response = await fetch("http://127.0.0.1:8080/api/admin/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Admin registered successfully! Please login.");
            showLogin(); // Switch to Login after Registration
        } else {
            alert(result.message || "Registration Failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to the server.");
    }
}

// ✅ Logout and Clear Token
function handleLogout() {
    localStorage.removeItem("adminToken");
    alert("Logged out successfully.");
    window.location.href = "index.html"; // Redirect to Home Page
}

// ✅ Check Admin Authentication Status
function checkAuth() {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        window.location.href = "index.html"; // Redirect to Login if not authenticated
    }
}
