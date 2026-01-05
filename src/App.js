
import React, { useState } from "react";
import Startbildschirm from "./components/Startbildschirm";
import ListeAnsicht from "./components/ListeAnsicht";
import "./index.css";

function App() {
  const [gestartet, setGestartet] = useState(false);
  return gestartet ? (
    <ListeAnsicht />
  ) : (
    <Startbildschirm onContinue={() => setGestartet(true)} />
  );
}

export default App;
