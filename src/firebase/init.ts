// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore"

export const baseURL = (): string => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return "localhost:3000"
  }
  return "crushers-b9b59.firebaseapp.com"
}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWsmE1ga0FlZMYKYQTXkPUkFaUyFJQ7zA",
  authDomain: baseURL(),
  databaseURL: "https://crushers-b9b59-default-rtdb.firebaseio.com",
  projectId: "crushers-b9b59",
  storageBucket: "crushers-b9b59.appspot.com",
  messagingSenderId: "726054365204",
  appId: "1:726054365204:web:134ade5949636393755f01",
  measurementId: "G-JH105THYE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore()

/**
 * Use this anytime you want to push or pull from the Firebase database
 * @returns the object with member functions allowing for database operations
 */
export const firebaseDB = (): Firestore => {
  return db
}

/**
 * Use this anytime you want to access Firebase analytics
 * @returns the object with member functions allowing for analytics measurements
 */
export const firebaseAnalytics = (): Analytics => {
  return analytics
}
