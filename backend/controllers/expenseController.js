
const pool = require("../config/db");

// Allowed expense categories
const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Health",
    "Other"
];

// 1. GET ALL EXPENSES
const getExpenses = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM expenses
             ORDER BY expense_date DESC, id DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get expenses error:", error.message);

        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
};


// 2. ADD NEW EXPENSE
const addExpense = async (req, res) => {
    try {
        const { description, amount, category, expense_date } = req.body;

        // Validate description
        if (
            typeof description !== "string" ||
            !description.trim()
        ) {
            return res.status(400).json({
                message: "Description is required"
            });
        }

        // Validate amount
        const numericAmount = Number(amount);

        if (
            amount === "" ||
            amount === null ||
            amount === undefined ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                message: "Enter a valid amount greater than zero"
            });
        }

        // Validate category
        if (!categories.includes(category)) {
            return res.status(400).json({
                message: "Invalid expense category"
            });
        }

        // Insert into PostgreSQL
        const result = await pool.query(
            `INSERT INTO expenses
             (description, amount, category, expense_date)
             VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
             RETURNING *`,
            [
                description.trim(),
                numericAmount,
                category,
                expense_date || null
            ]
        );

        res.status(201).json({
            message: "Expense added successfully",
            expense: result.rows[0]
        });

    } catch (error) {
        console.error("Add expense error:", error.message);

        res.status(500).json({
            message: "Failed to add expense"
        });
    }
};


// 3. DELETE EXPENSE
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            expense: result.rows[0]
        });

    } catch (error) {
        console.error("Delete expense error:", error.message);

        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
};


// 4. GET EXPENSE SUMMARY
const getExpenseSummary = async (req, res) => {
    try {
        const totalResult = await pool.query(
            `SELECT
                COALESCE(SUM(amount), 0) AS total_expenses,
                COUNT(*) AS transaction_count
             FROM expenses`
        );

        const categoryResult = await pool.query(
            `SELECT
                category,
                SUM(amount) AS total
             FROM expenses
             GROUP BY category
             ORDER BY total DESC`
        );

        res.status(200).json({
            totalExpenses: Number(
                totalResult.rows[0].total_expenses
            ),
            transactionCount: Number(
                totalResult.rows[0].transaction_count
            ),
            categoryBreakdown: categoryResult.rows.map(item => ({
                category: item.category,
                total: Number(item.total)
            }))
        });

    } catch (error) {
        console.error("Summary error:", error.message);

        res.status(500).json({
            message: "Failed to fetch expense summary"
        });
    }
};


module.exports = {
    getExpenses,
    addExpense,
    deleteExpense,
    getExpenseSummary
};
