import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
import pool from '../config/db.js'; 

dotenv.config();

const router = express.Router();

// 🟢 Registrierung eines neuen Nutzers
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, dob, medications, allergies, acceptPolicy } = req.body;

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Nutzer in der Datenbank speichern
        const conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO users (first_name, last_name, email, password, dob, medications, allergies, acceptPolicy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword, dob, medications, allergies, acceptPolicy]
        );
        conn.release();

        res.status(201).json({ message: 'Nutzer erfolgreich registriert' });
    } catch (error) {
        console.error('🔥 Fehler bei der Registrierung:', error);
        res.status(500).json({ message: 'Interner Serverfehler', error: error.message });
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
            return res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
        }

        const user = rows[0];

        // Passwort überprüfen
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
        }

        // JWT-Token erstellen
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Login erfolgreich', token });
    } catch (error) {
        console.error('🔥 Fehler beim Login:', error);
        res.status(500).json({ message: 'Interner Serverfehler', error: error.message });
    }
});

export default router;
