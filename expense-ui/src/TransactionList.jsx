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
    <div style={styles.card}>
      <h3 style={styles.heading}>Transactions</h3>

      {data.map((t) => (
        <div style={styles.tx} key={t.id}>
          <div style={styles.txInfo}>
            <div style={styles.txTop}>
              <span style={{ ...styles.txType, color: t.type === "income" ? "#16a34a" : "#ef4444" }}>
                {t.type}
              </span>
              <span style={styles.txAmount}>₹{t.amount}</span>
            </div>
            <div style={styles.txDescription}>{t.description}</div>
            {t.created_at && <div style={styles.txMeta}>{fmt(t.created_at)}</div>}
          </div>

          <div style={styles.txActions}>
            <button style={styles.actionButton} onClick={() => onEdit && onEdit(t)}>Edit</button>
            <button style={styles.actionButton} onClick={() => del(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    padding: "20px",
    marginTop: "24px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "16px",
    color: "#111827",
  },
  tx: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9fafb",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  txInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  txTop: {
    display: "flex",
    gap: "8px",
    alignItems: "baseline",
  },
  txType: {
    fontWeight: 600,
    fontSize: "14px",
    textTransform: "capitalize",
  },
  txAmount: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  txDescription: {
    fontSize: "14px",
    color: "#374151",
  },
  txMeta: {
    fontSize: "12px",
    color: "#6b7280",
  },
  txActions: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    cursor: "pointer",
    background: "#e5e7eb",
    color: "#374151",
  },
};