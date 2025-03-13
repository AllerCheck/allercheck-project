import express from "express";
import pool from "../config/db.js";
import createCsvWriter from "csv-writer";


const router = express.Router();

// Get Journal Entries
router.get("/", async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ message: "User-ID, Start- und Enddatum erforderlich" });
    }

    try {
        const conn = await pool.getConnection();
        const result = await conn.query(
            `SELECT * FROM allergy_journal WHERE user_id = ? AND entry_date BETWEEN ? AND ? ORDER BY entry_date DESC`,
            [user_id, start_date, end_date]
        );

        conn.release();
        res.json(result);
    } catch (error) {
        console.error("Fehler beim Abrufen der Journal-Einträge:", error);
        res.status(500).json({ message: "Fehler beim Abrufen", error: error.message });
    }
});

// Export as CSV
router.get("/export/csv", async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    try {
        const conn = await pool.getConnection();
        const result = await conn.query(
            `SELECT * FROM allergy_journal WHERE user_id = ? AND entry_date BETWEEN ? AND ? ORDER BY entry_date DESC`,
            [user_id, start_date, end_date]
        );
        conn.release();

        if (result.length === 0) return res.status(404).json({ message: "Keine Einträge gefunden" });

        const csvWriter = createCsvWriter.createObjectCsvStringifier({ header: Object.keys(result[0]).map(key => ({ id: key, title: key })) });
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=journal.csv");
        res.send(csvWriter.getHeaderString() + csvWriter.stringifyRecords(result));
    } catch (error) {
        console.error("Fehler beim CSV-Export:", error);
        res.status(500).json({ message: "Fehler beim Export", error: error.message });
    }
});

// Export as PDF
router.get("/export/pdf", async (req, res) => {
    // Same logic, but use PDFDocument
});

export default router;
