import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const router = express.Router();

// 🟢 Registrierung eines neuen Nutzers mit Allergien & Medikamenten
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password, dob, acceptPolicy, allergies, medications } = req.body;

        if (!first_name || !last_name || !email || !password || !dob || acceptPolicy === undefined) {
            return res.status(400).json({ message: "Alle Felder sind erforderlich!" });
        }

        const conn = await pool.getConnection();

        // 🟢 Prüfen, ob die E-Mail bereits existiert
        const [existingUser] = await conn.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser) {
            conn.release();
            return res.status(409).json({ message: "E-Mail existiert bereits!" });
        }

        // 🟢 Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🟢 Benutzer in die `users`-Tabelle einfügen
        const result = await conn.query(
            "INSERT INTO users (first_name, last_name, email, password, dob, acceptPolicy) VALUES (?, ?, ?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword, dob, acceptPolicy]
        );
        const userId = Number(result.insertId);

        // 🟢 Allergien & Medikamente speichern
        if (allergies?.length > 0 || medications?.length > 0) {
            for (const allergy_id of allergies) {
                for (const medication_id of medications) {
                    await conn.query(
                        "INSERT INTO user_allergies_medications (user_id, allergy_id, medication_id) VALUES (?, ?, ?)",
                        [userId, allergy_id, medication_id]
                    );
                }
            }
        }

        conn.release();
        res.status(201).json({ message: "Registrierung erfolgreich!", userId });

    } catch (error) {
        console.error("🔥 Fehler bei der Registrierung:", error);
        res.status(500).json({ message: "Fehler bei der Registrierung", error: error.message });
    }
});

// 🟠 Nutzer-Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
        conn.release();

        if (rows.length === 0) {
            return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
        }

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

// 🟢 GET: Ruft die gespeicherten Allergien & Medikamente eines Users ab
router.get('/profile/allergies-medications/:user_id', async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: "User-ID fehlt" });
    }

    try {
        const conn = await pool.getConnection();

        const result = await conn.query(
            `SELECT a.name AS allergy, m.name AS medication
             FROM user_allergies_medications uam
             JOIN allergies a ON uam.allergy_id = a.id
             JOIN medications m ON uam.medication_id = m.id
             WHERE uam.user_id = ?`,
            [user_id]
        );

        conn.release();
        res.json(result);
    } catch (error) {
        console.error("🔥 Fehler beim Abrufen der Allergien & Medikamente:", error);
        res.status(500).json({ message: "Fehler beim Abrufen", error: error.message });
    }
});

export default router;

