require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const app = express();
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running!");
});
app.use("/api/expenses", expenseRoutes);
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");

        console.log("PostgreSQL connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();