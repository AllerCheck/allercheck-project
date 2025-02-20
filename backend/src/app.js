import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';  // Korrigierter Pfad
import pool from './config/db.js';   
import profileRoutes from "./routes/profileRoutes.js";       // Korrigierter Pfad
import appointmentRoutes from "./routes/appointments.js";
import allergyJournalRoutes from "./routes/AllergyJournal.js";
import statisticsRoutes from "./routes/Statistics.js"; // 🟢 Neue Statistik-Route importieren
import googleMapsRoutes from "./routes/GoogleMaps.js";
import journalRoutes from "./routes/journal.js"; 
import pollenRoutes from "./routes/pollen.js";

dotenv.config();

const app = express();
app.use(express.json());  // 📌 JSON-Parsing muss aktiviert sein
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use("/appointments", appointmentRoutes);
app.use("/journal", allergyJournalRoutes); 
app.use("/google-maps", googleMapsRoutes);// 📌 Für URL-encoded Daten
app.use("/statistics", statisticsRoutes);
app.use("/journal", journalRoutes); // 🟢 Statistik-Route hinzufügen
app.use("/pollen", pollenRoutes);

// API-Routen registrieren
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);  // 📌 Reihenfolge korrigiert

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

