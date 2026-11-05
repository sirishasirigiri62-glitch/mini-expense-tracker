
const express = require("express");

const router = express.Router();

const {
    getExpenses,
    addExpense,
    deleteExpense,
    getExpenseSummary
} = require("../controllers/expenseController");

// GET all expenses
router.get("/", getExpenses);

// GET summary
router.get("/summary", getExpenseSummary);

// ADD expense
router.post("/", addExpense);

// DELETE expense
router.delete("/:id", deleteExpense);

module.exports = router;
