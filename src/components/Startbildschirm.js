import React, { useState } from "react";
import "./Startbildschirm.css";

function Startbildschirm({ onContinue }) {
  const [benutzername, setBenutzername] = useState("");
  const [familiencode, setFamiliencode] = useState("");
  const [listenname, setListenname] = useState("Haus");

  const handleStart = () => {
    if (!benutzername || !familiencode || !listenname) return;
    localStorage.setItem("benutzername", benutzername);
    localStorage.setItem("familiencode", familiencode);
    localStorage.setItem("listenname", listenname);
    onContinue(); // geht zu ListeAnsicht
  };

  return (
    <div className="startbildschirm" style={{ backgroundImage: "url('/startbild.png')" }}>
      <div className="eingabemaske">
        <input
          type="text"
          placeholder="Name eingeben"
          value={benutzername}
          onChange={(e) => setBenutzername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Familiencode"
          value={familiencode}
          onChange={(e) => setFamiliencode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Listenname (z. B. Haus)"
          value={listenname}
          onChange={(e) => setListenname(e.target.value)}
        />
        <button onClick={handleStart}>Los geht’s!</button>
      </div>
    </div>
  );
}

export default Startbildschirm;