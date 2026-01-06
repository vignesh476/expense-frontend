import { useState } from "react";
import { api } from "./api";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./login.css"; // ✅ reuse the same styles

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function submit(e) {
    e.preventDefault();

    if (!password || password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api("/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      console.error("Reset error:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">💸 Expense Tracker</div>
        <h2 className="login-title">Reset Password 🔒</h2>
        <p className="login-subtitle">Enter your new password below</p>

        <form onSubmit={submit} className="login-form">
          <input
            className="login-input"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}