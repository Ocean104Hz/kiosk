// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnUXydv5qtVQg6kMCEL0OkZHuZ83oDOP8",
  authDomain: "kiosk-a7736.firebaseapp.com",
  projectId: "kiosk-a7736",
  storageBucket: "kiosk-a7736.firebasestorage.app",
  messagingSenderId: "786035770077",
  appId: "1:786035770077:web:63a3d60f0a999e1143d134",
  measurementId: "G-FY4EPREPHG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
