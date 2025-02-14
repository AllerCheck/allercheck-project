import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🟢 Alle Journal-Einträge abrufen
router.get("/", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        const entries = await conn.query(
            "SELECT id, entry_date, nose, lungs, skin, eyes, notes FROM allergy_journal WHERE user_id = ?",
            [decoded.id]
        );
        conn.release();

        res.json(entries.length ? entries : []);
    } catch (error) {
        console.error("🔥 Fehler beim Abrufen der Journal-Einträge:", error);
        res.status(500).json({ message: "Fehler beim Abrufen der Journal-Einträge", error: error.message });
    }
});

// 🟢 Neuen Journal-Eintrag hinzufügen
router.post("/", async (req, res) => {
    try {
        console.log("📌 Request Headers:", req.headers);
        console.log("📌 Request Body:", req.body);

        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("📌 Decoded Token:", decoded);

        const { nose, lungs, skin, eyes, medication_taken, notes } = req.body;

        if (!nose && !lungs && !skin && !eyes) {
            return res.status(400).json({ message: "Mindestens eine Symptomangabe ist erforderlich!" });
        }

        const conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO allergy_journal (user_id, nose, lungs, skin, eyes, medication_taken, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [decoded.id, nose, lungs, skin, eyes, medication_taken, notes]
        );
        conn.release();

        res.json({ message: "Journal-Eintrag erfolgreich gespeichert" });
    } catch (error) {
        console.error("🔥 Fehler beim Speichern des Journal-Eintrags:", error);
        res.status(500).json({ message: "Fehler beim Speichern des Journal-Eintrags", error: error.message });
    }

    if (notes && notes.length > 500) {
        return res.status(400).json({ message: "Notiz darf maximal 500 Zeichen enthalten" });
    }
});

router.put("/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const { nose, lungs, skin, eyes, medication_taken, notes } = req.body;

        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        const result = await conn.query(
            "UPDATE allergy_journal SET nose = ?, lungs = ?, skin = ?, eyes = ?, medication_taken = ?, notes = ? WHERE id = ? AND user_id = ?",
            [nose, lungs, skin, eyes, medication_taken, notes, id, decoded.id]
        );
        conn.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Eintrag nicht gefunden oder keine Berechtigung zur Änderung" });
        }

        res.json({ message: "Journal-Eintrag erfolgreich aktualisiert" });
    } catch (error) {
        console.error("🔥 Fehler beim Aktualisieren des Journal-Eintrags:", error);
        res.status(500).json({ message: "Fehler beim Aktualisieren des Journal-Eintrags", error: error.message });
    }

    if (notes && notes.length > 500) {
        return res.status(400).json({ message: "Notiz darf maximal 500 Zeichen enthalten" });
    }
});

router.delete("/:id", async (req, res) => {  
    try {
        const { id } = req.params;

        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Kein Token vorhanden" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const conn = await pool.getConnection();
        const result = await conn.query(
            "DELETE FROM allergy_journal WHERE id = ? AND user_id = ?",
            [id, decoded.id]
        );
        conn.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Eintrag nicht gefunden oder keine Berechtigung zur Löschung" });
        }

        res.json({ message: "Journal-Eintrag erfolgreich gelöscht" });
    } catch (error) {
        console.error("🔥 Fehler beim Löschen des Journal-Eintrags:", error);
        res.status(500).json({ message: "Fehler beim Löschen des Journal-Eintrags", error: error.message });
    }
});

export default router;

