// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHzV3MbaaovjvGwahdoTpYRS6KtvrvtEQ",
  authDomain: "portfolio-71526.firebaseapp.com",
  projectId: "portfolio-71526",
  storageBucket: "portfolio-71526.firebasestorage.app",
  messagingSenderId: "355407518634",
  appId: "1:355407518634:web:a752e04eb801c12260e9d3",
  measurementId: "G-GW3ZK26JG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

