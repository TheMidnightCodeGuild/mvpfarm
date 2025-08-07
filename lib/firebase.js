import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq52HOS6-xH68HIM6C1h2QIGLTs9SgD78",
  authDomain: "mvpn-1fc77.firebaseapp.com",
  projectId: "mvpn-1fc77",
  storageBucket: "mvpn-1fc77.firebasestorage.app",
  messagingSenderId: "875182050193",
  appId: "1:875182050193:web:63edbb39a8f6084640e830"
};

// Initialize Firebase
let app;

// Check if Firebase is already initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore
const db = getFirestore(app);

export { app, db };