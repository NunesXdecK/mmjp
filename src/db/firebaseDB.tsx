// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore()

export { db }

export const USER_COLLECTION_NAME = "user"
export const PERSON_COLLECTION_NAME = "person"
export const BUDGET_COLLECTION_NAME = "budget"
export const COMPANY_COLLECTION_NAME = "company"
export const PROJECT_COLLECTION_NAME = "project"
export const SERVICE_COLLECTION_NAME = "service"
export const HISTORY_COLLECTION_NAME = "history"
export const PAYMENT_COLLECTION_NAME = "payment"
export const IMMOBILE_COLLECTION_NAME = "immobile"
export const LOGIN_TOKEN_COLLECTION_NAME = "logintoken"
export const PROFESSIONAL_COLLECTION_NAME = "professional"
export const SERVICE_STAGE_COLLECTION_NAME = "servicestage"
export const SUBJECT_MESSAGE_COLLECTION_NAME = "subjectmessage"
export const SERVICE_PAYMENT_COLLECTION_NAME = "servicepayment"