import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🟢 Get all appointments
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const conn = await pool.getConnection();
    const appointments = await conn.query(
      "SELECT id, title, DATE_FORMAT(appointment_date, '%Y-%m-%dT%H:%i:%sZ') as appointment_date, category, description FROM appointments WHERE user_id = ?",
      [decoded.id]
    );
    conn.release();

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Termine", error: error.message });
  }
});

// 🟠 Add a new appointment
router.post("/", async (req, res) => {
  try {
    console.log("📌 Request Headers:", req.headers);
    console.log("📌 Request Body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request-Body ist leer oder nicht formatiert" });
    }

    const { title, appointment_date, category, description } = req.body;

    if (!title || !appointment_date || !category) {
      return res.status(400).json({ message: "Alle Pflichtfelder sind erforderlich!" });
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO appointments (user_id, title, appointment_date, category, description) VALUES (?, ?, ?, ?, ?)",
      [decoded.id, title, appointment_date, category, description]
    );
    conn.release();

    res.json({ message: "Termin erfolgreich hinzugefügt" });
  } catch (error) {
    console.error("🔥 Fehler beim Hinzufügen des Termins:", error);
    res.status(500).json({ message: "Fehler beim Hinzufügen des Termins", error: error.message });
  }
});

// 🟠 Update an appointment
router.put("/:id", async (req, res) => {
  try {
    const { title, appointment_date, category, description } = req.body;
    const { id } = req.params;
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const conn = await pool.getConnection();
    await conn.query(
      "UPDATE appointments SET title = ?, appointment_date = ?, category = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, appointment_date, category, description, id, decoded.id]
    );
    conn.release();

    res.json({ message: "Termin erfolgreich aktualisiert" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Aktualisieren des Termins", error: error.message });
  }
});

// 🔴 Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const conn = await pool.getConnection();
    await conn.query("DELETE FROM appointments WHERE id = ? AND user_id = ?", [id, decoded.id]);
    conn.release();

    res.json({ message: "Termin erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen des Termins", error: error.message });
  }
});

export default router;