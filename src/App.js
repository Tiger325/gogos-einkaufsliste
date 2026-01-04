// Einkaufsliste mit Startbildschirm, Listenwahl, OCR, Spracheingabe und Notizbuch-Design

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
  const [aktuelleListe, setAktuelleListe] = useState("Haus");
  const [listen, setListen] = useState(["Haus"]);
  const [artikel, setArtikel] = useState([]);
  const [eingabe, setEingabe] = useState("");
  const [neueListeName, setNeueListeName] = useState("");

  useEffect(() => {
    if (!familiencode || !aktuelleListe) return;
    const unsub = onSnapshot(
      collection(db, "listen", familiencode, aktuelleListe),
      (snapshot) => {
        setArtikel(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsub();
  }, [familiencode, aktuelleListe]);

  const hinzufuegen = async (name) => {
    if (!name.trim()) return;
    const id = Date.now().toString();
    await setDoc(doc(db, "listen", familiencode, aktuelleListe, id), {
      name,
      autor: benutzername,
      gekauft: false,
    });
    setEingabe("");
  };

  const umschalten = async (id, gekauft) => {
    await updateDoc(doc(db, "listen", familiencode, aktuelleListe, id), {
      gekauft: !gekauft,
    });
  };

  const loeschen = async (id) => {
    await deleteDoc(doc(db, "listen", familiencode, aktuelleListe, id));
  };

  const startenMitSprache = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "de-DE";
    recognition.start();

    recognition.onresult = (event) => {
      const gesprochenerText = event.results[0][0].transcript.toLowerCase();
      const artikel = gesprochenerText.replace(" hinzufügen", "").trim();
      if (artikel) {
        hinzufuegen(artikel);
      }
    };
  };

  const containerStyle = {
    backgroundImage: codeGesetzt ? "url('/notizbuch.jpg')" : "url('/startbild.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    minHeight: "100vh",
    padding: "20px 20px 100px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Patrick Hand', cursive",
  };

  const inputStyle = {
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    fontFamily: "'Patrick Hand', cursive",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b7e4c7",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "'Patrick Hand', cursive",
  };

  const listItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "0 10px",
    fontSize: "18px",
    fontFamily: "'Patrick Hand', cursive",
    minHeight: "30px",
    boxSizing: "border-box",
  };

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
        <h2 style={{ marginTop: "40px" }}>Einkaufsliste</h2>
        {!nameGespeichert && (
          <div>
            <p>Dein Name:</p>
            <input
              style={inputStyle}
              value={benutzername}
              onChange={(e) => setBenutzername(e.target.value)}
              placeholder="Dein Name"
            />
            <button style={buttonStyle} onClick={handleNameSpeichern}>Speichern</button>
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
            <button
              style={buttonStyle}
              onClick={() => {
                localStorage.setItem("familiencode", familiencode);
                setCodeGesetzt(true);
              }}
            >Start</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px", marginTop: "10px" }}>Liste: {aktuelleListe}</h2>
      <div>
        {listen.map((liste, idx) => (
          <button
            key={idx}
            style={{ ...buttonStyle, backgroundColor: liste === aktuelleListe ? "#95d5b2" : "#d8f3dc" }}
            onClick={() => setAktuelleListe(liste)}
          >{liste}</button>
        ))}
        <input
          style={{ ...inputStyle, width: "120px" }}
          value={neueListeName}
          onChange={(e) => setNeueListeName(e.target.value)}
          placeholder="+ Neue Liste"
        />
        <button
          style={buttonStyle}
          onClick={() => {
            if (neueListeName.trim()) {
              setListen([...new Set([...listen, neueListeName.trim()])]);
              setAktuelleListe(neueListeName.trim());
              setNeueListeName("");
            }
          }}
        >➕</button>
      </div>
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
      <ul style={{ listStyle: "none", padding: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {artikel.map((item) => (
          <li key={item.id} style={listItemStyle}>
            <span
              onClick={() => umschalten(item.id, item.gekauft)}
              style={{
                textDecoration: item.gekauft ? "line-through" : "none",
                color: item.gekauft ? "red" : "black",
                cursor: "pointer",
                textAlign: "center"
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
        }}>👤 Name ändern</button>
        <button style={buttonStyle} onClick={() => {
          localStorage.removeItem("familiencode");
          setCodeGesetzt(false);
        }}>🏠 Familiencode wechseln</button>
      </div>
    </div>
  );
}

export default App;
