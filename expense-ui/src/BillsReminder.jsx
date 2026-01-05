import { useState, useEffect } from "react";

export default function BillsReminder() {
  const [bills, setBills] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  function addBill() {
    if (!title || !dueDate) return alert("Enter bill name and due date");
    setBills([...bills, { id: Date.now(), title, dueDate }]);
    setTitle("");
    setDueDate("");
  }

  function removeBill(id) {
    setBills(bills.filter(b => b.id !== id));
  }

  return (
    <div className="card">
      <h3>Bills Reminder</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <input
          placeholder="Bill name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addBill}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {bills.map(bill => (
          <li
            key={bill.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            <span>
              {bill.title} — due {bill.dueDate}
            </span>
            <button
              onClick={() => removeBill(bill.id)}
              style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 8px" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}