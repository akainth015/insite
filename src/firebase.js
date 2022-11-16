// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDJ8dQUMbOE_IBGRG7G2GpK4w42c0ulbfY",
    authDomain: "insite-b5c86.firebaseapp.com",
    projectId: "insite-b5c86",
    storageBucket: "insite-b5c86.appspot.com",
    messagingSenderId: "993485888320",
    appId: "1:993485888320:web:125656ae4765e056ff78a5",
    measurementId: "G-3C86FWEVHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore(app);
