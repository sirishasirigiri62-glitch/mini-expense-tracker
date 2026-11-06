
import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Food",
    expense_date: localToday,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.description.trim() ||
      !formData.amount ||
      Number(formData.amount) <= 0 ||
      !formData.expense_date
    ) {
      alert("Please enter valid expense details.");
      return;
    }

    try {
      setSubmitting(true);

      await onAddExpense({
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        expense_date: formData.expense_date,
      });

      setFormData({
        description: "",
        amount: "",
        category: "Food",
        expense_date: localToday,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-card expense-form-section">

      <div className="section-heading">
        <div>
          <h2>Add New Expense 🐱</h2>
          <p>Record your daily spending</p>
        </div>

        <span className="form-decoration">💰</span>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">

        <div className="form-group">
          <label>Description</label>

          <input
            type="text"
            name="description"
            placeholder="e.g. Lunch, Groceries, Bus ticket"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Amount (₹)</label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚌 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Health">💊 Health</option>
              <option value="Other">✨ Other</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>Expense Date</label>

          <input
            type="date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="add-expense-button"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "+ Add Expense"}
        </button>

      </form>
    </section>
  );
}

export default ExpenseForm;
