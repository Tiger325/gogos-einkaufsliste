// src/App.js
import React, { useState } from "react";
import Startbildschirm from "./components/Startbildschirm";
import ListeAnsicht from "./components/ListeAnsicht";
import "./index.css";

function App() {
  const [gestartet, setGestartet] = useState(false);
  const [benutzername, setBenutzername] = useState("");
  const [familiencode, setFamiliencode] = useState("");
  const [listeName, setListeName] = useState("Haus");

  return (
    <>
      {gestartet ? (
        <ListeAnsicht
          benutzername={benutzername}
          familiencode={familiencode}
          listeName={listeName}
        />
      ) : (
        <Startbildschirm
          onContinue={(name, code, liste) => {
            setBenutzername(name);
            setFamiliencode(code);
            setListeName(liste);
            setGestartet(true);
          }}
        />
      )}
    </>
  );
}

export default App;
