// Import the functions you need from the SDKs you need
import { initializeApp,} from "firebase/app";
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp, query, where } from "firebase/firestore"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import {useState, useEffect} from 'react'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtal4j7Q_7OuGRr1u0Nr41SX0iZ4oTn40",
  authDomain: "lingogee-f9a87.firebaseapp.com",
  projectId: "lingogee-f9a87",
  storageBucket: "lingogee-f9a87.appspot.com",
  messagingSenderId: "448331945916",
  appId: "1:448331945916:web:ae0582a58e280334acfdb9",
  measurementId: "G-K6H0NBVNMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const colRef = collection(db, 'users')

const userChatRef = (userEmail="aventuras030@gmail.com") => query(collection(db,'chats'), where('users', 'array-contains', userEmail))



const signIn = async() => {
  await signInWithPopup(auth,provider).catch(error => alert(error.message))
}

const signOutUser = () => {
  signOut(auth)
}

const setUserData = (user) => {
    try {
       setDoc(doc(colRef,user.uid), {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
  }, {merge: true})
    } catch { console.log("write to db failed")}   
}

const addChat = (user,input) => {
    addDoc(collection(db, "chats"), {
        users: [user.email, input]
    })
    }




const useAuth = () => {
    const [currentUser,setCurrentUser] = useState()

useEffect(() => {
  const unsub = onAuthStateChanged(auth, user => setCurrentUser(user))
  return unsub
},[])

    return currentUser
}

export {db, auth, provider, userChatRef, useAuth, signIn, setUserData, signOutUser, addChat}
