// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBol96sCZ35ae3uVbACz6fMC70KysNlku8",
  authDomain: "deberes-tecnologia.firebaseapp.com",
  databaseURL: "https://deberes-tecnologia-default-rtdb.firebaseio.com",
  projectId: "deberes-tecnologia",
  storageBucket: "deberes-tecnologia.firebasestorage.app",
  messagingSenderId: "320356541909",
  appId: "1:320356541909:web:68e047e074b43d1a89895c",
  measurementId: "G-FYZGZ52YQT"

};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
