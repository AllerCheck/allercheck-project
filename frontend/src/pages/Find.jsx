import { useState, useEffect } from "react";
import NavigationButtons from "../components/NavigationButtons";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY);


const FindDoctor = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY); // Debugging

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    fetchDoctors(position.coords.latitude, position.coords.longitude);
                },
                (error) => console.error("Fehler beim Abrufen des Standorts:", error),
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation wird nicht unterstützt.");
        }
    }, []);

    const fetchDoctors = async (lat, lng) => {
        try {
            const response = await fetch(`http://localhost:5000/google-maps/places?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error("Fehler beim Abrufen der Ärzte:", error);
        }
    };

    useEffect(() => {
        if (userLocation && !mapLoaded && GOOGLE_MAPS_API_KEY) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => setMapLoaded(true);
            document.body.appendChild(script);
        } else if (!GOOGLE_MAPS_API_KEY) {
            console.error("Google Maps API key is missing.");
        }
    }, [userLocation, mapLoaded]);

    useEffect(() => {
        if (mapLoaded && userLocation) {
            if (window.google) {
                const map = new window.google.maps.Map(document.getElementById("map"), {
                    center: userLocation,
                    zoom: 12,
                });

                new window.google.maps.Marker({
                    position: userLocation,
                    map,
                    title: "Ihr Standort",
                });

                doctors.forEach((doctor) => {
                    new window.google.maps.Marker({
                        position: { lat: doctor.geometry.location.lat, lng: doctor.geometry.location.lng },
                        map,
                        title: doctor.name,
                    });
                });
            }
        }
    }, [mapLoaded, userLocation, doctors]);

    return (
        <div className="flex flex-col items-center py-10">
            {/* <NavigationButtons /> */}
            <h2 className="text-2xl font-semibold text-center mb-4">Allergy Doctors nearby</h2>
            <div id="map" style={{ width: "100%", height: "500px" }}></div>
            <ul className="mt-4">
                {doctors.map((doctor, index) => (
                    <li key={index} className="border p-2 m-2">
                        <strong>{doctor.name}</strong>
                        <p>{doctor.vicinity}</p>
                        <p>Opening Hours: {doctor.opening_hours ? "Geöffnet" : "Geschlossen"}</p>
                        <p>Rating: {doctor.rating} / 5</p>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.geometry.location.lat},${doctor.geometry.location.lng}`} target="_blank" rel="noopener noreferrer">Route anzeigen</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FindDoctor;
