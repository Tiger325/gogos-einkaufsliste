import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function ListeAnsicht({ nutzername, familiencode }) {
  const [artikel, setArtikel] = useState("");
  const [liste, setListe] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "listen", familiencode, "artikel"), (snapshot) => {
      const neueListe = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListe(neueListe);
    });

    return () => unsub();
  }, [familiencode]);

  const artikelHinzufuegen = async () => {
    if (artikel.trim() !== "") {
      await addDoc(collection(db, "listen", familiencode, "artikel"), {
        text: artikel,
        autor: nutzername
      });
      setArtikel("");
    }
  };

  const artikelEntfernen = async (id) => {
    await deleteDoc(doc(db, "listen", familiencode, "artikel", id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Einkaufsliste – {familiencode}</h2>
      <input
        type="text"
        placeholder="Neuer Artikel"
        value={artikel}
        onChange={(e) => setArtikel(e.target.value)}
      />
      <button onClick={artikelHinzufuegen}>Hinzufügen</button>
      <ul>
        {liste.map((item) => (
          <li key={item.id}>
            {item.text} – <i>{item.autor}</i>
            <button onClick={() => artikelEntfernen(item.id)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeAnsicht;