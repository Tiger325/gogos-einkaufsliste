
import React, { useState, useEffect } from "react";
import Startbildschirm from "./components/Startbildschirm";
import ListeAnsicht from "./components/ListeAnsicht";
import "./index.css";

function App() {
  const [gestartet, setGestartet] = useState(false);
  const [nutzername, setNutzername] = useState("");
  const [familiencode, setFamiliencode] = useState("");

  useEffect(() => {
    const gespeicherterName = localStorage.getItem("nutzername");
    const gespeicherterCode = localStorage.getItem("familiencode");
    if (gespeicherterName && gespeicherterCode) {
      setNutzername(gespeicherterName);
      setFamiliencode(gespeicherterCode);
      setGestartet(true);
    }
  }, []);

  const handleStart = (name, code) => {
    setNutzername(name);
    setFamiliencode(code);
    localStorage.setItem("nutzername", name);
    localStorage.setItem("familiencode", code);
    setGestartet(true);
  };

  return (
    <>
      {gestartet ? (
        <ListeAnsicht nutzername={nutzername} familiencode={familiencode} />
      ) : (
        <Startbildschirm onStart={handleStart} />
      )}
    </>
  );
}

export default App;
