import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h2>About Expense Tracker</h2>

      <p>
        Expense Tracker helps you manage your income and expenses efficiently.
        Track daily spending, set limits, and receive summaries directly to
        your email.
      </p>

      <ul>
        <li>📊 Track income & expenses</li>
        <li>📥 Download Excel summaries</li>
        <li>📧 Email daily/monthly reports</li>
        <li>🔐 Secure login & password reset</li>
      </ul>

      <p>
        Built for simplicity, security, and accessibility on desktop and mobile.
      </p>

      <button onClick={() => navigate("/")}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
