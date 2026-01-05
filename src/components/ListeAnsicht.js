
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import "./ListeAnsicht.css";

function ListeAnsicht() {
  const benutzername = localStorage.getItem("benutzername") || "";
  const familiencode = localStorage.getItem("familiencode") || "";
  const liste = localStorage.getItem("liste") || "Haus";
  const [artikel, setArtikel] = useState([]);
  const [eingabe, setEingabe] = useState("");

  const pfad = collection(db, "listen", familiencode, liste);

  useEffect(() => {
    const unsub = onSnapshot(pfad, (snapshot) => {
      setArtikel(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const hinzufuegen = async () => {
    if (eingabe.trim().length === 0) return;
    await addDoc(pfad, { name: eingabe, autor: benutzername, gekauft: false });
    setEingabe("");
  };

  const umschalten = async (id, gekauft) => {
    await updateDoc(doc(pfad, id), { gekauft: !gekauft });
  };

  const loeschen = async (id) => {
    await deleteDoc(doc(pfad, id));
  };

  return (
    <div className="liste-container">
      <h2>{liste} – Code: {familiencode}</h2>
      <div className="eingabe-bereich">
        <input
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder="Artikel hinzufügen"
        />
        <button onClick={hinzufuegen}>➕</button>
        <button><FaMicrophone /></button>
        <button><FaCamera /></button>
      </div>
      <ul>
        {artikel.map((a) => (
          <li key={a.id}>
            <span
              style={{ textDecoration: a.gekauft ? "line-through" : "none" }}
              onClick={() => umschalten(a.id, a.gekauft)}
            >
              {a.name} {a.autor && `(${a.autor})`}
            </span>
            <button onClick={() => loeschen(a.id)}><FaTrash /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeAnsicht;
