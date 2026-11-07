
import { useEffect, useState } from "react";
import axios from "axios";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryCards from "./components/SummaryCards";
import ShinchanAnimation from "./components/ShinchanAnimation";

import "./App.css";

const API_URL = "https://dsj5r5p7-5000.inc1.devtunnels.ms/";

const categories = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚌" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Bills", icon: "💡" },
  { name: "Health", icon: "💊" },
  { name: "Other", icon: "✨" },
];

function App() {
  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("month");
  const [selectedDate, setSelectedDate] = useState(todayString);

  const [budget, setBudget] = useState(() => {
    return Number(
      localStorage.getItem("spendtrack-monthly-budget")
    ) || 10000;
  });

  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budget));

  const [notification, setNotification] = useState("");
  const [animateIcons, setAnimateIcons] = useState(true);

  // Load expenses from PostgreSQL
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_URL);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.expenses || [];

      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
      setNotification("Unable to load expenses. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    const animationTimer = setTimeout(() => {
      setAnimateIcons(false);
    }, 3500);

    return () => clearTimeout(animationTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "spendtrack-monthly-budget",
      String(budget)
    );
  }, [budget]);

  const getLocalDate = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = getLocalDate(expense.expense_date);

    if (!expenseDate) return false;

    if (filterType === "day") {
      return expenseDate === selectedDate;
    }

    if (filterType === "month") {
      return expenseDate.slice(0, 7) === selectedDate.slice(0, 7);
    }

    if (filterType === "year") {
      return expenseDate.slice(0, 4) === selectedDate.slice(0, 4);
    }

    return true;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const transactionCount = filteredExpenses.length;

  const remainingBudget = budget - totalExpenses;
  const isOverspending = remainingBudget < 0;

  const spendingPercentage = budget > 0
    ? Math.min((totalExpenses / budget) * 100, 100)
    : 100;

  const remainingPercentage = budget > 0
    ? Math.max(0, (remainingBudget / budget) * 100)
    : 0;

  // Category breakdown
  const categoryBreakdown = categories.map((category) => {
    const categoryExpenses = filteredExpenses.filter(
      (expense) => expense.category === category.name
    );

    const total = categoryExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );

    return {
      ...category,
      total,
      count: categoryExpenses.length,
      percentage: totalExpenses > 0
        ? (total / totalExpenses) * 100
        : 0,
    };
  });

  const sortedCategories = [...categoryBreakdown].sort(
    (a, b) => b.total - a.total
  );

  const topCategory = sortedCategories.find(
    (category) => category.total > 0
  );

  const monthDate = new Date(
    Number(selectedDate.slice(0, 4)),
    Number(selectedDate.slice(5, 7)) - 1,
    1
  );

  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  ).getDate();

  const progressDay = filterType === "month"
    ? Math.min(
        Number(selectedDate.slice(8, 10)) || today.getDate(),
        daysInMonth
      )
    : filterType === "year"
      ? 1
      : Number(selectedDate.slice(8, 10));

  const monthProgress = filterType === "month"
    ? (progressDay / daysInMonth) * 100
    : filterType === "year"
      ? ((today.getMonth() + 1) / 12) * 100
      : 100;

  const formattedDate = new Date(
    selectedDate + "T00:00:00"
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const saveBudget = () => {
    const value = Number(budgetInput);

    if (!Number.isFinite(value) || value <= 0) {
      setNotification("Please enter a valid budget.");
      return;
    }

    setBudget(value);
    setShowBudgetInput(false);
    setNotification("Your budget has been updated!");
  };

  const addExpense = async (expenseData) => {
    try {
      await axios.post(API_URL, expenseData);
      await fetchExpenses();
      setNotification("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      setNotification("Could not add your expense.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchExpenses();
      setNotification("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      setNotification("Could not delete this expense.");
    }
  };

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <div className="app-container">

      {/* NAVBAR */}
      <header className="navbar">

        {/* BRAND */}
        <div className="brand">
          <div className="brand-icon">₹</div>

          <div>
            <h2>SpendTrack</h2>
            <p>Personal Expense Manager</p>
          </div>
        </div>

        {/* SHINCHAN RUNNING AND COLLECTING COINS */}
        <ShinchanAnimation />

      </header>

      <main className="dashboard">

        {/* PAGE HEADING */}
        <section className="dashboard-heading">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Track your spending and manage your money.</p>
          </div>

          <span className="today-date">{formattedDate}</span>
        </section>

        {/* DATE TRACKER */}
        <section className="date-tracker">

          <div className="tracker-top">
            <div>
              <h3>Time to track your money! 💰</h3>
              <p>Every rupee counts. Keep an eye on your spending.</p>
            </div>

            <div className="filter-controls">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="day">Daily</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="month-progress-info">
            <span>
              {filterType === "month"
                ? monthDate.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })
                : filterType === "year"
                  ? selectedDate.slice(0, 4)
                  : formattedDate}
            </span>

            <span>
              {filterType === "month"
                ? `Day ${progressDay} of ${daysInMonth}`
                : filterType === "year"
                  ? `${today.getMonth() + 1} / 12 months`
                  : "Selected day"}
            </span>
          </div>

          <div className="month-progress-bar">
            <div
              className="month-progress-fill"
              style={{ width: `${monthProgress}%` }}
            ></div>

            <div
              className="rupee-marker"
              style={{ left: `${Math.min(monthProgress, 96)}%` }}
            >
              ₹
            </div>
          </div>

          <div className="tracker-labels">
            <span>
              {filterType === "month" ? "Month starts" : "Period starts"}
            </span>
            <span>
              {filterType === "month" ? "Month ends" : "Selected period"}
            </span>
          </div>

        </section>

        {/* MONEY JARS */}
        <SummaryCards
          totalExpenses={totalExpenses}
          budget={budget}
          remainingBudget={remainingBudget}
          transactionCount={transactionCount}
          spendingPercentage={spendingPercentage}
          remainingPercentage={remainingPercentage}
          isOverspending={isOverspending}
          topCategory={topCategory}
          showBudgetInput={showBudgetInput}
          budgetInput={budgetInput}
          setBudgetInput={setBudgetInput}
          setShowBudgetInput={setShowBudgetInput}
          saveBudget={saveBudget}
          animateIcons={animateIcons}
        />

        {/* CATEGORY BREAKDOWN */}
        <section className="section-card category-section">

          <div className="section-heading">
            <div>
              <h2>Where does your money go? 🐾</h2>
              <p>Your spending habits by category</p>
            </div>
          </div>

          <div className="category-grid">
            {categoryBreakdown.map((category) => (
              <div className="category-item" key={category.name}>

                <div className="category-top">
                  <div className="category-title">
                    <span className={`category-icon ${animateIcons ? "icon-bounce" : ""}`}>
                      {category.icon}
                    </span>

                    <span>{category.name}</span>
                  </div>

                  <span className="category-amount">
                    ₹{category.total.toFixed(2)}
                  </span>
                </div>

                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>

                <div className="category-bottom">
                  <span>
                    {category.count} {category.count === 1 ? "payment" : "payments"}
                  </span>

                  <span>{category.percentage.toFixed(1)}% of spending</span>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* ADD EXPENSE */}
        <ExpenseForm onAddExpense={addExpense} />

        {/* TRANSACTIONS */}
        <ExpenseList
          expenses={filteredExpenses}
          onDelete={deleteExpense}
          loading={loading}
        />

      </main>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`notification ${isOverspending ? "notification-warning" : ""}`}>
          {isOverspending
            ? "🐱 Careful! Your expenses are exceeding your budget!"
            : `🐾 ${notification}`}
        </div>
      )}

    </div>
  );
}

export default App;
