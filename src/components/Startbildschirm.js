
import React, { useState } from "react";
import "./Startbildschirm.css";

function Startbildschirm({ onStart }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="startbildschirm">
      <h1>Gogos Einkaufsliste</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Familiencode" value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={() => onStart(name, code)}>Starten</button>
    </div>
  );
}

export default Startbildschirm;
