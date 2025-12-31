import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

console.log("API:", import.meta.env.VITE_API_URL);

export default function App() {
  // Load initial data from localStorage if backend not reachable
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("expenseData");
    return saved ? JSON.parse(saved) : null;
  });
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetch(`${API}/summary`);
      if (!res.ok) throw new Error("Backend fetch failed");
      const json = await res.json();
      setData(json);
      localStorage.setItem("expenseData", JSON.stringify(json)); // save backend data
    } catch (err) {
      console.log("Backend fetch failed, using localStorage", err);
      const saved = localStorage.getItem("expenseData");
      if (saved) setData(JSON.parse(saved));
    }
  };

  const addOrUpdate = async () => {
    if (!amount) return;

    try {
      if (editId) {
        await fetch(`${API}/transaction/${editId}?amount=${amount}&type=${type}`, { method: "PUT" });
        setEditId(null);
      } else {
        await fetch(`${API}/transaction?amount=${amount}&type=${type}`, { method: "POST" });
      }
    } catch (err) {
      console.log("Backend save failed, will try localStorage fallback", err);
      // Optional: add offline-only entry to localStorage
      const offlineTxn = {
        id: `offline-${Date.now()}`,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString(),
      };
      const newData = JSON.parse(localStorage.getItem("expenseData") || '{"today_entries":[],"today":{"income":0,"expense":0},"month":{"income":0,"expense":0},"savings":0}');
      newData.today_entries.push(offlineTxn);
      localStorage.setItem("expenseData", JSON.stringify(newData));
      setData(newData);
    }

    setAmount("");
    setType("expense");
    loadData();
  };

  const remove = async (id) => {
    try {
      await fetch(`${API}/transaction/${id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Backend delete failed, remove from localStorage fallback");
      if (data) {
        const newData = { ...data };
        newData.today_entries = newData.today_entries.filter((e) => e.id !== id);
        localStorage.setItem("expenseData", JSON.stringify(newData));
        setData(newData);
      }
    }
    loadData();
  };

  const edit = (entry) => {
    setEditId(entry.id);
    setAmount(entry.amount);
    setType(entry.type);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return null;

  return (
    <div className="container">
      <h1>Expense Snapshot</h1>

      <div className="card">
        <h3>Today</h3>
        <div className="row">
          <span className="income">+ ₹{data.today.income}</span>
          <span className="expense">- ₹{data.today.expense}</span>
        </div>
      </div>

      <div className="card">
        <h3>This Month</h3>
        <div className="row">
          <span className="income">+ ₹{data.month.income}</span>
          <span className="expense">- ₹{data.month.expense}</span>
        </div>
      </div>

      <div className={`card savings ${data.savings < 0 ? "negative" : ""}`}>
        <h3>Savings</h3>
        <div className="big">₹ {data.savings}</div>
      </div>
    <div className="container flex gap-6">
      {/* Left side: Summary + Add */}
      <div className="left flex-1 flex flex-col gap-6">
        {/* Today, Month, Savings, Add Card */}
        <div className="card">...</div>
        <div className="card">...</div>
        <div className={`card savings ...`}>...</div>
        <div className="add-card">...</div>
      </div>

      {/* Right side: Entries */}
      <div className="right w-80">
        <h3>Today’s Entries</h3>
        <div className="entries-container">
          {data.today_entries.length === 0 && <p>No entries</p>}
          {data.today_entries.map((e) => (
            <div className="entry" key={e.id}>
              <span className={e.type}>
                {e.type === "income" ? "+" : "-"} ₹{e.amount}
              </span>
              <div>
                <button onClick={() => edit(e)}>✏️</button>
                <button onClick={() => remove(e.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      <div className="add-card">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="toggle">
          <button
            className={type === "income" ? "active" : ""}
            onClick={() => setType("income")}
          >
            Income
          </button>
          <button
            className={type === "expense" ? "active" : ""}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
        </div>

        <button className="add-btn" onClick={addOrUpdate}>
          {editId ? "Update Entry" : "Add Entry"}
        </button>
      </div>
    </div>
  );
}
