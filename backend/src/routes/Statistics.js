import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { createObjectCsvWriter } from "csv-writer";
import pdf from "pdfkit";
import fs from "fs";

const router = express.Router();

// 🟠 Statistik abrufen
router.get("/journal/stats", async (req, res) => {
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

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Statistik", error: error.message });
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

