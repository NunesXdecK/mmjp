// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4MNjIKQXTaZ-242BuAYd0PO58vY3C6H4",
  authDomain: "mmjp-bfca6.firebaseapp.com",
  projectId: "mmjp-bfca6",
  storageBucket: "mmjp-bfca6.appspot.com",
  messagingSenderId: "676571834239",
  appId: "1:676571834239:web:359e7b18a3254b69099c4a",
  measurementId: "G-J1CFCL6N6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore()

export { db }