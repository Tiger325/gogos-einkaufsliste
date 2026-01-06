
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import "./ListeAnsicht.css";

function ListeAnsicht({ nutzername, familiencode }) {
  const [eingabe, setEingabe] = useState("");
  const [produkte, setProdukte] = useState([]);
  const listenPfad = `listen/${familiencode || "haus"}/produkte`;

  useEffect(() => {
    const q = query(collection(db, listenPfad), orderBy("zeit", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const neueProdukte = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdukte(neueProdukte);
    });
    return () => unsub();
  }, [familiencode]);

  const hinzufuegen = async () => {
    if (eingabe.trim() === "") return;
    await addDoc(collection(db, listenPfad), {
      text: eingabe,
      autor: nutzername,
      zeit: new Date(),
    });
    setEingabe("");
  };

  const loeschen = async (id) => {
    await deleteDoc(doc(db, listenPfad, id));
  };

  return (
    <div className="liste-container">
      <h2>Liste: {familiencode}</h2>
      <div className="eingabe-bereich">
        <input
          type="text"
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder="Produkt eingeben..."
        />
        <button onClick={hinzufuegen}>+</button>
        <button><FaMicrophone /></button>
        <button><FaCamera /></button>
      </div>
      <ul>
        {produkte.map((produkt) => (
          <li key={produkt.id}>
            {produkt.text}{" "}
            <span className="autor">({produkt.autor})</span>
            <button onClick={() => loeschen(produkt.id)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeAnsicht;
