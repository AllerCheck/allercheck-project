import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Registrierung
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, emailConfirm, password, passwordConfirm, dob, medications, allergies, acceptPolicy } = req.body;
    if (!firstName || !lastName || !email || !emailConfirm || !password || !passwordConfirm || acceptPolicy === undefined) {
        return res.status(400).json({ message: 'Alle Pflichtfelder sind erforderlich!' });
    }
    if (email !== emailConfirm) {
        return res.status(400).json({ message: 'E-Mails stimmen nicht überein!' });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: 'Passwörter stimmen nicht überein!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO users (firstName, lastName, email, password, dob, medications, allergies, acceptPolicy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, dob || null, medications || null, allergies || null, acceptPolicy]
        );
        conn.release();
        res.status(201).json({ message: 'Registrierung erfolgreich' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler bei der Registrierung', error });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'E-Mail und Passwort erforderlich!' });

    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        conn.release();

        if (rows.length === 0) return res.status(401).json({ message: 'Benutzer nicht gefunden' });
        const user = rows[0];
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Falsches Passwort' });

        const token = generateToken(user);
        res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, dob: user.dob, medications: user.medications, allergies: user.allergies } });
    } catch (error) {
        res.status(500).json({ message: 'Login fehlgeschlagen', error });
    }
});

export default router;
