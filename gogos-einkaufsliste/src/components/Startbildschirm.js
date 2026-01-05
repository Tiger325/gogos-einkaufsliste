
import React, { useState } from "react";
import "./Startbildschirm.css";

const Startbildschirm = ({ onStart }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="start-container">
      <img src="/startbild.png" alt="Startbild" className="startbild" />
      <div className="formular">
        <input type="text" placeholder="Dein Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Familiencode" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => onStart(name, code)}>Los geht's</button>
      </div>
    </div>
  );
};

export default Startbildschirm;
