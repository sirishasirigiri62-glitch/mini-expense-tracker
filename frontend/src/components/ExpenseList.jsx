
function ExpenseList({ expenses, onDelete, deletingId }) {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(Number(amount));
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(`${String(date).slice(0, 10)}T00:00:00`)
            .toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    };

    return (
        <div className="list-card">

            <div className="section-heading">
                <h2>Recent Transactions</h2>
                <p>Your recorded expenses</p>
            </div>

            {expenses.length === 0 ? (
                <div className="empty-state">
                    <span>🧾</span>
                    <h3>No expenses yet</h3>
                    <p>Add your first expense to get started.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td className="expense-description">
                                        {expense.description}
                                    </td>

                                    <td>
                                        <span className={`category-tag category-${expense.category.toLowerCase()}`}>
                                            {expense.category}
                                        </span>
                                    </td>

                                    <td>{formatDate(expense.expense_date)}</td>

                                    <td className="expense-amount">
                                        {formatCurrency(expense.amount)}
                                    </td>

                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => onDelete(expense.id)}
                                            disabled={deletingId === expense.id}
                                            aria-label={`Delete ${expense.description}`}
                                        >
                                            {deletingId === expense.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}

export default ExpenseList;
