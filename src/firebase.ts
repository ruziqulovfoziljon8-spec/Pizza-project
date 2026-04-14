import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP-FLgHvoT7ImkWGouXSD7O2O-8HbnFoE",
  authDomain: "pizza-project-1bedc.firebaseapp.com",
  projectId: "pizza-project-1bedc",
  storageBucket: "pizza-project-1bedc.firebasestorage.app",
  messagingSenderId: "859194340221",
  appId: "1:859194340221:web:f3190d167ed0fa5eee5214",
  measurementId: "G-995GZ9ZWR6",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getFirestore(app);

export { db };
