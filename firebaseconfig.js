// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDd5QQ2QKHmHPw-ONiX8JjjTWAFwYdP88Q",
    authDomain: "buoi5-e6b4c.firebaseapp.com",
    projectId: "buoi5-e6b4c",
    storageBucket: "buoi5-e6b4c.appspot.com",
    messagingSenderId: "303163284759",
    appId: "1:303163284759:web:6ed02df27b079d4f41eb52",
    measurementId: "G-9WPV9ZL2QR"
  };

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };