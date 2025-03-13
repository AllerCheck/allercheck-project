import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';  // 📌 Authentifizierungsrouten
import pool from './config/db.js';   
import profileRoutes from "./routes/profileRoutes.js";  // 📌 Profilverwaltung
import appointmentRoutes from "./routes/appointments.js"; // 📌 Termine
import allergyJournalRoutes from "./routes/AllergyJournal.js"; // 📌 Allergie-Tagebuch
import statisticsRoutes from "./routes/Statistics.js"; // 📌 Statistik-Routen
import googleMapsRoutes from "./routes/GoogleMaps.js"; // 📌 Google Maps-Integration
import journalRoutes from "./routes/journal.js"; // 📌 Zusätzliche Journal-Routen
import pollenRoutes from "./routes/pollen.js"; // 📌 Pollen-Daten
import scannerRoutes from "./routes/scanner.js"; // 📌 NEUE SCANNER-ROUTE

dotenv.config();

let example = express();
example.disable("x-powered-by");

app.use(express.json());  // 📌 JSON-Parsing muss aktiviert sein
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));

// API-Routen für verschiedene Funktionen
app.use("/appointments", appointmentRoutes);
app.use("/journal", allergyJournalRoutes);
app.use("/google-maps", googleMapsRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/journal", journalRoutes);
app.use("/pollen", pollenRoutes);
app.use("/scanner", scannerRoutes);  // 📌 NEUE SCANNER-ROUTE

// API-Routen für Profil und Authentifizierung
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);

// Testverbindung zur Datenbank
pool.getConnection()
    .then(conn => {
        console.log('✅ Erfolgreich mit MariaDB verbunden');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Fehler bei der Verbindung zur Datenbank:', err);
    });

// Standard-Route zur Prüfung der Backend-Verfügbarkeit
app.get('/', (req, res) => {
    res.send('✅ AllerCheck Backend läuft!');
});

export default app;


