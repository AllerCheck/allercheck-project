import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 🟢 GET: Barcode-Daten abrufen
router.get("/", async (req, res) => {
    const barcode = req.query.barcode;
    if (!barcode) return res.status(400).json({ error: "Kein Barcode angegeben" });

    try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const product = response.data.product;

        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json({
            product_brand: product.brands || "Unknown Brand",
            product_name: product.product_name || "Unknown Product",
            ingredients: product.ingredients_text || "No Ingredients found",
            allergens: product.allergens_tags ? product.allergens_tags : ["No allergies found"],
            image: product.image_url || null,
        });

    } catch (error) {
        console.error("🔥 Fehler beim Abrufen des Barcodes:", error.message);
        res.status(500).json({ error: "Fehler beim Abrufen der Barcode-Daten" });
    }
});

export default router;
