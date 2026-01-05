
import React, { useState } from "react";
import Startbildschirm from "./components/Startbildschirm";
import ListeAnsicht from "./components/ListeAnsicht";
import "./index.css";

function App() {
  const [gestartet, setGestartet] = useState(false);
  const [nutzername, setNutzername] = useState(localStorage.getItem("nutzername") || "");
  const [familiencode, setFamiliencode] = useState(localStorage.getItem("familiencode") || "");

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
        <ListeAnsicht nutzername={nutzername} familiencode={familiencode} setNutzername={setNutzername} />
      ) : (
        <Startbildschirm onStart={handleStart} />
      )}
    </>
  );
}

export default App;
