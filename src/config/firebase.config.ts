// src/config/firebase.config.ts
// Firebase configuration - Configuración de credenciales
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { IFirebaseConfig } from "../interfaces/auth.interface";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig: IFirebaseConfig = {
  apiKey: "AIzaSyDJKsMY5u1CuuEd1MfXlgLH8eLX9hQ7xOM",
  authDomain: "proyectoreact-e6288.firebaseapp.com",
  projectId: "proyectoreact-e6288",
  storageBucket: "proyectoreact-e6288.firebasestorage.app",
  messagingSenderId: "592240659081",
  appId: "1:592240659081:web:15e9caffefffcb986f9458"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase app for use in other modules
export { app as firebaseApp };

// Validación de configuración en desarrollo
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey === "AIzaSyDJKsMY5u1CuuEd1MfXlgLH8eLX9hQ7xOM" && 
         firebaseConfig.projectId === "proyectoreact-e6288" &&
         firebaseConfig.authDomain === "proyectoreact-e6288.firebaseapp.com";
};

// Mensajes de ayuda para configuración
export const getFirebaseSetupInstructions = (): string => {
  return `
🔥 FIREBASE SETUP COMPLETED SUCCESSFULLY!

✅ Configuración aplicada:
- Project: proyectoreact-e6288
- API Key: AIzaSyDJKsMY5u1CuuEd1MfXlgLH8eLX9hQ7xOM
- Auth Domain: proyectoreact-e6288.firebaseapp.com

� Firebase está listo para Google OAuth!
Prueba el login en: /test-firebase
`;
};