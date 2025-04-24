// 🌟 Show Login Form and Hide Register
function showLogin() {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-tab").classList.add("active");
    document.getElementById("register-tab").classList.remove("active");
  }
  
  // 🌟 Show Register Form and Hide Login
  function showRegister() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("register-tab").classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
  }
  
  // ✅ Handle User Registration
  async function handleUserRegister(event) {
    event.preventDefault();
  
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
  
    try {
      // Make a POST request to register API
      const response = await fetch("http://127.0.0.1:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      // Check if registration was successful
      if (response.ok) {
        alert("User registered successfully. Please login.");
        showLogin(); // Switch to login after successful registration
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error during registration.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  }
  
  // ✅ Handle User Login
  async function handleUserLogin(event) {
    event.preventDefault();
  
    const username = document.getElementById("user-username").value;
    const password = document.getElementById("user-password").value;
  
    try {
      // Make a POST request to login API
      const response = await fetch("http://127.0.0.1:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      // Check if login was successful
      if (response.ok) {
        const data = await response.json();
  
        // ✅ Debugging to check nested structure
        console.log("Login response:", data);
  
        // ✅ Extract user ID correctly
        if (data.user && data.user.id) {
          localStorage.setItem("userId", data.user.id); // Correct way to store userId
          alert("Login successful! Redirecting to the dashboard...");
          window.location.href = "user_dashboard.html"; // Redirect to dashboard
        } else {
          alert("User ID not found. Please try again.");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }
  }
  
// ✅ Fetch User ID after successful login and store in localStorage
async function fetchUserId(username) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/api/users/${username}`);

    if (response.ok) {
      const data = await response.json();
      const userId = data.user_id;

      // ✅ Store userId in localStorage
      localStorage.setItem("userId", userId);
      console.log(`✅ User ID stored successfully: ${userId}`);
    } else {
      console.error("❌ Error fetching userId:", response.statusText);
    }
  } catch (error) {
    console.error("⚠️ Error fetching userId:", error);
  }
}

// 🎯 Logout Function to clear local storage and redirect to login
function logoutUser() {
  localStorage.removeItem("userId");
  localStorage.removeItem("token"); // Optional if token is stored
  alert("Logged out successfully!");
  window.location.href = "index.html"; // Redirect to login
}

  // ✅ Ensure that login or registration form is shown correctly on page load
  document.addEventListener("DOMContentLoaded", () => {
    showLogin(); // Show login by default when the page loads
  });
  