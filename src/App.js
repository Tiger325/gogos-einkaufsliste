// Einkaufsliste – mit Heftlinien, Handschrift und Layout-Anpassungen

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

  const containerStyle = {
    backgroundColor: "#f3f3f3",
    backgroundImage: `
      linear-gradient(to right, #e0e0e0 1px, transparent 1px),
      linear-gradient(to bottom, #b0b0b0 1px, transparent 30px)
    `,
    backgroundSize: "30px 30px",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Patrick Hand', cursive"
  };

  const inputStyle = {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    fontFamily: "'Patrick Hand', cursive"
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b7e4c7",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "'Patrick Hand', cursive"
  };

  const listItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px dashed transparent",
    padding: "5px 10px",
    fontSize: "20px",
    fontFamily: "'Patrick Hand', cursive",
    width: "100%",
    minHeight: "30px",
    boxSizing: "border-box"
  };

  if (!codeGesetzt) {
    return (
      <div style={containerStyle}>
        <h2>Einkaufsliste</h2>
        <p>Familiencode eingeben:</p>
        <input
          style={inputStyle}
          value={familiencode}
          onChange={(e) => setFamiliencode(e.target.value)}
        />
        <button style={buttonStyle} onClick={() => {
          localStorage.setItem("familiencode", familiencode);
          setCodeGesetzt(true);
        }}>Start</button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2>Einkaufsliste – Code: {familiencode}</h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          style={inputStyle}
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder="Artikel hinzufügen"
        />
        <div>
          <button style={buttonStyle} onClick={() => hinzufuegen(eingabe)}>Hinzufügen</button>
          <button style={buttonStyle} onClick={startenMitSprache}>🎤 Artikel sprechen</button>
        </div>
      </div>
      <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
        {artikel.map((item) => (
          <li key={item.id} style={listItemStyle}>
            <span
              onClick={() => umschalten(item.id, item.gekauft)}
              style={{
                textDecoration: item.gekauft ? "line-through" : "none",
                color: item.gekauft ? "red" : "black",
                cursor: "pointer",
                flexGrow: 1
              }}
            >
              {item.name}
            </span>
            <button style={buttonStyle} onClick={() => loeschen(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <button style={buttonStyle} onClick={() => {
        localStorage.removeItem("familiencode");
        setCodeGesetzt(false);
      }}>
        Familiencode wechseln
      </button>
    </div>
  );
}

export default App;
