import React, { useState } from "react";

const AllergyJournal = ({ saveEntry }) => {
    const [formData, setFormData] = useState({
        nose: 0,
        lungs: 0,
        skin: 0,
        eyes: 0,
        medication_taken: false,
        notes: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveEntry(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Nase:</label>
            {[0, 1, 2, 3].map((val) => (
                <label key={val}>
                    <input type="radio" name="nose" value={val} onChange={handleChange} /> {val}
                </label>
            ))}

            <label>Lunge:</label>
            {[0, 1, 2, 3].map((val) => (
                <label key={val}>
                    <input type="radio" name="lungs" value={val} onChange={handleChange} /> {val}
                </label>
            ))}

            <label>Haut:</label>
            {[0, 1, 2, 3].map((val) => (
                <label key={val}>
                    <input type="radio" name="skin" value={val} onChange={handleChange} /> {val}
                </label>
            ))}

            <label>Augen:</label>
            {[0, 1, 2, 3].map((val) => (
                <label key={val}>
                    <input type="radio" name="eyes" value={val} onChange={handleChange} /> {val}
                </label>
            ))}

            <label>Medikament genommen:</label>
            <input type="checkbox" name="medication_taken" onChange={(e) => setFormData({ ...formData, medication_taken: e.target.checked })} />

            <label>Notizen:</label>
            <textarea name="notes" maxLength="500" onChange={handleChange} />

            <button type="submit">Speichern</button>
        </form>
    );
};

export default AllergyJournal;
