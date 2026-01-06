
import React, { useState } from "react";
import "./Startbildschirm.css";

function Startbildschirm({ onStart }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleStartClick = () => {
    if (name && code) {
      onStart(name, code);
    }
  };

  return (
    <div className="startbild-container">
      <img src="/startbild.png" alt="Start" className="startbild" />
      <div className="start-eingabe">
        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Listenname"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleStartClick}>Start</button>
      </div>
    </div>
  );
}

export default Startbildschirm;
