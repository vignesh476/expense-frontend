import { useState } from "react";
import { api } from "./api";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const token = params.get("token");

  async function submit() {
    await api("/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    alert("Password reset successful");
    window.location.href = "/login";
  }

  return (
    <>
      <h2>Reset Password</h2>
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Reset</button>
    </>
  );
}
