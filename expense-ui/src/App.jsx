import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL;
console.log("API:", API);

/* ================= DEVICE ID (ONE TIME) ================= */
let deviceId = localStorage.getItem("device_id");
if (!deviceId) {
  deviceId = crypto.randomUUID();
  localStorage.setItem("device_id", deviceId);
}

/* ================= APP ================= */
export default function App() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);
  const [email, setEmail] = useState("");

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const res = await fetch(`${API}/summary`, {
        headers: {
          "X-Device-ID": deviceId,
        },
      });
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  /* ================= ADD / UPDATE ================= */
  const addOrUpdate = async () => {
    if (!amount) return;

    const url = editId
      ? `${API}/transaction/${editId}?amount=${amount}&type=${type}`
      : `${API}/transaction?amount=${amount}&type=${type}`;

    const method = editId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          "X-Device-ID": deviceId,
        },
      });
      setEditId(null);
      setAmount("");
      setType("expense");
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    try {
      await fetch(`${API}/transaction/${id}`, {
        method: "DELETE",
        headers: {
          "X-Device-ID": deviceId,
        },
      });
      loadData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= EDIT ================= */
  const edit = (entry) => {
    setEditId(entry.id);
    setAmount(entry.amount);
    setType(entry.type);
  };
  /* ===== send mail =====*/
  /* ================= SEND SUMMARY EMAIL ================= */
const sendSummary = async () => {
  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    await fetch(`${API}/send-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-ID": deviceId,
      },
      body: JSON.stringify({ email }),
    });

    alert("Expense summary sent to your email 📧");
  } catch (err) {
    console.error("Email send failed", err);
    alert("Failed to send summary");
  }
};


  useEffect(() => {
    loadData();
  }, []);

  if (!data) return null;

  return (
    <div className="container">
      <h1>Expense Snapshot</h1>

      <div className="layout">
        {/* ================= LEFT SIDE ================= */}
        <div className="left">
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
           { /* ================ send mail ======*/}
                    <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email to receive summary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="add-btn" onClick={sendSummary}>
            Send Summary 📧
          </button>


          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="right">
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
    </div>
  );
}
