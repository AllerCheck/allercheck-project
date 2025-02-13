import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';  // Korrigierter Pfad
import pool from './config/db.js';   
import profileRoutes from "./routes/profileRoutes.js";       // Korrigierter Pfad

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// API-Routen registrieren
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);

// Testverbindung zur Datenbank
pool.getConnection()
    .then(conn => {
        console.log('Erfolgreich mit MariaDB verbunden');
        conn.release();
    })
    .catch(err => {
        console.error('Fehler bei der Verbindung zur Datenbank:', err);
    });

app.get('/', (req, res) => {
    res.send('AllerCheck Backend läuft!');
});

export default app;

