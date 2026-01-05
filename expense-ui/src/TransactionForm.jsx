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
    <div className="card">
      <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>

      <form
        className="flex"
        style={{ flexDirection: "column", gap: "12px", marginTop: "10px" }}
        onSubmit={(e) => {
          e.preventDefault();
          addOrUpdate();
        }}
      >
       <div className="form-field">
  <label htmlFor="description">Purpose / Description</label>
  <input
    id="description"
    name="description"
    placeholder="Purpose / Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
</div>

<div className="form-field">
  <label htmlFor="amount">Amount</label>
  <input
    id="amount"
    name="amount"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />
</div>

<div className="form-field">
  <label htmlFor="createdAt">Date & Time (optional)</label>
  <input
    id="createdAt"
    name="createdAt"
    type="datetime-local"
    value={createdAt}
    onChange={(e) => setCreatedAt(e.target.value)}
  />
</div>

<div className="form-field">
  <label htmlFor="type">Type</label>
  <select
    id="type"
    name="type"
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>
</div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}