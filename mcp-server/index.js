// index.js
require("dotenv").config({ path: "./.env" });


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
 
});


app.get("/", (req, res) => res.send("MCP Server running ✅"));

app.get("/patients", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM patients ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

const PORT = process.env.PORT || 3001;

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
      "SELECT name, age, gender, prescription FROM patients WHERE id = $1",
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

app.post("/prescription/:id", async (req, res) => {
  const { id } = req.params;
  const { prescription } = req.body;

  if (prescription == null || prescription === undefined) {
    return res.status(400).json({ error: "Prescription is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE patients SET prescription = $1 WHERE id = $2 RETURNING *",
      [prescription, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Prescription updated", patient: result.rows[0] });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Failed to update prescription" });
  }
});

app.post("/patients", async (req, res) => {
  const { name, age, gender } = req.body;

  if (!name || !age || !gender) {
    return res
      .status(400)
      .json({ error: "Name, age, and gender are required" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM patients WHERE name = $1 AND age = $2 AND gender = $3",
      [name, age, gender]
    );

    if (existing.rows.length > 0) {
      const currentVisitCount = existing.rows[0].visit_count;

      // Increase visit count & clear prescription
      const updated = await pool.query(
        "UPDATE patients SET visit_count = visit_count + 1, prescription = NULL, created_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",

        [existing.rows[0].id]
      );

      return res.status(200).json({
        patient: updated.rows[0],
        isReturning: true,
        visitCountIncreased: currentVisitCount + 1,
      });
    } else {
      // Insert new patient
      const result = await pool.query(
        "INSERT INTO patients (name, age, gender, visit_count, prescription) VALUES ($1, $2, $3, 1, NULL) RETURNING *",
        [name, age, gender]
      );

      return res
        .status(201)
        .json({ patient: result.rows[0], isReturning: false });
    }
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Failed to add or update patient" });
  }
});

app.delete("/patients", async (req, res) => {
  const { name, age, gender } = req.body;

  if (!name || !age || !gender) {
    return res
      .status(400)
      .json({ error: "Name, age, and gender are required for deletion" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM patients WHERE name = $1 AND age = $2 AND gender = $3",
      [name, age, gender]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "No matching patient found" });
    }

    const deleted = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [existing.rows[0].id]
    );

    return res.status(200).json({
      message: "Patient deleted successfully",
      deletedPatient: deleted.rows[0],
    });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

