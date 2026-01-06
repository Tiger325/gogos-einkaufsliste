import React, { useEffect, useState, useRef } from "react";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./ListeAnsicht.css";
function ListeAnsicht({ nutzername, familiencode }) {
  const [produkte, setProdukte] = useState([]);
  const [eingabe, setEingabe] = useState("");
  const recognitionRef = useRef(null);
  const listRef = collection(db, "listen", familiencode, "produkte");

  useEffect(() => {
    const unsubscribe = onSnapshot(listRef, (snapshot) => {
      const neueProdukte = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdukte(neueProdukte);
    });
    return () => unsubscribe();
  }, [familiencode]);

  const produktHinzufuegen = async () => {
    if (eingabe.trim() === "") return;
    await addDoc(listRef, {
      text: eingabe,
      autor: nutzername,
      erstellt: new Date(),
    });
    setEingabe("");
  };

  const produktLoeschen = async (id) => {
    await deleteDoc(doc(db, "listen", familiencode, "produkte", id));
  };

  const starteSpracherkennung = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Spracherkennung wird von deinem Browser nicht unterstützt.");
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "de-DE";
    recognitionRef.current.start();
    recognitionRef.current.onresult = (event) => {
      const gesprochenerText = event.results[0][0].transcript;
      setEingabe((prev) => (prev ? prev + " " + gesprochenerText : gesprochenerText));
    };
  };

  const wechsleBenutzer = () => {
    localStorage.removeItem("nutzername");
    window.location.reload();
  };

  const wechsleRaum = () => {
    localStorage.removeItem("familiencode");
    window.location.reload();
  };

  return (
    <div className="liste-container">
      <div className="kopfbereich">
        <button onClick={wechsleBenutzer}>Benutzer wechseln</button>
        <h2>Liste: {familiencode}</h2>
        <button onClick={wechsleRaum}>Raum wechseln</button>
      </div>

      <ul>
        {produkte.map((produkt) => (
          <li key={produkt.id}>
            <span>{produkt.text} <em>({produkt.autor})</em></span>
            <button onClick={() => produktLoeschen(produkt.id)}><FaTrash /></button>
          </li>
        ))}
      </ul>

      <div className="eingabe-bereich">
        <input
          type="text"
          placeholder="Produkt eingeben..."
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && produktHinzufuegen()}
        />
        <button onClick={produktHinzufuegen}>Hinzufügen</button>
        <button onClick={starteSpracherkennung}><FaMicrophone /></button>
        <button><FaCamera /></button>
      </div>
    </div>
  );
}

export default ListeAnsicht;
