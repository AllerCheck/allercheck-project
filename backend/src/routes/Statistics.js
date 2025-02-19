import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { createObjectCsvWriter } from "csv-writer";
import pdf from "pdfkit";
import fs from "fs";

const router = express.Router();


// 🟢 GET: Statistik für einen User & Zeitraum abrufen
router.get("/", async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ message: "User-ID, Start- und Enddatum erforderlich" });
    }

    try {
        const conn = await pool.getConnection();

        const result = await conn.query(
            `SELECT COUNT(*) as total_entries, 
                    IFNULL(AVG(nose), 0) as avg_nose, 
                    IFNULL(AVG(lungs), 0) as avg_lungs, 
                    IFNULL(AVG(skin), 0) as avg_skin, 
                    IFNULL(AVG(eyes), 0) as avg_eyes, 
                    IFNULL(SUM(medication_taken), 0) as total_medications
             FROM allergy_journal 
             WHERE user_id = ? AND entry_date BETWEEN ? AND ?`,
            [user_id, start_date, end_date]
        );

        conn.release();

        // 🔥 Lösung für `BigInt` Problem: Alle Werte in `Number` konvertieren
        const formattedResult = {
            total_entries: Number(result[0].total_entries),
            avg_nose: Number(result[0].avg_nose),
            avg_lungs: Number(result[0].avg_lungs),
            avg_skin: Number(result[0].avg_skin),
            avg_eyes: Number(result[0].avg_eyes),
            total_medications: Number(result[0].total_medications),
        };

        res.json(formattedResult);

    } catch (error) {
        console.error("🔥 Fehler beim Abrufen der Statistik:", error);
        res.status(500).json({ message: "Fehler bei der Statistik-Abfrage", error: error.message });
    }
});

// 🟠 Statistik als CSV exportieren
router.get("/journal/stats/export/csv", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { startDate, endDate } = req.query;

        const conn = await pool.getConnection();
        const stats = await conn.query(
            "SELECT entry_date, nose, lungs, skin, eyes, medication_taken FROM allergy_journal WHERE user_id = ? AND entry_date BETWEEN ? AND ?",
            [decoded.id, startDate, endDate]
        );
        conn.release();

        const csvWriter = createObjectCsvWriter({
            path: "allergy_stats.csv",
            header: [
                { id: "entry_date", title: "Datum" },
                { id: "nose", title: "Nase" },
                { id: "lungs", title: "Lunge" },
                { id: "skin", title: "Haut" },
                { id: "eyes", title: "Augen" },
                { id: "medication_taken", title: "Medikament genommen" }
            ]
        });

        await csvWriter.writeRecords(stats);
        res.download("allergy_stats.csv");
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Exportieren als CSV", error: error.message });
    }
});

// 🟠 Statistik als PDF exportieren
router.get("/journal/stats/export/pdf", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { startDate, endDate } = req.query;

        const conn = await pool.getConnection();
        const stats = await conn.query(
            "SELECT entry_date, nose, lungs, skin, eyes, medication_taken FROM allergy_journal WHERE user_id = ? AND entry_date BETWEEN ? AND ?",
            [decoded.id, startDate, endDate]
        );
        conn.release();

        const doc = new pdf();
        const fileName = "allergy_stats.pdf";
        doc.pipe(fs.createWriteStream(fileName));

        doc.fontSize(16).text("Allergie-Statistik", { align: "center" });
        stats.forEach((entry) => {
            doc.text(`Datum: ${entry.entry_date}, Nase: ${entry.nose}, Lunge: ${entry.lungs}, Haut: ${entry.skin}, Augen: ${entry.eyes}, Medikament genommen: ${entry.medication_taken ? "Ja" : "Nein"}`);
        });

        doc.end();
        res.download(fileName);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Exportieren als PDF", error: error.message });
    }
});

export default router;

