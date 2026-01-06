
import React, { useEffect, useState } from "react";
import { FaTrash, FaMicrophone, FaCamera } from "react-icons/fa";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import notizbuchHintergrund from "../assets/notizbuch.jpg";
import "./ListeAnsicht.css";

function ListeAnsicht({ nutzername, familiencode }) {
  const [produkte, setProdukte] = useState([]);
  const [eingabe, setEingabe] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "listen", familiencode, "produkte"), (snapshot) => {
      const neueProdukte = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdukte(neueProdukte);
    });
    return () => unsub();
  }, [familiencode]);

  const produktHinzufuegen = async () => {
    if (eingabe.trim() === "") return;
    await addDoc(collection(db, "listen", familiencode, "produkte"), {
      text: eingabe,
      autor: nutzername,
    });
    setEingabe("");
  };

  const produktLoeschen = async (id) => {
    await deleteDoc(doc(db, "listen", familiencode, "produkte", id));
  };

  return (
    <div
      className="liste-container"
      style={{
        backgroundImage: `url(${notizbuchHintergrund})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <h2>Liste: {familiencode}</h2>
      <ul>
        {produkte.map((produkt) => (
          <li key={produkt.id}>
            <span>{produkt.text}</span>
            <span className="autor">({produkt.autor})</span>
            <button onClick={() => produktLoeschen(produkt.id)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
      <div className="eingabe-bereich">
        <input
          type="text"
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder="Produkt hinzufügen"
        />
        <button onClick={produktHinzufuegen}>Hinzufügen</button>
        <button><FaMicrophone /></button>
        <button><FaCamera /></button>
      </div>
    </div>
  );
}

export default ListeAnsicht;
