// index.js
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'doctor_dashboard',
  password: '1246',
  port: 5432,
});

app.get('/', (req, res) => res.send('MCP Server running ✅'));

// Get all patients
app.get('/patients', async (req, res) => {
  const result = await pool.query('SELECT * FROM patients');
  res.json(result.rows);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP Server running at http://localhost:${PORT}`);
});

const { generatePrescription } = require("./ai");

app.post("/generate-prescription", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required" });
  }

  try {
    const prescription = await generatePrescription(symptoms);
    res.json({ prescription });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Failed to generate prescription" });
  }
});
app.get("/prescription/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT name, prescription FROM patients WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
});

// Add new patient
app.post("/patients", async (req, res) => {
  const { name, age, gender } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({ error: "Name, age, and gender are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3) RETURNING *",
      [name, age, gender]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Failed to add patient" });
  }
});

app.post("/prescription/:id", async (req, res) => {
  const { id } = req.params;
  const { prescription } = req.body;

  if (!prescription) {
    return res.status(400).json({ error: "Prescription content is required" });
  }

  try {
    await pool.query("UPDATE patients SET prescription = $1 WHERE id = $2", [
      prescription,
      id,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Failed to update prescription" });
  }
});
