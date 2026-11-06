
const categoryIcons = {
  Food: "🍔",
  Transport: "🚌",
  Shopping: "🛍️",
  Bills: "💡",
  Health: "💊",
  Other: "✨",
};

function ExpenseList({ expenses, onDelete, loading }) {
  const formatDate = (date) => {
    if (!date) return "";

    const parts = String(date).slice(0, 10).split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <section className="section-card transactions-section">

      <div className="section-heading">
        <div>
          <h2>Recent Transactions 🧾</h2>
          <p>Your spending history for the selected period</p>
        </div>

        <span className="transaction-count">
          {expenses.length} records
        </span>
      </div>

      {loading ? (
        <div className="empty-state">
          Loading your expenses... 🐾
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <span>🐱</span>
          <h3>No expenses found!</h3>
          <p>Try another date or add your first expense.</p>
        </div>
      ) : (
        <div className="transaction-list">

          {expenses.map((expense) => (
            <div className="transaction-item" key={expense.id}>

              <div className="transaction-icon">
                {categoryIcons[expense.category] || "✨"}
              </div>

              <div className="transaction-details">
                <h4>{expense.description}</h4>

                <p>
                  {expense.category} · {formatDate(expense.expense_date)}
                </p>
              </div>

              <div className="transaction-right">
                <strong>
                  -₹{Number(expense.amount).toFixed(2)}
                </strong>

                <button
                  className="delete-button"
                  onClick={() => onDelete(expense.id)}
                  title="Delete expense"
                >
                  ✕
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default ExpenseList;
