import express from "express";
import pool from "../config/db.js";
import createCsvWriter from "csv-writer";
import PDFDocument from "pdfkit";

const router = express.Router();

// 🟢 GET: Alle Journal-Einträge für einen Zeitraum abrufen
router.get("/", async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ message: "User-ID, Start- und Enddatum erforderlich" });
    }

    try {
        const conn = await pool.getConnection();

        const result = await conn.query(
            `SELECT id, entry_date, nose, lungs, skin, eyes, medication_taken, notes
             FROM allergy_journal
             WHERE user_id = ? AND entry_date BETWEEN ? AND ?
             ORDER BY entry_date DESC`,
            [user_id, start_date, end_date]
        );

        conn.release();
        res.json(result);

    } catch (error) {
        console.error("🔥 Fehler beim Abrufen der Journal-Einträge:", error);
        res.status(500).json({ message: "Fehler beim Abrufen der Journal-Einträge", error: error.message });
    }
});

// 🟢 GET: Journal-Einträge als CSV exportieren
router.get("/export/csv", async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ message: "User-ID, Start- und Enddatum erforderlich" });
    }

    try {
        const conn = await pool.getConnection();

        const result = await conn.query(
            `SELECT id, entry_date, nose, lungs, skin, eyes, medication_taken, notes
             FROM allergy_journal
             WHERE user_id = ? AND entry_date BETWEEN ? AND ?
             ORDER BY entry_date DESC`,
            [user_id, start_date, end_date]
        );

        conn.release();

        if (result.length === 0) {
            return res.status(404).json({ message: "Keine Einträge für den Zeitraum gefunden" });
        }

        // CSV erstellen
        const csvWriter = createCsvWriter.createObjectCsvStringifier({
            header: [
                { id: "id", title: "ID" },
                { id: "entry_date", title: "Datum" },
                { id: "nose", title: "Nase" },
                { id: "lungs", title: "Lunge" },
                { id: "skin", title: "Haut" },
                { id: "eyes", title: "Augen" },
                { id: "medication_taken", title: "Medikament eingenommen" },
                { id: "notes", title: "Notizen" },
            ]
        });

        const csvContent = csvWriter.getHeaderString() + csvWriter.stringifyRecords(result);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=journal-entries.csv");
        res.send(csvContent);

    } catch (error) {
        console.error("🔥 Fehler beim CSV-Export:", error);
        res.status(500).json({ message: "Fehler beim Export", error: error.message });
    }
});

// 🟢 GET: Journal-Einträge als PDF exportieren
router.get("/export/pdf", async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ message: "User-ID, Start- und Enddatum erforderlich" });
    }

    try {
        const conn = await pool.getConnection();

        const result = await conn.query(
            `SELECT id, entry_date, nose, lungs, skin, eyes, medication_taken, notes
             FROM allergy_journal
             WHERE user_id = ? AND entry_date BETWEEN ? AND ?
             ORDER BY entry_date DESC`,
            [user_id, start_date, end_date]
        );

        conn.release();

        if (result.length === 0) {
            return res.status(404).json({ message: "Keine Einträge für den Zeitraum gefunden" });
        }

        // PDF generieren
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=journal-entries.pdf");
        doc.pipe(res);

        doc.fontSize(20).text("Journal-Einträge", { align: "center" });
        doc.moveDown();

        result.forEach(entry => {
            doc.fontSize(14).text(`Datum: ${entry.entry_date}`);
            doc.text(`Nase: ${entry.nose} | Lunge: ${entry.lungs} | Haut: ${entry.skin} | Augen: ${entry.eyes}`);
            doc.text(`Medikament eingenommen: ${entry.medication_taken ? "Ja" : "Nein"}`);
            if (entry.notes) doc.text(`Notizen: ${entry.notes}`);
            doc.moveDown();
        });

        doc.end();

    } catch (error) {
        console.error("🔥 Fehler beim PDF-Export:", error);
        res.status(500).json({ message: "Fehler beim PDF-Export", error: error.message });
    }
});

export default router;
