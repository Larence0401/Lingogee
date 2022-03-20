// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const colRef = collection(db, "users");

const userChatRef = (userEmail = "aventuras030@gmail.com") =>
  query(collection(db, "chats"), where("users", "array-contains", userEmail));

const loginWithGoogle = async () => {
  await signInWithPopup(auth, provider).catch((error) => alert(error.message));
};

const signupUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const signOutUser = () => {
  signOut(auth);
};

const setUserData = (user) => {
  try {
    setDoc(
      doc(colRef, user.uid),
      {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL,
      },
      { merge: true }
    );
  } catch {
    console.log("write to db failed");
  }
};

const addChat = (user, input) => {
  addDoc(collection(db, "chats"), {
    users: [user.email, input],
  });
};

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
};

export {
  db,
  auth,
  app,
  storage,
  provider,
  userChatRef,
  useAuth,
  loginWithGoogle,
  signupUser,
  loginUser,
  setUserData,
  signOutUser,
  addChat,
};
