import React, { useState } from "react";
import "./App.css";

function App() {
  const [aktuellesBild, setAktuellesBild] = useState(true); // true = Startbild
  const [listen, setListen] = useState([{ name: "Haus", artikel: [] }]);
  const [aktiveListeIndex, setAktiveListeIndex] = useState(0);
  const [neuerArtikel, setNeuerArtikel] = useState("");
  const [neueListeName, setNeueListeName] = useState("");

  const zumNotizbuch = () => {
    setAktuellesBild(false);
  };

  const artikelHinzufuegen = () => {
    if (neuerArtikel.trim() === "") return;
    const neueListen = [...listen];
    neueListen[aktiveListeIndex].artikel.push(neuerArtikel.trim());
    setListen(neueListen);
    setNeuerArtikel("");
  };

  const artikelEntfernen = (index) => {
    const neueListen = [...listen];
    neueListen[aktiveListeIndex].artikel.splice(index, 1);
    setListen(neueListen);
  };

  const neueListeHinzufuegen = () => {
    if (neueListeName.trim() === "") return;
    setListen([...listen, { name: neueListeName.trim(), artikel: [] }]);
    setNeueListeName("");
  };

  return (
    <div className="App">
      {aktuellesBild ? (
        <div className="startbild-container" onClick={zumNotizbuch}>
          <img src="/startbild.png" alt="Startbild" className="startbild" />
        </div>
      ) : (
        <div className="notizbuch-container">
          <div className="listen-tabs">
            {listen.map((liste, index) => (
              <button
                key={index}
                className={index === aktiveListeIndex ? "active-tab" : ""}
                onClick={() => setAktiveListeIndex(index)}
              >
                {liste.name}
              </button>
            ))}
            <input
              type="text"
              placeholder="Neue Liste"
              value={neueListeName}
              onChange={(e) => setNeueListeName(e.target.value)}
            />
            <button onClick={neueListeHinzufuegen}>+</button>
          </div>

          <div className="artikel-liste">
            {listen[aktiveListeIndex].artikel.map((artikel, index) => (
              <div key={index} className="artikel-eintrag">
                <span>{artikel}</span>
                <button onClick={() => artikelEntfernen(index)}>🗑️</button>
              </div>
            ))}
          </div>

          <div className="eingabe-bereich">
            <input
              type="text"
              placeholder="Neuer Artikel"
              value={neuerArtikel}
              onChange={(e) => setNeuerArtikel(e.target.value)}
            />
            <button onClick={artikelHinzufuegen}>Hinzufügen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
