
import React, { useState } from "react";
import "./Startbildschirm.css";

function Startbildschirm({ onContinue }) {
  const [name, setName] = useState(localStorage.getItem("benutzername") || "");
  const [code, setCode] = useState(localStorage.getItem("familiencode") || "");
  const [liste, setListe] = useState("Haus");

  const speichernUndWeiter = () => {
    if (name.length > 1 && code.length > 1) {
      localStorage.setItem("benutzername", name);
      localStorage.setItem("familiencode", code);
      localStorage.setItem("liste", liste);
      onContinue();
    } else {
      alert("Bitte Namen und Familiencode eingeben");
    }
  };

  return (
    <div className="startbildschirm">
      <img src="/startbild.png" alt="Startbild" className="startbild" />
      <div className="eingabe-box">
        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Familiencode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Listenname z. B. Haus"
          value={liste}
          onChange={(e) => setListe(e.target.value)}
        />
        <button onClick={speichernUndWeiter}>Weiter</button>
      </div>
    </div>
  );
}

export default Startbildschirm;
