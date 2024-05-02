import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, query, where, addDoc} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfigSoporte = {
  apiKey: process.env.NEXT_PUBLIC_SOPORTE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_SOPORTE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_SOPORTE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_SOPORTE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SOPORTE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_SOPORTE_APPID
};



const appSoporte = initializeApp(firebaseConfigSoporte);
const authSoporte = getAuth(appSoporte);
const dbSoporte = getFirestore(appSoporte);
export { appSoporte, authSoporte, dbSoporte };