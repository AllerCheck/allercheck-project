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

// Profil abrufen mit Debugging
router.get('/', async (req, res) => {
    try {
        let authHeader = req.headers['Authorization'];
        console.log("🔍 Rohdaten-Header:", req.headers);

        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        // Entferne Leerzeichen am Anfang und Ende
        authHeader = authHeader.trim();
        console.log("🔍 Bereinigter Header:", authHeader);

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Ungültiges Token-Format" });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔍 Extrahiertes Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token valid:", decoded);

        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT first_name, last_name, email, dob, medications, allergies FROM users WHERE id = ?", [decoded.id]);
        conn.release();

        if (rows.length === 0) {
            console.log("❌ Kein Benutzer mit dieser ID gefunden:", decoded.id);
            return res.status(404).json({ message: "Benutzer nicht gefunden" });
        }

        console.log("✅ Benutzer gefunden:", rows[0]);
        res.json(rows[0]);

    } catch (error) {
        console.error("🔥 Fehler bei der Token-Verarbeitung:", error.message);
        res.status(401).json({ message: "Token ungültig oder fehlt", error: error.message });
    }
});

// Profil bearbeiten
router.put('/update', async (req, res) => {
    const { first_name, last_name, dob, medications, allergies } = req.body;
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: "Kein Token vorhanden" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        await conn.query("UPDATE users SET first_name = ?, last_name = ?, dob = ?, medications = ?, allergies = ? WHERE id = ?", 
                         [first_name, last_name, dob, medications, allergies, decoded.id]);
        conn.release();

        res.json({ message: "Profil erfolgreich aktualisiert" });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Aktualisieren des Profils", error: error.message });
    }
});


// E-Mail & Passwort aktualisieren
router.put('/update-auth', async (req, res) => {
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

// Profil löschen
router.delete('/delete', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: "Kein Token vorhanden" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        await conn.query("DELETE FROM users WHERE id = ?", [decoded.id]);
        conn.release();

        res.json({ message: "Profil erfolgreich gelöscht" });
    } catch (error) {
        console.error("🔥 Fehler beim Löschen des Profils:", error.message);
        res.status(500).json({ message: "Fehler beim Löschen des Profils", error: error.message });
    }
});


export default router;
