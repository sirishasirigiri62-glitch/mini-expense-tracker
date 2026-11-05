
function SummaryCards({ summary }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(Number(amount || 0));
    };

    const categories = summary.categoryBreakdown || [];

    const highestCategory = categories.length > 0
        ? categories.reduce((highest, current) =>
            Number(current.total) > Number(highest.total)
                ? current
                : highest
        )
        : null;

    const total = Number(summary.totalExpenses || 0);

    return (
        <div className="summary-section">

            <div className="summary-grid">

                {/* Total Expenses */}
                <div className="summary-card total-card">
                    <div className="summary-icon">₹</div>
                    <p>Total Expenses</p>
                    <h2>{formatCurrency(total)}</h2>
                    <span>Overall spending</span>
                </div>

                {/* Transaction Count */}
                <div className="summary-card">
                    <div className="summary-icon">📋</div>
                    <p>Transactions</p>
                    <h2>{summary.transactionCount || 0}</h2>
                    <span>Total recorded expenses</span>
                </div>

                {/* Highest Spending Category */}
                <div className="summary-card">
                    <div className="summary-icon">🏷️</div>
                    <p>Top Category</p>

                    <h2 className="top-category">
                        {highestCategory
                            ? highestCategory.category
                            : "None"}
                    </h2>

                    <span>
                        {highestCategory
                            ? formatCurrency(highestCategory.total)
                            : "No spending recorded"}
                    </span>
                </div>

            </div>

            {/* Category Breakdown */}
            <div className="category-card">

                <div className="section-heading">
                    <h2>Category Breakdown</h2>
                    <p>Where your money goes</p>
                </div>

                {categories.length === 0 ? (
                    <p className="empty-category">
                        No category data available yet.
                    </p>
                ) : (

                    <div className="category-list">

                        {categories.map((item) => {

                            const percentage = total > 0
                                ? (Number(item.total) / total) * 100
                                : 0;

                            return (
                                <div
                                    className="category-item"
                                    key={item.category}
                                >

                                    <div className="category-info">
                                        <span>{item.category}</span>

                                        <strong>
                                            {formatCurrency(item.total)}
                                        </strong>
                                    </div>

                                    <div className="progress-track">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />
                                    </div>

                                    <small>
                                        {percentage.toFixed(1)}% of spending
                                    </small>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
}

export default SummaryCards;
