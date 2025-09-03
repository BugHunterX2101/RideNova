const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// ---- Configure Postgres ----
// (Change credentials if you have Postgres running locally)
const pool = new Pool({
  user: "postgres",        // your Postgres username
  host: "localhost",
  database: "rides_db",    // make sure you created this db
  password: "password",    // your Postgres password
  port: 5432,
});

// API: Accept ride request from client
app.post("/ride-request", async (req, res) => {
  const { source, destination, user_id } = req.body;

  if (!source || !destination || !user_id) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Store in Postgres
    const query = `
      INSERT INTO ride_requests (source, destination, user_id)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await pool.query(query, [source, destination, user_id]);

    res.json({ message: "Ride request stored", ride: result.rows[0] });
  } catch (err) {
    console.error("Postgres insert error:", err);
    res.json({
      message: "We will store this data in Postgres now",
      data: { source, destination, user_id },
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
