// src/components/Startbildschirm.js
import React, { useState } from "react";
import "../index.css";
import startbild from "../assets/startbild.png";

function Startbildschirm({ onStart }) {
  const [benutzername, setBenutzername] = useState("");
  const [familiencode, setFamiliencode] = useState("");
  const [liste, setListe] = useState("Haus");
  const [neueListe, setNeueListe] = useState("");
  const [eigeneListeAktiv, setEigeneListeAktiv] = useState(false);

  const handleStart = () => {
    const listenName = eigeneListeAktiv && neueListe ? neueListe : liste;
    if (!benutzername || !familiencode || !listenName) return;
    onStart({ benutzername, familiencode, listenName });
  };

  return (
    <div
      className="startbildschirm"
      style={{
        backgroundImage: `url(${startbild})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div className="startfeld">
        <input
          type="text"
          placeholder="Dein Name"
          value={benutzername}
          onChange={(e) => setBenutzername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Familiencode"
          value={familiencode}
          onChange={(e) => setFamiliencode(e.target.value)}
        />

        {!eigeneListeAktiv && (
          <select value={liste} onChange={(e) => setListe(e.target.value)}>
            <option value="Haus">Haus</option>
          </select>
        )}

        {eigeneListeAktiv && (
          <input
            type="text"
            placeholder="Neue Liste"
            value={neueListe}
            onChange={(e) => setNeueListe(e.target.value)}
          />
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={() => setEigeneListeAktiv(!eigeneListeAktiv)}>
            {eigeneListeAktiv ? "Abbrechen" : "+ Neue Liste"}
          </button>
          <button onClick={handleStart}>Los geht’s</button>
        </div>
      </div>
    </div>
  );
}

export default Startbildschirm;
