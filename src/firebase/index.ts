import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getStorage } from "@firebase/storage";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB7ojfrNoQIF8rjb5_ykYJ9152AMTn6EA",
  authDomain: "incidentmapping-e9c74.firebaseapp.com",
  projectId: "incidentmapping-e9c74",
  storageBucket: "incidentmapping-e9c74.appspot.com",
  messagingSenderId: "162749718355",
  appId: "1:162749718355:web:42e5fb54f6212750284ba6",
  measurementId: "G-V5GJ29ZKMC"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();