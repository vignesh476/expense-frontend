import { useEffect, useState } from "react";
import { api } from "./api";

export default function TripManager({ onClose }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({ trip_name: "", start_date: "", end_date: "" });

  async function load() {
    setLoading(true);
    setError("");
    try {
      // expected GET /trips (backend may differ)
      const data = await api("/trips");
      setTrips(data || []);
    } catch (e) {
      setError(e.message || "Failed to load trips (API may not exist)");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createTrip() {
    if (!form.trip_name) return alert("Trip name required");
    try {
      await api(`/trips`, { method: "POST", body: JSON.stringify(form) });
      setForm({ trip_name: "", start_date: "", end_date: "" });
      load();
    } catch (e) {
      alert(e.message || "Create failed");
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Group Trip Split</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose}>Close</button>
          <button onClick={load}>Refresh</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Create Trip</h4>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input placeholder="Trip name" value={form.trip_name} onChange={(e) => setForm((f) => ({ ...f, trip_name: e.target.value }))} />
          <input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
          <input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
          <button onClick={createTrip}>Create</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h4>Your Trips</h4>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {trips.length === 0 && <div>No trips found</div>}
            {trips.map((t) => (
              <div key={t.id || t._id} className="trip-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{t.trip_name || t.name}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted, #666)" }}>
                    {t.start_date} — {t.end_date}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setSelected(t)}>Open</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <TripDetail trip={selected} onClose={() => { setSelected(null); load(); }} />}
    </div>
  );
}

function TripDetail({ trip, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pname, setPname] = useState("");
  const [expenseForm, setExpenseForm] = useState({ paid_by: "", amount: "", description: "" });
  const [settlement, setSettlement] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    loadDetail();
  }, [trip]);

  async function loadDetail() {
    try {
      setErr("");
      // Try GET /trips/{id} for details
      const data = await api(`/trips/${trip.id || trip._id}`);
      setParticipants(data.participants || []);
      setExpenses(data.expenses || []);
    } catch (e) {
      // If endpoint not present, show empty
      setErr(e.message || "Failed to load details (API may not exist)");
    }
  }
async function downloadExcel() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authentication required");
      return;
    }

    // Use backend export endpoint with token as query param
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const downloadUrl = `${apiUrl}/trips/${trip.id || trip._id}/export?token=${encodeURIComponent(token)}`;

    const res = await fetch(downloadUrl);
    if (!res.ok) {
      alert("Failed to download Excel: " + res.statusText);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trip_${trip.trip_name || "summary"}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    alert("Error: " + (e.message || "Failed to download"));
  }
}



  async function addParticipant() {
    if (!pname) return;
    try {
      await api(`/trips/${trip.id || trip._id}/participant`, { method: "POST", body: JSON.stringify({ name: pname }) });
      setPname("");
      loadDetail();
    } catch (e) {
      alert(e.message || "Failed");
    }
  }

  async function addExpense() {
    if (!expenseForm.paid_by || !expenseForm.amount) return alert("Paid by and amount required");
    try {
      await api(`/trips/${trip.id || trip._id}/expense`, { method: "POST", body: JSON.stringify(expenseForm) });
      setExpenseForm({ paid_by: "", amount: "", description: "" });
      loadDetail();
    } catch (e) {
      alert(e.message || "Failed");
    }
  }

  async function doSettlement() {
    try {
      const res = await api(`/trips/${trip.id || trip._id}/settlement`);
      setSettlement(res);
    } catch (e) {
      alert(e.message || "Failed to compute settlement");
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>Trip: {trip.trip_name || trip.name}</h4>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      {err && <div style={{ color: "red" }}>{err}</div>}

      <div style={{ marginTop: 8 }}>
        <h5>Participants</h5>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input placeholder="Name" value={pname} onChange={(e) => setPname(e.target.value)} />
          <button onClick={addParticipant}>Add</button>
        </div>
        <div style={{ marginTop: 8 }}>
          {participants.length === 0 && <div>No participants</div>}
          {participants.map((p, i) => <div key={i}>{p.name || p}</div>)}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h5>Add Expense</h5>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input placeholder="Paid by" value={expenseForm.paid_by} onChange={(e) => setExpenseForm((f) => ({ ...f, paid_by: e.target.value }))} />
          <input placeholder="Amount" value={expenseForm.amount} onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))} />
          <input placeholder="Description" value={expenseForm.description} onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))} />
          <button onClick={addExpense}>Add</button>
        </div>

        <div style={{ marginTop: 8 }}>
          <h5>Expenses</h5>
          {expenses.length === 0 && <div>No expenses</div>}
          {expenses.map((ex, idx) => (
            <div key={idx} style={{ padding: 6, borderBottom: "1px solid var(--border, #eee)" }}>
              <div><strong>{ex.paid_by}</strong> — ₹{ex.amount}</div>
              <div style={{ fontSize: 12, color: "var(--muted, #666)" }}>{ex.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={doSettlement}>Split Expenses</button>
        {settlement && (
          <div style={{ marginTop: 12 }}>
            <h5>Settlement</h5>
            {settlement.lines && settlement.lines.length === 0 && <div>No settlements needed</div>}
            {settlement.lines && settlement.lines.map((l, i) => <div key={i}>{l}</div>)}
            {settlement.total && <div style={{ marginTop: 8 }}>Total: ₹{settlement.total}</div>}
          </div>
        )}
      </div>
      <button onClick={downloadExcel}>
  📥 Download Excel
</button>

    </div>
    
  );
}
