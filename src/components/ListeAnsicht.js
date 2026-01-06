import React, { useEffect, useState } from "react";
import { FaTrash, FaMicrophone, FaCamera, FaPlus } from "react-icons/fa";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./ListeAnsicht.css";

function ListeAnsicht({ nutzername, familiencode }) {
  const [artikel, setArtikel] = useState("");
  const [liste, setListe] = useState([]);

  useEffect(() => {
    if (!familiencode) return;

    const listenRef = collection(db, "listen", familiencode, "eintraege");
    const unsub = onSnapshot(listenRef, (snapshot) => {
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

    const listenRef = collection(db, "listen", familiencode, "eintraege");
    await addDoc(listenRef, {
      text: artikel,
      autor: nutzername,
      gekauft: false,
    });
    setArtikel("");
  };

  const artikelEntfernen = async (id) => {
    const docRef = doc(db, "listen", familiencode, "eintraege", id);
    await deleteDoc(docRef);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      artikelHinzufuegen();
    }
  };

  return (
    <div className="liste-container">
      <h2>Liste {familiencode}</h2>

      <div className="eingabe-bereich">
        <input
          type="text"
          value={artikel}
          onChange={(e) => setArtikel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Artikel eingeben..."
        />
        <button onClick={artikelHinzufuegen} title="Hinzufügen">
          <FaPlus />
        </button>
        <button title="Sprachaufnahme">
          <FaMicrophone />
        </button>
        <button title="Foto hinzufügen">
          <FaCamera />
        </button>
      </div>

      <ul>
        {liste.map((eintrag) => (
          <li key={eintrag.id}>
            <span>{eintrag.text}</span>
            <span className="autor">({eintrag.autor})</span>
            <button onClick={() => artikelEntfernen(eintrag.id)} title="Löschen">
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeAnsicht;
