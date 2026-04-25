import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bird-fly-29513.firebaseapp.com",
  projectId: "bird-fly-29513",
  storageBucket: "bird-fly-29513.firebasestorage.app",
  messagingSenderId: "137343206293",
  appId: "1:137343206293:web:0129fb496ad971836eec9c",
  measurementId: "G-75Y8257RV1",
  // Gunakan link dari screenshot
  databaseURL:
    "https://bird-fly-29513-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
