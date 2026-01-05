import { useState } from "react";
import { api } from "./api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function submit() {
    if (!password || password !== confirm)
      return alert("Passwords do not match");

    await api("/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    alert("Password reset successful");
    navigate("/login");
  }

  return (
    <div className="card">
      <h3>Reset Password</h3>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button onClick={submit}>Reset Password</button>
    </div>
  );
}
