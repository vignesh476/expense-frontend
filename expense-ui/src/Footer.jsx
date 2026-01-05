import { Link } from "react-router-dom";

export default function Footer() {
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
    <footer style={styles.footer}>
      <Link to="/about">About</Link>
      <Link to="/help">Help</Link>
      <Link to="/Support">Support</Link>

      <button
        style={styles.button}
        onClick={() => (window.location.href = mailtoLink)}
      >
        📧 Contact Support
      </button>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 40,
    padding: 20,
    display: "flex",
    justifyContent: "center",
    gap: 20,
    borderTop: "1px solid #eee",
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
  },
};
