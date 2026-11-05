
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryCards from "./components/SummaryCards";

import "./App.css";

// Backend API URL
const API = "http://localhost:5000/api/expenses";

function App() {

    const [expenses, setExpenses] = useState([]);

    const [summary, setSummary] = useState({
        totalExpenses: 0,
        transactionCount: 0,
        categoryBreakdown: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch expenses and summary
    const fetchData = useCallback(async () => {
        try {
            setError("");

            const [expensesResponse, summaryResponse] =
                await Promise.all([
                    axios.get(API),
                    axios.get(`${API}/summary`)
                ]);

            setExpenses(expensesResponse.data);
            setSummary(summaryResponse.data);

        } catch (err) {
            console.error("Fetch error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load expenses. Check your backend server."
            );

        } finally {
            setLoading(false);
        }
    }, []);

    // Load data when component mounts
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Add expense
    const handleAddExpense = async (expenseData) => {

        const response = await axios.post(API, expenseData);

        await fetchData();

        return response.data;
    };

    // Delete expense
    const handleDeleteExpense = async (id) => {

        try {
            setDeletingId(id);
            setError("");

            await axios.delete(`${API}/${id}`);

            await fetchData();

        } catch (err) {
            console.error("Delete error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to delete expense."
            );

        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="app-container">

            <header className="app-header">
                <div className="brand">
                    <div className="brand-icon">₹</div>

                    <div>
                        <h1>SpendTrack</h1>
                        <p>Personal Expense Manager</p>
                    </div>
                </div>

                <div className="header-label">
                    <span className="status-dot"></span>
                    Expense Dashboard
                </div>
            </header>

            <main className="dashboard">

                <div className="welcome-section">
                    <div>
                        <h2>Dashboard Overview</h2>
                        <p>
                            Track your spending and manage your money.
                        </p>
                    </div>

                    <span className="today-date">
                        {new Date().toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })}
                    </span>
                </div>

                {error && (
                    <div className="error-banner">
                        {error}
                        <button onClick={fetchData}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">
                        Loading your expense dashboard...
                    </div>
                ) : (
                    <>
                        <SummaryCards summary={summary} />

                        <div className="content-grid">

                            <ExpenseForm
                                onExpenseAdded={handleAddExpense}
                            />

                            <ExpenseList
                                expenses={expenses}
                                onDelete={handleDeleteExpense}
                                deletingId={deletingId}
                            />

                        </div>
                    </>
                )}

            </main>

            <footer className="app-footer">
                SpendTrack © {new Date().getFullYear()} |
                Manage your expenses wisely.
            </footer>

        </div>
    );
}

export default App;
