import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const whatsappNumber =
    import.meta.env.VITE_SUPPORT_WHATSAPP ||917799123123;
  const message = "Hi, I need help with Expense Tracker";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "Not logged in";

  const supportEmail = "buggaramvignesh@gmail.com";
  const subject = "Expense App - Help / Query / Bug Report";

  const body = `Hi Team,

I need help with the Expense App.

User Email:
${userEmail}

Issue / Query:
-----------------

Device:
Browser:

Thanks`;

  const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  return (
    <div className="page" style={styles.container}>
      <h2 style={styles.heading}>About Expense Tracker</h2>

      <p style={styles.text}>
        Expense Tracker helps you manage your income and expenses efficiently.
        Track daily spending, limit expenses, download reports, and receive
        summaries directly to your email.
      </p>

      <div style={styles.cardGrid}>
        <div style={styles.card}>📊 Track income & expenses</div>
        <div style={styles.card}>📥 Download Excel summaries</div>
        <div style={styles.card}>📧 Email daily/monthly reports</div>
        <div style={styles.card}>🔐 Secure login & password reset</div>
      </div>

      <hr style={styles.hr} />

      <h3 style={styles.subHeading}>Need Help?</h3>

      <div style={styles.actions}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.whatsapp}
        >
          💬 Chat on WhatsApp
        </a>

        <button
            style={styles.button}
            onClick={() => (window.location.href = mailtoLink)}
        >
    Mail Us
      </button>
      </div>

      <p style={styles.footer}>
        Your data is safe • No ads 
      </p>
      <a onClick={() => navigate("/")}>
        ⬅ Back to Dashboard
      </a>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "30px",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "15px",
  },
  subHeading: {
    marginTop: "30px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    padding: "15px",
    background: "#f7f7f7",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  whatsapp: {
    background: "#25D366",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "25px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  dashboard: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  hr: {
    margin: "30px 0",
  },
  footer: {
    marginTop: "40px",
    fontSize: "12px",
    color: "#888",
  },
};
