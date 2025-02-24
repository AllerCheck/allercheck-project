import { useState, useEffect } from "react";
import { BarcodeScanner } from 'react-barcode-scanner'
import { useNavigate } from "react-router-dom";

const ScannerPage = () => {
    const [scanResult, setScanResult] = useState("");
    const [productData, setProductData] = useState(null);
    const [scanCount, setScanCount] = useState(parseInt(localStorage.getItem("scanCount")) || 0);
    const [isRegistered] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!isRegistered && scanCount >= 5) {
            alert("Tageslimit erreicht! Bitte registriere dich für unbegrenzte Scans.");
            navigate("/register");
        }
    }, [scanCount, isRegistered, navigate]);

    const handleScan = async (result) => {
        if (!result || (scanCount >= 5 && !isRegistered)) return;

        setScanResult(result);
        fetch(`http://localhost:5000/scanner?barcode=${result}`)
            .then((response) => response.json())
            .then((data) => {
                setProductData(data);
                setScanCount(scanCount + 1);
                localStorage.setItem("scanCount", scanCount + 1);
            })
            .catch((error) => console.error("Fehler beim Abrufen:", error));
    };

    return (
        <div className="scanner-page">
            <h2>Scan your product here</h2>

            <div className="scanner-box">
                <BarcodeScanner
                    width={350}
                    height={250}
                    onUpdate={(err, result) => {
                        if (result) handleScan(result.text);
                    }}
                />
                <p>Scanne einen Barcode oder gib ihn manuell ein:</p>
                <input
                    type="text"
                    placeholder="Barcode eingeben"
                    onBlur={(e) => handleScan(e.target.value)}
                />
            </div>

            {scanResult && <p>Gescannt: {scanResult}</p>}

            {productData && (
                <div className="product-info">
                    <h3>{productData.product_name || "Unbekanntes Produkt"}</h3>
                    <img src={productData.image || ""} alt="Produktbild" />
                    <h4>Zutaten:</h4>
                    <p>{productData.ingredients || "Keine Zutaten gefunden"}</p>
                    <h4>Allergene:</h4>
                    <ul>
                        {productData.allergens?.length
                            ? productData.allergens.map((allergen, index) => <li key={index}>{allergen}</li>)
                            : ["Keine Allergene gefunden"]}
                    </ul>
                </div>
            )}

            {!isRegistered && scanCount >= 5 && (
                <div className="register-prompt">
                    <p>Du hast dein Tageslimit erreicht. Registriere dich für unbegrenzte Scans!</p>
                    <button onClick={() => navigate("/register")}>Jetzt registrieren</button>
                </div>
            )}
        </div>
    );
};

export default ScannerPage;
