import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

console.log("API:", import.meta.env.VITE_API_URL);


export default function App() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const res = await fetch(`${API}/summary`);
    const json = await res.json();
    setData(json);
  };

  const addOrUpdate = async () => {
    if (!amount) return;

    if (editId) {
      await fetch(
        `${API}/transaction/${editId}?amount=${amount}&type=${type}`,
        { method: "PUT" }
      );
      setEditId(null);
    } else {
      await fetch(
        `${API}/transaction?amount=${amount}&type=${type}`,
        { method: "POST" }
      );
    }

    setAmount("");
    setType("expense");
    loadData();
  };

  const remove = async (id) => {
    await fetch(`${API}/transaction/${id}`, { method: "DELETE" });
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

      <div className="card">
        <h3>Today’s Entries</h3>
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