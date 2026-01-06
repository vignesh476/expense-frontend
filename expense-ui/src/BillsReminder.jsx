import { useState, useEffect } from "react";

export default function BillsReminder() {
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueSoon, setDueSoon] = useState([]);

  // Auto-remove past bills & check upcoming
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const filtered = bills.filter(b => b.dueDate >= today);
    setBills(filtered);

    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const upcoming = filtered.filter(
      b => b.dueDate === today || b.dueDate === tomorrow
    );
    setDueSoon(upcoming);
  }, []);

  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  // Request notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Send notification if bills are due soon
  useEffect(() => {
    if (dueSoon.length > 0 && "Notification" in window && Notification.permission === "granted") {
      const names = dueSoon.map(b => b.title).join(", ");
      new Notification("Upcoming Bills Reminder", {
        body: `Bills due soon: ${names}`,
        icon: "/icons/bills.png" // optional icon
      });
    }
  }, [dueSoon]);

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

      {/* Banner for upcoming bills */}
      {dueSoon.length > 0 && (
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "12px"
          }}
        >
          ⚠️ Upcoming bills due: {dueSoon.map(b => b.title).join(", ")}
        </div>
      )}

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
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "4px 8px"
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}