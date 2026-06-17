// Indirizzo del backend.
//
// - Preview nel browser (web)  -> http://localhost:8000
// - Telefono vero con Expo Go  -> sostituisci 'localhost' con l'IP del tuo
//                                 computer nella rete WiFi, es. http://192.168.1.50:8000
//   (il telefono non sa cos'e' "localhost": quello e' il computer stesso.)
//
// Piu' avanti sposteremo questo valore in un file .env dell'app.

import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "web" ? "http://localhost:8000" : "http://localhost:8000";
