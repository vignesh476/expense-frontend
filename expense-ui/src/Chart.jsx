export default function Chart({ income, expense }) {
  const max = Math.max(income, expense) || 1;

  return (
    <div className="card">
      <h3>Summary</h3>

      <div>
        Income
        <div style={{
          height: 20,
          width: `${(income / max) * 100}%`,
          background: "green"
        }} />
      </div>

      <div>
        Expense
        <div style={{
          height: 20,
          width: `${(expense / max) * 100}%`,
          background: "red"
        }} />
      </div>
    </div>
  );
}
