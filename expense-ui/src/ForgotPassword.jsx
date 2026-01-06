import { useState } from "react";
import { api } from "./api";
import "./login.css"; // ✅ reuse same styles

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await api("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }), // ✅ send as object, not raw string
      });
      alert("If this email exists, a reset link has been sent. Please check your inbox.");
    } catch (err) {
      console.error("Forgot password error:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">💸 Expense Tracker</div>
        <h2 className="login-title">Forgot Password 🔑</h2>
        <p className="login-subtitle">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={submit} className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}