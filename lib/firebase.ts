
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Verified Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUg79v7RE6KX0RCgoGTDWgfd1A0eFH1Ys",
  authDomain: "academiamarket-14822416-de001.firebaseapp.com",
  projectId: "academiamarket-14822416-de001",
  storageBucket: "academiamarket-14822416-de001.firebasestorage.app",
  messagingSenderId: "1055277399778",
  appId: "1:1055277399778:web:4518250e7b33c6f09c68bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/**
 * Sanitizes an object for Firestore by removing keys with undefined values.
 * Firestore throws errors if it encounters undefined.
 */
export const sanitizeForFirestore = (obj: any) => {
  const sanitized: any = {};
  if (!obj) return sanitized;
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      sanitized[key] = obj[key];
    }
  });
  return sanitized;
};

console.log("🔥 AcademiaMarket Firebase Initialized (Storage & Auth ready)");
