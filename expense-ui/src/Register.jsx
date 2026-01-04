import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";

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
    <div className="card">
      <h3>Register</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password min len 6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={register}>Register</button>

      <p style={{ marginTop: 10 }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
