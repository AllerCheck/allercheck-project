import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const router = express.Router();

// 🟢 Registrierung eines neuen Nutzers (ohne Medikamente & Allergien)
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, dob, acceptPolicy } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO users (first_name, last_name, email, password, dob, acceptPolicy) VALUES (?, ?, ?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword, dob, acceptPolicy]
        );
        conn.release();

        res.status(201).json({ message: "Nutzer erfolgreich registriert" });
    } catch (error) {
        console.error("🔥 Fehler bei der Registrierung:", error);
        res.status(500).json({ message: "Fehler bei der Registrierung", error: error.message });
    }
});

// 🟠 Nutzer-Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Nutzer anhand der E-Mail suchen
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
        conn.release();

        if (rows.length === 0) {
            return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
        }

        const user = rows[0];

        // Passwort überprüfen
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
        }

        // JWT-Token erstellen
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: "Login erfolgreich", token });
    } catch (error) {
        console.error("🔥 Fehler beim Login:", error);
        res.status(500).json({ message: "Interner Serverfehler", error: error.message });
    }
});

// 🟢 Allergien abrufen
router.get('/allergies', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM allergies");
        conn.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Allergien", error: error.message });
    }
});

// 🟢 Medikamente abrufen
router.get('/medications', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM medications");
        conn.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Medikamente", error: error.message });
    }
});

// 🟠 Allergien hinzufügen
router.post('/allergies/add', async (req, res) => {
    try {
        const { name } = req.body;
        const conn = await pool.getConnection();
        const existing = await conn.query("SELECT COUNT(*) AS count FROM allergies WHERE name = ?", [name]);

        if (existing[0] && existing[0].count > 0) {
            conn.release();
            return res.status(409).json({ message: "Allergie existiert bereits" });
        }

        await conn.query("INSERT INTO allergies (name) VALUES (?)", [name]);
        conn.release();
        res.json({ message: "Allergie erfolgreich hinzugefügt" });
    } catch (error) {
        console.error("🔥 Fehler beim Hinzufügen der Allergie:", error);
        res.status(500).json({ message: "Fehler beim Hinzufügen der Allergie", error: error.message });
    }
});

// 🟠 Medikamente hinzufügen
router.post('/medications/add', async (req, res) => {
    try {
        const { name } = req.body;
        const conn = await pool.getConnection();
        const existing = await conn.query("SELECT COUNT(*) AS count FROM medications WHERE name = ?", [name]);

        if (existing[0] && existing[0].count > 0) {
            conn.release();
            return res.status(409).json({ message: "Medikament existiert bereits" });
        }

        await conn.query("INSERT INTO medications (name) VALUES (?)", [name]);
        conn.release();
        res.json({ message: "Medikament erfolgreich hinzugefügt" });
    } catch (error) {
        console.error("🔥 Fehler beim Hinzufügen des Medikaments:", error);
        res.status(500).json({ message: "Fehler beim Hinzufügen des Medikaments", error: error.message });
    }
});

export default router;
