import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
// GET: Pollen-Vorhersage über Google Places API und Pollen API abrufen
console.log("apiKey:", apiKey);
router.get("/", async (req, res) => {
    const location = req.query.location;
    if (!location) {
        return res.status(400).json({ error: "Fehlender Standort-Parameter (location erforderlich)." });
    }
    try {
        // Standort in Koordinaten umwandeln (Google Geocoding API)
        console.log(` Anfrage an Google Geocoding API: Standort = ${location}`);
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
        console.log(` Koordinaten gefunden: latitude = ${lat}, longitude = ${lng}`);
        // Pollen API mit Query-Parametern (wie in curl-Beispiel)
        console.log(" Anfrage an Google Pollen API");
        const pollenResponse = await axios.get('https://pollen.googleapis.com/v1/forecast:lookup', {
            params: {
                'location.latitude': lat,
                'location.longitude': lng,
                key: apiKey,
                days: 1,
            },
           
        });
        console.log(` Erfolgreiche Antwort von der Google Pollen API`);
        console.log("Pollendaten:", pollenResponse.data);
        res.json(pollenResponse.data);
        
    } catch (error) {
        console.error(" Fehler beim Abrufen der Pollen-Daten:", error.response?.data || error.message);
        res.status(500).json({
            error: "Fehler beim Abrufen der Pollen-Daten",
            details: error.response?.data || error.message
        });
    }
});
export default router;