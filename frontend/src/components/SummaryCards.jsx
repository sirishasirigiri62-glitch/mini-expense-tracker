
function SummaryCards({
  totalExpenses,
  budget,
  remainingBudget,
  transactionCount,
  spendingPercentage,
  remainingPercentage,
  isOverspending,
  topCategory,
  showBudgetInput,
  budgetInput,
  setBudgetInput,
  setShowBudgetInput,
  saveBudget,
  animateIcons,
}) {
  const formatMoney = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const remainingFill = isOverspending
    ? 0
    : remainingPercentage;

  const expenseFill = Math.min(spendingPercentage, 100);

  return (
    <section className="summary-section">

      {/* BUDGET JAR */}
      <div className="jar-card budget-card">

        <div className="jar-heading">
          <div>
            <span className="jar-label">YOUR MONEY LEFT</span>
            <h3>Budget Jar</h3>
          </div>

          <button
            className="edit-budget"
            onClick={() => {
              setBudgetInput(String(budget));
              setShowBudgetInput(!showBudgetInput);
            }}
          >
            ✎ Edit
          </button>
        </div>

        {showBudgetInput && (
          <div className="budget-editor">
            <input
              type="number"
              min="1"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Enter monthly budget"
            />

            <button onClick={saveBudget}>Save</button>
          </div>
        )}

        <div className="jar-illustration">
          <div className="cat-character">
            {isOverspending ? "😿" : "😺"}
          </div>

          <div
            className={`glass-jar ${isOverspending ? "jar-danger" : "jar-happy"}`}
            style={{ "--fill-level": `${remainingFill}%` }}
          >
            <div className="jar-liquid"></div>

            <div className="jar-shine"></div>

            <div className="jar-money">
              ₹
            </div>
          </div>

          <div className="jar-sparkle sparkle-one">✦</div>
          <div className="jar-sparkle sparkle-two">✧</div>
        </div>

        <div className="jar-total">
          <h2 className={isOverspending ? "negative-money" : ""}>
            {formatMoney(remainingBudget)}
          </h2>

          <p>
            {isOverspending
              ? "You've exceeded your budget!"
              : "Available budget remaining"}
          </p>
        </div>

        <div className="jar-progress">
          <div
            className="jar-progress-fill green-fill"
            style={{ width: `${remainingFill}%` }}
          ></div>
        </div>

        <div className="jar-footer">
          <span>Monthly budget</span>
          <strong>{formatMoney(budget)}</strong>
        </div>

      </div>

      {/* EXPENSE JAR */}
      <div className="jar-card expense-card">

        <div className="jar-heading">
          <div>
            <span className="jar-label">MONEY SPENT</span>
            <h3>Expense Jar</h3>
          </div>

          <span className="expense-status">↗ Spending</span>
        </div>

        <div className="jar-illustration">
          <div className="cat-character">
  <img
    src={isOverspending ? "/cats/sad-cat.png" : "/cats/happy-cat.png"}
    alt="Jar cat"
  />
</div>

          <div
           className={`glass-jar expense-glass ${isOverspending ? "jar-danger" : ""}`}
            style={{ "--fill-level": `${expenseFill}%` }}
          >
            <div className="jar-liquid expense-liquid"></div>

            <div className="jar-shine"></div>

            <div className="jar-money">₹</div>
          </div>

          <div className="jar-sparkle sparkle-one">✦</div>
          <div className="jar-sparkle sparkle-two">✧</div>
        </div>

        <div className="jar-total">
          <h2>{formatMoney(totalExpenses)}</h2>
          <p>
            {isOverspending
              ? "Oh no! Budget exceeded!"
              : "Total money spent"}
          </p>
        </div>

        <div className="jar-progress">
          <div
            className="jar-progress-fill pink-fill"
            style={{ width: `${expenseFill}%` }}
          ></div>
        </div>

        <div className="jar-footer">
          <span>Transactions</span>
          <strong>{transactionCount}</strong>
        </div>

      </div>

      {/* TOP CATEGORY */}
      <div className="top-category-card">

        <span className="jar-label">YOUR FAVOURITE SPENDING</span>

        <h3>Top Category</h3>

        <div className="top-category-icon">
          {topCategory ? topCategory.icon : "🐾"}
        </div>

        <h2>{topCategory ? topCategory.name : "No expenses"}</h2>

        <p>
          {topCategory
            ? formatMoney(topCategory.total)
            : "Add an expense to get started"}
        </p>

        {topCategory && (
          <span className="top-category-count">
            {topCategory.count} payments made
          </span>
        )}

      </div>

    </section>
  );
}

export default SummaryCards;
