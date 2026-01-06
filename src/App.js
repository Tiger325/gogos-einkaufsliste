
import React, { useState, useEffect } from "react";
import Startbildschirm from "./components/Startbildschirm";
import ListeAnsicht from "./components/ListeAnsicht";
import "./index.css";

function App() {
  const [gestartet, setGestartet] = useState(false);
  const [nutzername, setNutzername] = useState(localStorage.getItem("nutzername") || "");
  const [familiencode, setFamiliencode] = useState(localStorage.getItem("familiencode") || "");

  useEffect(() => {
    if (nutzername && familiencode) {
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

  const handleBenutzerWechseln = () => {
    localStorage.removeItem("nutzername");
    setGestartet(false);
  };

  const handleRaumWechseln = () => {
    localStorage.removeItem("familiencode");
    setGestartet(false);
  };

  return (
    <>
      {gestartet ? (
        <ListeAnsicht
          nutzername={nutzername}
          familiencode={familiencode}
          onBenutzerWechseln={handleBenutzerWechseln}
          onRaumWechseln={handleRaumWechseln}
        />
      ) : (
        <Startbildschirm onStart={handleStart} />
      )}
    </>
  );
}

export default App;
