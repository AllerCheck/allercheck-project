import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 🟢 GET: Pollen-Vorhersage über Google Places API abrufen
router.get("/", async (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const location = req.query.location;

    if (!location) {
        return res.status(400).json({ error: "Fehlender Standort-Parameter (location erforderlich)." });
    }

    try {
        // 🌍 1️⃣ Standort in Koordinaten umwandeln (Google Geocoding API)
        console.log(`📌 Anfrage an Google Geocoding API: Standort = ${location}`);
        const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: location,
                key: apiKey
            }
        });

        if (geoResponse.data.status !== "OK") {
            throw new Error(`Geocoding fehlgeschlagen: ${geoResponse.data.status}`);
        }

        const { lat, lng } = geoResponse.data.results[0].geometry.location;
        console.log(`📌 Koordinaten gefunden: latitude = ${lat}, longitude = ${lng}`);

        // 🌿 2️⃣ Pollen-Informationen abrufen (Google Places API)
        console.log(`🌍 Anfrage an Google Places API für Pollen-Informationen nahe ${lat}, ${lng}`);
        const placesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: 50000,  // Suche in einem Umkreis von 50 km
                keyword: "allergy pollen",
                key: apiKey
            }
        });

        console.log(`✅ Erfolgreiche Antwort von der Google Places API`, placesResponse.data);
        res.json(placesResponse.data);

    } catch (error) {
        console.error("🔥 Fehler beim Abrufen der Pollen-Daten:", error.response?.data || error.message);
        res.status(500).json({ error: "Fehler beim Abrufen der Pollen-Daten", details: error.response?.data || error.message });
    }
});

export default router;



