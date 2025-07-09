
import { initializeApp } from 'firebase/app'; // Inicializa Firebase
import { getAuth } from 'firebase/auth'; // Para autenticación
import { getFirestore } from 'firebase/firestore'; // Para la base de datos Firestore

// Configuración web de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAx8-QgEGuOVdRzD5ASkC4eIQeANnZ7Fjc",
    authDomain: "mi-proyecto-firebase-9eb58.firebaseapp.com",
    projectId: "mi-proyecto-firebase-9eb58",
    storageBucket: "mi-proyecto-firebase-9eb58.firebasestorage.app",
    messagingSenderId: "647372503479",
    appId: "1:647372503479:web:cdf68fa840136fe4d29032"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
