import React, { useState } from "react";
import "./Startbildschirm.css";
import startbild from "../assets/login-bg.png"; // dein neues Bild

function Startbildschirm({ onStart }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleStartClick = () => {
    if (name.trim() && code.trim()) {
      onStart(name.trim(), code.trim());
    }
  };

  return (
    <div
      className="startbild-container"
      style={{ backgroundImage: `url(${startbild})` }}
    >
      <div className="login-overlay">
        <input
          type="text"
          placeholder="Benutzer"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Raum"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button onClick={handleStartClick}>Anmelden</button>
      </div>
    </div>
  );
}

export default Startbildschirm;
