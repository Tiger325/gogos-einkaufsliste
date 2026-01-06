
import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaTrash } from "react-icons/fa";
import "./ListeAnsicht.css";

function ListeAnsicht({ nutzername, familiencode, onBenutzerWechseln, onRaumWechseln }) {
  const [artikel, setArtikel] = useState("");
  const [liste, setListe] = useState([]);

  const listenPfad = `familien/${familiencode}/listen/Haus/artikel`;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, listenPfad), (snapshot) => {
      const neueListe = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListe(neueListe);
    });
    return () => unsub();
  }, [familiencode]);

  const artikelHinzufuegen = async () => {
    if (artikel.trim() === "") return;
    await addDoc(collection(db, listenPfad), {
      text: artikel,
      autor: nutzername,
      erledigt: false,
    });
    setArtikel("");
  };

  const artikelLoeschen = async (id) => {
    await deleteDoc(doc(db, listenPfad, id));
  };

  const artikelUmschalten = async (id, erledigt) => {
    await updateDoc(doc(db, listenPfad, id), {
      erledigt: !erledigt,
    });
  };

  return (
    <div className="hintergrund-notizbuch">
      <div className="wechsel-buttons">
        <button onClick={onRaumWechseln}>🔁 Raum wechseln</button>
        <button onClick={onBenutzerWechseln}>👤 Benutzer wechseln</button>
      </div>
      <div className="liste-container">
        <h2>📝 Liste „Haus“</h2>
        <input
          value={artikel}
          onChange={(e) => setArtikel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && artikelHinzufuegen()}
          placeholder="Artikel hinzufügen..."
        />
        <ul>
          {liste.map((item) => (
            <li key={item.id}>
              <span
                onClick={() => artikelUmschalten(item.id, item.erledigt)}
                style={{ textDecoration: item.erledigt ? "line-through" : "none", flex: 1 }}
              >
                {item.text} <small>({item.autor})</small>
              </span>
              <button onClick={() => artikelLoeschen(item.id)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListeAnsicht;
