
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyDtpPw0YKC1NwilyHiSZdMKT4D4MSEl62Q",
  authDomain: "thaprilproject.firebaseapp.com",
  projectId: "thaprilproject",
  storageBucket: "thaprilproject.firebasestorage.app",
  messagingSenderId: "251587128039",
  appId: "1:251587128039:web:f9df68ef74ba4de8f2d042",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  storage
};
