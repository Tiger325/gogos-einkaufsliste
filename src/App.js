// src/App.js
import React, { useState } from "react";
import Startbildschirm from "./components/Startbildschirm";
import ListeAnsicht from "./components/ListeAnsicht";
import "./index.css";

function App() {
  const [gestartet, setGestartet] = useState(false);
  const [benutzername, setBenutzername] = useState("");
  const [familiencode, setFamiliencode] = useState("");
  const [liste, setListe] = useState("Haus");

  const handleStart = (name, code, listentitel) => {
    setBenutzername(name);
    setFamiliencode(code);
    setListe(listentitel || "Haus");
    setGestartet(true);
  };

  return (
    <>
      {gestartet ? (
        <ListeAnsicht
          benutzername={benutzername}
          familiencode={familiencode}
          liste={liste}
        />
      ) : (
        <Startbildschirm onStart={handleStart} />
      )}
    </>
  );
}

export default App;
