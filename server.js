const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require('dotenv').config();

const app = express();

// ---- Enable CORS with specific origin ----
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ---- Configure Postgres with environment variables ----
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ✅ Root route to test server
app.get("/", (req, res) => {
  res.type("text/plain");   // ensure plain text response
  res.send("Ride Request API is running 🚀");
});

// API: Accept ride request from client
app.post("/ride-request", async (req, res) => {
  const { source, destination, user_id } = req.body;

  // Input validation
  if (!source || !destination || !user_id) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "source, destination, and user_id are required"
    });
  }

  try {
    const query = `
      INSERT INTO ride_requests (source, destination, user_id)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await pool.query(query, [source, destination, user_id]);

    res.json({ message: "Ride request stored", ride: result.rows[0] });
  } catch (err) {
    console.error("Postgres insert error:", err.message);
    res.status(500).json({
      error: "Database error",
      message: "Failed to process ride request"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
