// Gogos Einkaufsliste - mit Spracherkennung (Web Speech API)

import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [familiencode, setFamiliencode] = useState(() => {
    return localStorage.getItem("familiencode") || "";
  });
  const [codeGesetzt, setCodeGesetzt] = useState(!!familiencode);
  const [artikel, setArtikel] = useState([]);
  const [eingabe, setEingabe] = useState("");

  useEffect(() => {
    if (!familiencode) return;
    const unsub = onSnapshot(
      collection(db, "listen", familiencode, "artikel"),
      (snapshot) => {
        setArtikel(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsub();
  }, [familiencode]);

  const hinzufuegen = async (name) => {
    if (!name.trim()) return;
    const id = Date.now().toString();
    await setDoc(doc(db, "listen", familiencode, "artikel", id), {
      name,
      gekauft: false
    });
    setEingabe("");
  };

  const umschalten = async (id, gekauft) => {
    await updateDoc(doc(db, "listen", familiencode, "artikel", id), {
      gekauft: !gekauft
    });
  };

  const loeschen = async (id) => {
    await deleteDoc(doc(db, "listen", familiencode, "artikel", id));
  };

  const startenMitSprache = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "de-DE";
    recognition.start();

    recognition.onresult = async (event) => {
      const gesprochenerText = event.results[0][0].transcript.toLowerCase();
      const artikel = gesprochenerText.replace(" hinzufügen", "").trim();

      if (artikel) {
        hinzufuegen(artikel);
      }
    };
  };

  if (!codeGesetzt) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Gogos Einkaufsliste</h2>
        <p>Familiencode eingeben:</p>
        <input
          value={familiencode}
          onChange={(e) => setFamiliencode(e.target.value)}
        />
        <button onClick={() => {
          localStorage.setItem("familiencode", familiencode);
          setCodeGesetzt(true);
        }}>Start</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Gogos Einkaufsliste – Code: {familiencode}</h2>
      <input
        value={eingabe}
        onChange={(e) => setEingabe(e.target.value)}
        placeholder="Artikel hinzufügen"
      />
      <button onClick={() => hinzufuegen(eingabe)}>Hinzufügen</button>
      <button onClick={startenMitSprache}>🎤 Artikel sprechen</button>
      <ul>
        {artikel.map((item) => (
          <li key={item.id}>
            <span
              onClick={() => umschalten(item.id, item.gekauft)}
              style={{
                textDecoration: item.gekauft ? "line-through" : "none",
                color: item.gekauft ? "red" : "black",
                cursor: "pointer",
              }}
            >
              {item.name}
            </span>
            <button onClick={() => loeschen(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        localStorage.removeItem("familiencode");
        setCodeGesetzt(false);
      }}>
        Familiencode wechseln
      </button>
    </div>
  );
}

export default App;
