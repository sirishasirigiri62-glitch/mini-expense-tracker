
import { useState } from "react";

function getToday() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60000)
        .toISOString()
        .split("T")[0];
}

function ExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "Food",
        expense_date: getToday()
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const categories = [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Health",
        "Other"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.description.trim()) {
            setError("Please enter a description");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        try {
            setLoading(true);

            await onExpenseAdded({
                ...formData,
                amount: Number(formData.amount)
            });

            setFormData({
                description: "",
                amount: "",
                category: "Food",
                expense_date: getToday()
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to add expense. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <div className="section-heading">
                <h2>Add New Expense</h2>
                <p>Record your daily spending</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="e.g. Swiggy order"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label>Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Expense Date</label>
                    <input
                        type="date"
                        name="expense_date"
                        value={formData.expense_date}
                        onChange={handleChange}
                    />
                </div>

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "+ Add Expense"}
                </button>
            </form>
        </div>
    );
}

export default ExpenseForm;
