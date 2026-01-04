// src/components/ListeAnsicht.js
import React, { useState, useEffect } from "react";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./ListeAnsicht.css";

function ListeAnsicht() {
  const [artikel, setArtikel] = useState([]);
  const [neuerArtikel, setNeuerArtikel] = useState("");
  const benutzerName = localStorage.getItem("benutzerName") || "Unbekannt";
  const familienCode = localStorage.getItem("familienCode") || "default";

  const listenRef = collection(db, "listen", familienCode, "artikel");

  useEffect(() => {
    const unsubscribe = onSnapshot(listenRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArtikel(items);
    });

    return () => unsubscribe();
  }, []);

  const artikelHinzufuegen = async () => {
    if (neuerArtikel.trim()) {
      await addDoc(listenRef, {
        text: neuerArtikel,
        autor: benutzerName,
        erledigt: false,
      });
      setNeuerArtikel("");
    }
  };

  const artikelLoeschen = async (id) => {
    await deleteDoc(doc(listenRef, id));
  };

  const artikelStreichen = async (id, erledigt) => {
    await addDoc(listenRef, {
      text: artikel.find((a) => a.id === id)?.text || "",
      autor: benutzerName,
      erledigt: !erledigt,
    });
    await deleteDoc(doc(listenRef, id));
  };

  return (
    <div className="liste-hintergrund">
      <div className="liste-container">
        <h2>Einkaufsliste: {familienCode}</h2>
        <div className="eingabe-zeile">
          <input
            type="text"
            placeholder="Artikel hinzufügen"
            value={neuerArtikel}
            onChange={(e) => setNeuerArtikel(e.target.value)}
          />
          <button onClick={artikelHinzufuegen}>+</button>
          <button><FaMicrophone /></button>
          <button><FaCamera /></button>
        </div>
        <ul>
          {artikel.map((item) => (
            <li key={item.id} className={item.erledigt ? "erledigt" : ""}>
              {item.text} <small>({item.autor})</small>
              <button onClick={() => artikelStreichen(item.id, item.erledigt)}>✔</button>
              <button onClick={() => artikelLoeschen(item.id)}><FaTrash /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListeAnsicht;
