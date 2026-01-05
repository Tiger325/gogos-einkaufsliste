
import React, { useState, useEffect } from "react";
import "./ListeAnsicht.css";

function ListeAnsicht({ nutzername, familiencode, setNutzername }) {
  const [artikel, setArtikel] = useState([]);
  const [neuerArtikel, setNeuerArtikel] = useState("");

  const addArtikel = () => {
    if (neuerArtikel.trim() !== "") {
      setArtikel([...artikel, { text: neuerArtikel, autor: nutzername }]);
      setNeuerArtikel("");
    }
  };

  const benutzerWechseln = () => {
    const neuerName = prompt("Neuen Benutzernamen eingeben:");
    if (neuerName) {
      setNutzername(neuerName);
      localStorage.setItem("nutzername", neuerName);
    }
  };

  return (
    <div className="liste-container">
      <div className="hintergrund-notizbuch">
        <h2>Liste: Haus</h2>
        <p>Eingeloggt als: {nutzername}</p>
        <button onClick={benutzerWechseln}>Benutzernamen wechseln</button>
        <input
          value={neuerArtikel}
          onChange={(e) => setNeuerArtikel(e.target.value)}
          placeholder="Neuen Artikel hinzufügen"
        />
        <button onClick={addArtikel}>Hinzufügen</button>
        <ul>
          {artikel.map((item, index) => (
            <li key={index}>
              {item.text} <small>({item.autor})</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListeAnsicht;
