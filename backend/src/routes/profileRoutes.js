import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    acquireTimeout: 30000
});

// Profil abrufen
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: "Kein Token vorhanden" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT id, first_name, last_name, email, dob, medications, allergies FROM users WHERE id = ?", [decoded.id]);
        conn.release();

        if (rows.length === 0) return res.status(404).json({ message: "Benutzer nicht gefunden" });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Daten", error: error.message });
    }
});

// E-Mail & Passwort aktualisieren
router.put('/profile/update-auth', async (req, res) => {
    const { email, password } = req.body;
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: "Kein Token vorhanden" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const conn = await pool.getConnection();
        await conn.query("UPDATE users SET email = ?, password = COALESCE(?, password) WHERE id = ?", [email, hashedPassword, decoded.id]);
        conn.release();

        res.json({ message: "E-Mail und/oder Passwort erfolgreich aktualisiert" });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Aktualisieren der Authentifizierungsdaten", error: error.message });
    }
});

// Medikamente & Allergien aktualisieren
router.put('/profile/update-health', async (req, res) => {
    const { medications, allergies } = req.body;
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: "Kein Token vorhanden" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        await conn.query("UPDATE users SET medications = ?, allergies = ? WHERE id = ?", [medications, allergies, decoded.id]);
        conn.release();

        res.json({ message: "Medikationen und Allergien erfolgreich aktualisiert" });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Aktualisieren der Gesundheitsdaten", error: error.message });
    }
});

export default router;
