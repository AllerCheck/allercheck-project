import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// 🟢 Suche nach Allergie-Ärzten (Google Places API)
router.get("/places", async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "Standort fehlt" });

    const radius = 10000; // Suchradius auf 10 km erweitert
    const type = "doctor";
    const keyword = "allergy specialist";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ message: "Keine Allergie-Ärzte gefunden." });
        }
        res.json(data.results);
    } catch (error) {
        res.status(500).json({ message: "Fehler bei der Google API-Abfrage", error: error.message });
    }
});

export default router;
