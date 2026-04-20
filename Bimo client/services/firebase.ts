import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAACFcQbfL1DMTmj7qMbsJjlpFpvwAO4GI",
  authDomain: "bimo--auth.firebaseapp.com",
  projectId: "bimo--auth",
  storageBucket: "bimo--auth.firebasestorage.app",
  messagingSenderId: "695296194366",
  appId: "1:695296194366:web:7e564acbce3f149a89de6f",
  measurementId: "G-B1MBC3EJPT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);