import { useState } from "react";
import { api } from "./api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function submit() {
    await api("/forgot-password", {
      method: "POST",
      body: JSON.stringify(email),
    });
    alert("Check your email");
  }

  return (
    <>
      <h2>Forgot Password</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={submit}>Send Reset Link</button>
    </>
  );
}
