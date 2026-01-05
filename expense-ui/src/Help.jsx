export default function Help() {
  return (
    <div className="page">
      <h2>Help & Usage Guide</h2>

      <h4>➕ Adding Transactions</h4>
      <p>
        Enter amount, select type (Income/Expense), add description, and click
        Add.
      </p>

      <h4>✏️ Editing Transactions</h4>
      <p>Click Edit next to a transaction, modify fields, and Update.</p>

      <h4>📊 Download Summary</h4>
      <p>Click “Download Excel” to get your expense report.</p>

      <h4>📧 Email Summary</h4>
      <p>
        Click “Send Summary Email” to receive your report in your inbox.
      </p>

      <h4>🔑 Forgot Password</h4>
      <p>
        Use the “Forgot Password” option on login to reset your password.
      </p>
    </div>
  );
}
