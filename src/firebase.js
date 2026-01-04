// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6SDiuQ875LX9DYOMVfdSwT4ipwRL13_Y",
  authDomain: "gogoseinkaufsliste.firebaseapp.com",
  projectId: "gogoseinkaufsliste",
  storageBucket: "gogoseinkaufsliste.firebasestorage.app",
  messagingSenderId: "910390367250",
  appId: "1:910390367250:web:5238db8d0db09f850cb4cb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
