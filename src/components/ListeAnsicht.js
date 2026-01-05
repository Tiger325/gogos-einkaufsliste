import React, { useState, useEffect } from "react";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import "./ListeAnsicht.css";

function ListeAnsicht() {
  const [artikel, setArtikel] = useState([]);
  const [neuerArtikel, setNeuerArtikel] = useState("");

  const benutzername = localStorage.getItem("benutzername") || "Unbekannt";
  const listenname = localStorage.getItem("listenname") || "Haus";

  const artikelHinzufuegen = () => {
    if (neuerArtikel.trim() === "") return;
    setArtikel([...artikel, { text: neuerArtikel, autor: benutzername }]);
    setNeuerArtikel("");
  };

  const artikelEntfernen = (index) => {
    const neueListe = [...artikel];
    neueListe.splice(index, 1);
    setArtikel(neueListe);
  };

  return (
    <div className="liste-container">
      <h2 className="listenname">{listenname}</h2>
      <ul className="artikel-liste">
        {artikel.map((eintrag, index) => (
          <li key={index}>
            <span className="artikeltext">{eintrag.text}</span>
            <span className="autor">({eintrag.autor})</span>
            <button onClick={() => artikelEntfernen(index)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
      <div className="eingabe-zeile">
        <input
          type="text"
          placeholder="Artikel hinzufügen"
          value={neuerArtikel}
          onChange={(e) => setNeuerArtikel(e.target.value)}
        />
        <button onClick={artikelHinzufuegen}>Hinzufügen</button>
        <button title="Spracheingabe"><FaMicrophone /></button>
        <button title="Bild-Scan"><FaCamera /></button>
      </div>
    </div>
  );
}

export default ListeAnsicht;
