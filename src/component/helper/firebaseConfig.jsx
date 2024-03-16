import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, deleteUser, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuW8Zu5ONUmKzVuwWW6pLCupHEL1YgvWo",
  authDomain: "i-o-t-2647b.firebaseapp.com",
  projectId: "i-o-t-2647b",
  storageBucket: "i-o-t-2647b.appspot.com",
  messagingSenderId: "50277517841",
  appId: "1:50277517841:web:ccdeb2effe53dddbb37fb0",
  measurementId: "G-FJ2GCZ09XT",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, storage, db, auth, deleteUser, signOut };
