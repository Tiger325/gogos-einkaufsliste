// Projektstruktur wird gleich erklärt. Hier kommt zuerst die Hauptkomponentenübersicht.

// Ordnerstruktur deiner App (React + Firebase):

// gogos-einkaufsliste/
// ├── public/
// │   └── startbild.png              <-- Dein Startbild
// ├── src/
// │   ├── components/
// │   │   ├── Startseite.js          <-- Startbildschirm mit Login und Listenwahl
// │   │   └── ListeAnsicht.js        <-- Die eigentliche Liste im Notizbuch-Stil
// │   ├── App.js
// │   ├── index.js
// │   ├── firebaseConfig.js          <-- Deine Firebase Konfiguration
// │   └── App.css                    <-- Globale Styles inkl. Hintergrund
// ├── package.json
// └── ... weitere Dateien


// ==== src/components/Startseite.js ====

import ListeAnsicht from "./ListeAnsicht";
import "../App.css";

const Startseite = () => {
  const [name, setName] = useState("");
  const [familiencode, setFamiliencode] = useState("");
  const [liste, setListe] = useState(null);
  const [neueListeName, setNeueListeName] = useState("");

  const weiterZurListe = (zielListe) => {
    if (name.trim() && familiencode.trim()) {
      localStorage.setItem("benutzername", name);
      localStorage.setItem("familiencode", familiencode);
      setListe(zielListe);
    } else {
      alert("Bitte Name und Familiencode eingeben");
    }
  };

  if (liste) {
    return <ListeAnsicht listeName={liste} />;
  }

  return (
    <div className="startbildschirm">
      <div className="overlay">
        <h1 className="logo">Gogos Einkaufsliste</h1>

        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="eingabe"
        />
        <input
          type="text"
          placeholder="Familiencode"
          value={familiencode}
          onChange={(e) => setFamiliencode(e.target.value)}
          className="eingabe"
        />

        <button className="anmelden-button" onClick={() => weiterZurListe("Haus")}>
          Haus
        </button>

        <input
          type="text"
          placeholder="Neue Liste benennen"
          value={neueListeName}
          onChange={(e) => setNeueListeName(e.target.value)}
          className="eingabe"
        />

        <button
          className="anmelden-button"
          onClick={() => {
            if (neueListeName.trim()) weiterZurListe(neueListeName);
          }}
        >
          + Neue Liste
        </button>
      </div>
    </div>
  );
};

export default Startseite;


// ==== src/components/ListeAnsicht.js ====
import React, { useEffect, useState } from "react";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../App.css";

const ListeAnsicht = ({ listeName }) => {
  const [artikel, setArtikel] = useState([]);
  const [neuerArtikel, setNeuerArtikel] = useState("");
  const name = localStorage.getItem("benutzername") || "Unbekannt";
  const familiencode = localStorage.getItem("familiencode") || "demo";

  const pfad = `${familiencode}/${listeName}`;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, pfad), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArtikel(items);
    });
    return () => unsub();
  }, [pfad]);

  const hinzufuegen = async () => {
    if (!neuerArtikel.trim()) return;
    await addDoc(collection(db, pfad), {
      text: neuerArtikel,
      autor: name,
      timestamp: Date.now(),
    });
    setNeuerArtikel("");
  };

  const entfernen = async (id) => {
    await deleteDoc(doc(db, pfad, id));
  };

  return (
    <div className="notiz-seite">
      <div className="eingabe-zone">
        <input
          type="text"
          value={neuerArtikel}
          onChange={(e) => setNeuerArtikel(e.target.value)}
          placeholder="Artikel hinzufügen"
        />
        <button onClick={hinzufuegen}>Hinzufügen</button>
        <FaMicrophone className="symbol" title="Spracheingabe (später)" />
        <FaCamera className="symbol" title="Foto aufnehmen (später)" />
      </div>

      <ul className="liste">
        {artikel.map((eintrag) => (
          <li key={eintrag.id}>
            <span className="eintrag-text">{eintrag.text}</span>
            <span className="autor-name">({eintrag.autor})</span>
            <FaTrash onClick={() => entfernen(eintrag.id)} className="symbol" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeAnsicht;


// ==== src/App.js ====
import React from "react";
import Startseite from "./components/Startseite";

function App() {
  return <Startseite />;
}

export default App;


// ==== src/firebaseConfig.js ====
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_AUTH_DOMAIN",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_STORAGE_BUCKET",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };


// ==== src/App.css ====
body {
  margin: 0;
  font-family: sans-serif;
}

.startbildschirm {
  height: 100vh;
  background-image: url("../public/startbild.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
}

.eingabe {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 80%;
  font-size: 16px;
}

.anmelden-button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 8px;
}

.notiz-seite {
  background-image: url("../public/notizbuch.png");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding: 20px;
}

.eingabe-zone input {
  width: 60%;
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
}

.eingabe-zone button {
  padding: 10px;
}

.symbol {
  margin-left: 10px;
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
}

.liste {
  list-style: none;
  padding: 0;
}

.liste li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  margin: 5px 0;
  padding: 10px;
  border-radius: 8px;
}

.eintrag-text {
  flex: 1;
  text-align: center;
}

.autor-name {
  font-size: 12px;
  color: gray;
  margin-right: 10px;
}

