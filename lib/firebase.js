// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy9arH_hlIYSNzKgV3FbfWk9QQD20pOdI",
  authDomain: "craftnet-e7bcf.firebaseapp.com",
  projectId: "craftnet-e7bcf",
  storageBucket: "craftnet-e7bcf.appspot.com",
  messagingSenderId: "269695968020",
  appId: "1:269695968020:web:dbe8ad413935155c885801",
  measurementId: "G-WEN4CP8ETT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Test Firebase connection
if (typeof window !== 'undefined') {
  console.log('Firebase initialized:', {
    auth: !!auth,
    db: !!db,
    storage: !!storage,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  });
}

export default app;

