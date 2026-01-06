import { useEffect, useState } from "react";
import { api } from "./api";
import { logout } from "./auth";
import { toggleTheme, getTheme } from "./theme";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import Chart from "./Chart";
import TripManager from "./TripManager";
import "./dashboard.css";
   import BillsReminder from "./BillsReminder";
export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [budget, setBudget] = useState({ daily: "", monthly: "" });
  const [summaryType, setSummaryType] = useState("daily");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showTrips, setShowTrips] = useState(false);
  const [dueSoon, setDueSoon] = useState([]);

useEffect(() => {
  const raw = localStorage.getItem("bills");
  if (raw) {
    const bills = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const upcoming = bills.filter(
      (b) => b.dueDate === today || b.dueDate === tomorrow
    );
    setDueSoon(upcoming);
  }
}, []);
function FinancialHealthIndicator({ income, expense }) {
  const score = income > 0 ? ((income - expense) / income) * 100 : 0;

  let status = "";
  let color = "";

  if (score > 50) {
    status = "Healthy";
    color = "#16a34a"; // green
  } else if (score > 0) {
    status = "Caution";
    color = "#facc15"; // yellow
  } else {
    status = "Overspending";
    color = "#ef4444"; // red
  }

  return (
    <div className="card health-indicator">
      <h4>Financial Health</h4>
      <p style={{ color, fontSize: "20px", fontWeight: "bold" }}>{status}</p>
      <span style={{ fontSize: "14px", color: "var(--muted-text)" }}>
        Score: {Math.round(score)}%
      </span>
    </div>
  );
}
  // ================= LOAD TRANSACTIONS =================
  async function load() {
    try {
      const data = await api("/transactions");
      setTransactions(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    // load saved budget from localStorage
    try {
      const raw = localStorage.getItem("budget_limits");
      if (raw) setBudget(JSON.parse(raw));
    } catch (e) {}

    // PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // Add is handled by TransactionForm component

  // ================= DOWNLOAD =================
  async function download() {
    const isMonthly = summaryType === "monthly";
    const res = await fetch(
      import.meta.env.VITE_API_URL + `/download-excel?monthly=${isMonthly}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = isMonthly ? "monthly-summary.xlsx" : "daily-summary.xlsx";
    a.click();
  }

  // ================= EMAIL =================
  async function sendSummary() {
    const isMonthly = summaryType === "monthly";
    await api(`/send-summary?monthly=${isMonthly}`, { method: "POST" });
    alert(`${isMonthly ? "Monthly" : "Daily"} summary email sent`);
  }

  // ================= TOTALS =================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  // today's and this month's expense (for budget checks)
  const now = new Date();
  const todayStr = now.toDateString();
  const todayExpense = transactions
    .filter((t) => t.type === "expense")
    .filter((t) => new Date(t.created_at || t.created).toDateString() === todayStr)
    .reduce((a, b) => a + b.amount, 0);

  const monthExpense = transactions
    .filter((t) => t.type === "expense")
    .filter((t) => {
      const d = new Date(t.created_at || t.created);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((a, b) => a + b.amount, 0);
    
  // ================= UI =================
  function saveBudget(b) {
    setBudget(b);
    try {
      localStorage.setItem("budget_limits", JSON.stringify(b));
    } catch (e) {}
  }

  const dailyLimit = Number(budget.daily) || 0;
  const monthlyLimit = Number(budget.monthly) || 0;
  const isDark = getTheme() === "dark";

  function installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  }

  return (
    <div style={styles.page}>
      {/* Budget warnings */}
         <div className="login-logo"> 💸 Expense Tracker</div>
      {(monthlyLimit > 0 && monthExpense > monthlyLimit) || (dailyLimit > 0 && todayExpense > dailyLimit) ? (
        <div className="budget-banner card" style={{ marginBottom: 12 }}>
          {monthlyLimit > 0 && monthExpense > monthlyLimit && (
            <div>Warning: Monthly budget exceeded — spent ₹{monthExpense} / ₹{monthlyLimit}</div>
          )}
          {dailyLimit > 0 && todayExpense > dailyLimit && (
            <div>Warning: Today's budget exceeded — spent ₹{todayExpense} / ₹{dailyLimit}</div>
          )}
        </div>
      ) : null}
      <div style={styles.header}>
        <h2>Expense Dashboard</h2>
        <div style={{ display: "flex", gap: 10 }}>
          {deferredPrompt && (
            <button onClick={installApp}>📲 Install App</button>
          )}
          <button onClick={toggleTheme}>
            {getTheme() === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={styles.summary} className="dashboard-summary">
        <Chart income={income} expense={expense} />
        <div style={styles.card}>
          <h4 style={{ color: isDark ? "#f8fafc" : "#111827", margin: "0 0 8px 0", fontSize: "16px" }}>Income</h4>
          <p style={{ color: "#16a34a", fontSize: "24px", fontWeight: "bold", margin: "0" }}>₹{income}</p>
        </div>
        <div style={styles.card}>
          <h4 style={{ color: isDark ? "#f8fafc" : "#111827", margin: "0 0 8px 0", fontSize: "16px" }}>Expense</h4>
          <p style={{ color: "#ef4444", fontSize: "24px", fontWeight: "bold", margin: "0" }}>₹{expense}</p>
        </div>
 <FinancialHealthIndicator income={income} expense={expense} />
 {dueSoon.length > 0 && (
  <div className="bills-banner-inline" >
    ⚠️ Bills due: {dueSoon.map(b => b.title).join(", ")}
  </div>
)}



 </div>

      {/* ADD / EDIT TRANSACTION */}
      <TransactionForm
        refresh={load}
        editingTx={editingTx}
        cancelEdit={() => setEditingTx(null)}
      />

    

      {/* ACTIONS */}
      <div style={styles.actions} className="actions-wrapper">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>Summary:</label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            style={{ padding: 8, borderRadius: 8 }}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button onClick={download}>Download Excel</button>
        <button onClick={sendSummary}>Send Summary Email</button>
      </div>

      {/* TRANSACTIONS */}
      <TransactionList
        data={transactions}
        refresh={load}
        onEdit={(tx) => setEditingTx(tx)}
      />
       <div style={{ marginTop: 30 }}>
  <BillsReminder />
</div>
      {/* Optional Group Trip Split feature (frontend only) */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowTrips((s) => !s)}>{showTrips ? "Hide" : "Group Trip Split"}</button>
        {showTrips && <TripManager onClose={() => setShowTrips(false)} />}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    maxWidth: 900,
    margin: "auto",
    padding: 20,
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summary: {
    display: "flex",
    gap: 20,
    marginTop: 20,
    marginBottom: 25,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,.05)",
    marginTop: 20,
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },
  tx: {
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  
};
