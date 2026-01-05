
import React from "react";

const ListeAnsicht = ({ nutzername, familiencode }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Willkommen {nutzername} 👋</h2>
      <p>Familiencode: {familiencode}</p>
      <p>Hier erscheint deine Einkaufsliste.</p>
    </div>
  );
};

export default ListeAnsicht;
