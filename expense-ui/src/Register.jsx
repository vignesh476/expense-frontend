import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";
import "./login.css"; // ✅ reuse the same CSS

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function register() {
    try {
      if (!email || !password) {
        alert("Email & password required");
        return;
      }

      await api("/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.message);

      if (err.message.includes("Email already exists")) {
        alert("This email is already registered. Please log in instead.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">💸 Expense Tracker</div>
        <h2 className="login-title">Create Account ✨</h2>
        <p className="login-subtitle">Sign up to get started</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
          className="login-form"
        >
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Register
          </button>
        </form>

        <p style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {/* Optional: Social sign-up section */}
        <div className="social-login">
          <div className="social-divider">— Or Sign up with —</div>
          <div className="social-buttons">
            {/* Google sign-up button */}
            {/* You can reuse the same GoogleLogin component here */}
            {/* Example: */}
            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google signup success:", credentialResponse);
              }}
              onError={() => {
                console.log("Google signup failed");
              }}
            /> */}
            <div className="social-button apple">🍎 Apple ID</div>
            <div className="social-button facebook">📘 Facebook</div>
          </div>
        </div>
      </div>
    </div>
  );
}