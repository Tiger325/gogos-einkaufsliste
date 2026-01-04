// src/components/Startbildschirm.js

import React, { useState } from "react";
import "./Startbildschirm.css";

function Startbildschirm({ onContinue }) {
  const [name, setName] = useState("");
  const [familienCode, setFamilienCode] = useState("");

  const handleStart = () => {
    if (name && familienCode) {
      localStorage.setItem("benutzerName", name);
      localStorage.setItem("familienCode", familienCode);
      onContinue();
    }
  };

  return (
    <div className="startbild-container">
      <img src="/startbild.png" alt="Startbildschirm" className="startbild" />
      <div className="start-eingabe">
        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Familiencode"
          value={familienCode}
          onChange={(e) => setFamilienCode(e.target.value)}
        />
        <button onClick={handleStart}>Haus</button>
      </div>
    </div>
  );
}

export default Startbildschirm;
