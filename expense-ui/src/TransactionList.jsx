import { api } from "./api";

export default function TransactionList({ data, refresh, onEdit }) {
  async function del(id) {
    if (!confirm("Delete this transaction?")) return;
    await api(`/transaction/${id}`, { method: "DELETE" });
    refresh();
  }

  function fmt(dt) {
    try {
      return new Date(dt).toLocaleString();
    } catch (e) {
      return dt;
    }
  }

  return (
    <div className="card">
      <h3>Transactions</h3>

      {data.map((t) => (
        <div className="tx" key={t.id}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <strong className={t.type}>{t.type}</strong>
              <span>— ₹{t.amount}</span>
            </div>
            <div>{t.description}</div>
            {t.created_at && <div className="meta">{fmt(t.created_at)}</div>}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onEdit && onEdit(t)}>Edit</button>
            <button onClick={() => del(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
