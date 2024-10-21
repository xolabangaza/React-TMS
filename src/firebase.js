import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "tmsystem-1feac.firebaseapp.com",
    projectId: "tmsystem-1feac",
    storageBucket: "tmsystem-1feac.appspot.com",
    messagingSenderId: "367469812556",
    appId: "1:367469812556:web:5ac85763f0b5c789838de9",
    measurementId: "G-333ZBQNJSR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
