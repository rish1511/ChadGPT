// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe7MaAaZCTyZQCtMP-1SbQezVaxjat6Mc",
  authDomain: "chadgpt-b2418.firebaseapp.com",
  projectId: "chadgpt-b2418",
  storageBucket: "chadgpt-b2418.firebasestorage.app",
  messagingSenderId: "466711978322",
  appId: "1:466711978322:web:3e038ea95fb5a4d2c9da8b",
  measurementId: "G-V7YQQ9EBDP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
