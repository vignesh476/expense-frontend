import { useState, useEffect } from "react";
import { api } from "./api";

export default function TransactionForm({ refresh, editingTx, cancelEdit }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [createdAt, setCreatedAt] = useState("");

  // Populate form when editing
  useEffect(() => {
  if (editingTx) {
    setEditingId(editingTx.id);
    setAmount(editingTx.amount?.toString() || "");
    setType(editingTx.type || "expense");
    setDescription(editingTx.description || "");
    setCreatedAt(
      editingTx.created_at
        ? new Date(editingTx.created_at).toISOString().slice(0, 16)
        : ""
    );
  } else {
    setEditingId(null);
    setAmount("");
    setType("expense");
    setDescription("");
    setCreatedAt("");
  }
}, [editingTx]);

  // Add or update transaction
  async function addOrUpdate() {
    if (!amount) return alert("Amount required");
    if (!description) return alert("Description required");

    // Budget check: if there's a saved budget and this is an expense,
    // fetch current transactions to compute projected totals and warn user.
    try {
      const raw = localStorage.getItem("budget_limits");
      const budget = raw ? JSON.parse(raw) : null;
      const amt = Number(amount) || 0;
      if (budget && type === "expense") {
        const txs = await api("/transactions");

        // exclude the editing tx when updating
        const relevant = txs.filter((t) => t.type === "expense" && t.id !== editingId);

        const now = new Date();
        const todayStr = now.toDateString();

        const todaySum = relevant
          .filter((t) => new Date(t.created_at || t.created).toDateString() === todayStr)
          .reduce((a, b) => a + b.amount, 0);

        const monthSum = relevant
          .filter((t) => {
            const d = new Date(t.created_at || t.created);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((a, b) => a + b.amount, 0);

        const projectedToday = todaySum + (type === "expense" ? amt : 0);
        const projectedMonth = monthSum + (type === "expense" ? amt : 0);

        if ((Number(budget.daily) > 0 && projectedToday > Number(budget.daily)) ||
            (Number(budget.monthly) > 0 && projectedMonth > Number(budget.monthly))) {
          const ok = confirm(
            `This transaction will exceed your budget. Proceed? (Today: ₹${projectedToday}, Month: ₹${projectedMonth})`
          );
          if (!ok) return;
        }
      }
    } catch (e) {
      // ignore budget check errors
      console.warn("Budget check failed", e);
    }

    const url = editingId
      ? `/transaction/${editingId}?amount=${amount}&type=${type}&description=${description}` +
        (createdAt ? `&created_at=${createdAt}` : "")
      : `/transaction?amount=${amount}&type=${type}&description=${description}` +
        (createdAt ? `&created_at=${createdAt}` : "");

    await api(url, { method: editingId ? "PUT" : "POST" });

    // Reset form
    setAmount("");
    setDescription("");
    setType("expense");
    setCreatedAt("");
    setEditingId(null);

    // Refresh transaction list
    refresh();

    // Close edit mode if applicable
    cancelEdit && cancelEdit();
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>
        {editingId ? "Edit Transaction" : "Add Transaction"}
      </h3>

      <form
        style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}
        onSubmit={(e) => {
          e.preventDefault();
          addOrUpdate();
        }}
      >
        <div style={styles.formField}>
          <label htmlFor="description" style={styles.label}>Purpose / Description</label>
          <input
            id="description"
            name="description"
            placeholder="Purpose / Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formField}>
          <label htmlFor="amount" style={styles.label}>Amount</label>
          <input
            id="amount"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formField}>
          <label htmlFor="createdAt" style={styles.label}>Date & Time (optional)</label>
          <input
            id="createdAt"
            name="createdAt"
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formField}>
          <label htmlFor="type" style={styles.label}>Type</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.input}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={styles.buttonSubmit}>
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={styles.buttonCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


const styles = {
  card: {
    background: "#fff",
    borderRadius: "11px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    padding: "20px",
    marginBottom: "24px",
  },
  heading: {
    margin: "0 0 16px",
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },
  buttonSubmit: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  buttonCancel: {
    background: "#f3f4f6",
    color: "#374151",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};