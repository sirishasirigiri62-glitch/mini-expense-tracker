
import { Client } from "pg";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Other"
];

function json(data, status, origin) {
  return Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/" && request.method === "GET") {
      return new Response("Expense Tracker API is running!", {
        headers: {
          "Access-Control-Allow-Origin": origin
        }
      });
    }

    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString
    });

    try {
      await client.connect();

      // GET ALL EXPENSES
      if (path === "/api/expenses" && request.method === "GET") {
        const result = await client.query(
          `SELECT * FROM expenses
           ORDER BY expense_date DESC, id DESC`
        );

        return json(result.rows, 200, origin);
      }

      // GET EXPENSE SUMMARY
      if (path === "/api/expenses/summary" && request.method === "GET") {
        const totalResult = await client.query(
          `SELECT
             COALESCE(SUM(amount), 0) AS total_expenses,
             COUNT(*) AS transaction_count
           FROM expenses`
        );

        const categoryResult = await client.query(
          `SELECT category, SUM(amount) AS total
           FROM expenses
           GROUP BY category
           ORDER BY total DESC`
        );

        return json({
          totalExpenses: Number(totalResult.rows[0].total_expenses),
          transactionCount: Number(totalResult.rows[0].transaction_count),
          categoryBreakdown: categoryResult.rows.map(item => ({
            category: item.category,
            total: Number(item.total)
          }))
        }, 200, origin);
      }

      // ADD EXPENSE
      if (path === "/api/expenses" && request.method === "POST") {
        const body = await request.json();

        const { description, amount, category, expense_date } = body;
        const numericAmount = Number(amount);

        if (typeof description !== "string" || !description.trim()) {
          return json({ message: "Description is required" }, 400, origin);
        }

        if (
          amount === "" ||
          amount === null ||
          amount === undefined ||
          !Number.isFinite(numericAmount) ||
          numericAmount <= 0
        ) {
          return json({
            message: "Enter a valid amount greater than zero"
          }, 400, origin);
        }

        if (!categories.includes(category)) {
          return json({ message: "Invalid expense category" }, 400, origin);
        }

        const result = await client.query(
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

        return json({
          message: "Expense added successfully",
          expense: result.rows[0]
        }, 201, origin);
      }

      // DELETE EXPENSE
      const deleteMatch = path.match(/^\/api\/expenses\/([1-9]\d*)$/);

      if (deleteMatch && request.method === "DELETE") {
        const result = await client.query(
          "DELETE FROM expenses WHERE id = $1 RETURNING *",
          [deleteMatch[1]]
        );

        if (result.rowCount === 0) {
          return json({ message: "Expense not found" }, 404, origin);
        }

        return json({
          message: "Expense deleted successfully",
          expense: result.rows[0]
        }, 200, origin);
      }

      return json({ message: "Route not found" }, 404, origin);

    } catch (error) {
      console.error("Worker API error:", error.message);

      return json({
        message: "Internal server error"
      }, 500, origin);
    }finally {
      await client.end();
    }
  }
};
