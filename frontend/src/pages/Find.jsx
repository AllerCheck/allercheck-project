import { useState, useEffect } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

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
        <div className="flex flex-col items-center py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
            <h2 className="p-2 mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl">
                Allergy Doctors
            </h2>

            <div id="map" style={{ width: "51%", height: "500px" }} className="mb-8 rounded-md"></div>

            <div className="max-w-5xl min-w-96 mx-auto p-6 bg-white shadow-lg rounded-lg">
                <ul>
                    {doctors.map((doctor, index) => (
                        <li key={index} className="mb-4 p-4 bg-gray-100 shadow rounded-md">
                            <strong className="text-xl">{doctor.name}</strong>
                            <p>{doctor.vicinity}</p>
                            <p>Opening Hours: {doctor.opening_hours ? "Geöffnet" : "Geschlossen"}</p>
                            <p>Rating: {doctor.rating} / 5</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.geometry.location.lat},${doctor.geometry.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Route anzeigen
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FindDoctor;
