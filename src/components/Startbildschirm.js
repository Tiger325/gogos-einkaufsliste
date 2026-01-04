// src/components/Startbildschirm.js
import React, { useState } from "react";
import "../index.css";

function Startbildschirm({ onContinue }) {
  const [benutzername, setBenutzername] = useState("");
  const [familiencode, setFamiliencode] = useState("");
  const [listeName, setListeName] = useState("Haus");

  const handleStart = () => {
    if (benutzername && familiencode) {
      localStorage.setItem("benutzername", benutzername);
      localStorage.setItem("familiencode", familiencode);
      localStorage.setItem("liste", listeName);
      onContinue();
    } else {
      alert("Bitte Name und Familiencode eingeben");
    }
  };

  return (
    <div
      className="startbildschirm"
      style={{
        backgroundImage: "url('/startbild.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <input
        type="text"
        placeholder="Dein Name"
        value={benutzername}
        onChange={(e) => setBenutzername(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Familiencode"
        value={familiencode}
        onChange={(e) => setFamiliencode(e.target.value)}
        className="input"
      />

      <button className="button" onClick={handleStart}>
        Haus
      </button>

      <input
        type="text"
        placeholder="+ Neue Liste (optional)"
        value={listeName}
        onChange={(e) => setListeName(e.target.value)}
        className="input"
      />
    </div>
  );
}

export default Startbildschirm;
