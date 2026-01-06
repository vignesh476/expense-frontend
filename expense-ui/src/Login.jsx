import { useState } from "react";
import { api } from "./api";
import { login } from "./auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

// ✅ Import GoogleLogin component
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await api("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    login(res);
    window.location.href = "/";
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">💸 Expense Tracker</div>
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Please sign in to continue</p>

        <form onSubmit={submit} className="login-form">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <a href="/forgot-password" className="login-link">
          Forgot Password?
        </a>
        <p style={{ marginTop: 10 }}>
          New user?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

        {/* Social login section */}
        <div className="social-login">
          <div className="social-divider">— Or Sign in with —</div>
          <div className="social-buttons">
            {/* ✅ Google Login button */}
            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google login success:", credentialResponse);
                // send credentialResponse.credential to your backend for verification
              }}
              onError={() => {
                console.log("Google login failed");
              }}
            /> */}
      
 
              <div className="social-button google disabled">🔍 Google</div>
              <div className="social-button apple disabled">🍎 Apple ID</div>
              <div className="social-button facebook disabled">📘 Facebook</div>
            </div>
            <p className="social-disabled-note">
              Social sign‑up is disabled for now. Coming soon!
            </p>


        </div>
      </div>
    </div>
  );
}