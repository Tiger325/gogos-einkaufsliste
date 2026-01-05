import React, { useState } from "react";

function Startbildschirm({ onStart }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleClick = () => {
    if (name.trim() && code.trim()) {
      onStart(name, code);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Willkommen zur Einkaufsliste</h2>
      <input
        type="text"
        placeholder="Dein Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: 10 }}
      />
      <input
        type="text"
        placeholder="Familiencode"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ margin: 10 }}
      />
      <button onClick={handleClick}>Weiter</button>
    </div>
  );
}

export default Startbildschirm;