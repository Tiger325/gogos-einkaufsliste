// Einkaufsliste – mit leerem Notizbuch-Hintergrund, verbessertem Namensfeld und Menü unten

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
  const [benutzername, setBenutzername] = useState(() => {
    return localStorage.getItem("benutzername") || "";
  });
  const [codeGesetzt, setCodeGesetzt] = useState(!!familiencode);
  const [nameGespeichert, setNameGespeichert] = useState(!!benutzername);
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
      autor: benutzername,
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
    backgroundImage: "url('/notizbuch.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "top left",
    minHeight: "100vh",
    padding: "20px 20px 100px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Patrick Hand', cursive"};

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
    justifyContent: "flex-start",
    gap: "10px",
    padding: "0 40px",
    fontSize: "18px",
    fontFamily: "'Patrick Hand', cursive",
    width: "100%",
    minHeight: "30px",
    boxSizing: "border-box"};

  const handleNameSpeichern = () => {
    if (benutzername.trim().length > 1) {
      localStorage.setItem("benutzername", benutzername);
      setNameGespeichert(true);
    } else {
      alert("Bitte gib einen vollständigen Namen ein.");
    }
  };

  if (!codeGesetzt || !nameGespeichert) {
    return (
      <div style={containerStyle}>
        <h2>Einkaufsliste</h2>
        {!nameGespeichert && (
          <div>
            <p>Dein Name:</p>
            <input
              style={inputStyle}
              value={benutzername}
              onChange={(e) => setBenutzername(e.target.value)}
              placeholder="Dein Name"
            />
            <button
              style={buttonStyle}
              onClick={handleNameSpeichern}
            >Speichern</button>
          </div>
        )}
        {!codeGesetzt && (
          <div>
            <p>Familiencode:</p>
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
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px', marginTop: '10px' }}>Einkaufsliste – Code: {familiencode}</h2>
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
              {item.name} {item.autor ? `(${item.autor})` : ""}
            </span>
            <button style={buttonStyle} onClick={() => loeschen(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
        <button style={buttonStyle} onClick={() => {
          localStorage.removeItem("benutzername");
          setBenutzername("");
          setNameGespeichert(false);
        }}>
          👤 Name ändern
        </button>
        <button style={buttonStyle} onClick={() => {
          localStorage.removeItem("familiencode");
          setCodeGesetzt(false);
        }}>
          🏠 Familiencode wechseln
        </button>
      </div>
    </div>
  );
}

export default App;
