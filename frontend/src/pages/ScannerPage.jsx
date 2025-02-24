import { useState, useEffect } from "react";
import { BarcodeScanner } from 'react-barcode-scanner';
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Scan the barcode here</h2>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center">
                    <BarcodeScanner
                        width={350}
                        height={250}
                        onUpdate={(err, result) => {
                            if (result) handleScan(result.text);
                        }}
                    />
                    <p className="mt-4 text-gray-600">Scan the barcode or type the code:</p>
                    <input
                        type="text"
                        placeholder="enter the barcode"
                        className="mt-2 w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onBlur={(e) => handleScan(e.target.value)}
                    />
                </div>
            </div>

            {scanResult && <p className="mt-4 text-lg font-semibold text-gray-700">Scanned: {scanResult}</p>}

            {productData && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                    <h3 className="text-xl font-bold text-gray-800">{productData.product_name || "Unknown Product"}</h3>
                    {productData.image && <img src={productData.image} alt="Produktbild" className="mt-4 w-40 mx-auto rounded" />}
                    <h4 className="mt-4 font-semibold text-gray-700">Ingredients:</h4>
                    <p className="text-gray-600">{productData.ingredients || "No ingredients found"}</p>
                    <h4 className="mt-4 font-semibold text-gray-700">Allergies:</h4>
                    <ul className="text-gray-600">
                        {productData.allergens?.length
                            ? productData.allergens.map((allergen, index) => <li key={index} className="text-sm">{allergen}</li>)
                            : <li className="text-sm">No Allergies found in this product</li>}
                    </ul>
                </div>
            )}

            {!isRegistered && scanCount >= 5 && (
                <div className="mt-6 bg-red-100 border border-red-400 text-red-700 p-4 rounded w-full max-w-md text-center">
                    <p>Du hast dein Tageslimit erreicht. Registriere dich für unbegrenzte Scans!</p>
                    <button onClick={() => navigate("/register")} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Jetzt registrieren</button>
                </div>
            )}
        </div>
    );
};

export default ScannerPage;
