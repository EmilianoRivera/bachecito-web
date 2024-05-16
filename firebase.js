import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, query, where, addDoc} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APPID
};

const firebaseConfig2 = {
  apiKey: process.env.NEXT_PUBLIC_SOPORTE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_SOPORTE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_SOPORTE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_SOPORTE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SOPORTE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_SOPORTE_APPID
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const app2 = initializeApp(firebaseConfig2, "SoporteB26");
const auth2 = getAuth(app2);
const db2 = getFirestore(app2);
export { app, app2, auth, db,db2, collection, getDocs,doc , deleteDoc, updateDoc, query, where, addDoc};
