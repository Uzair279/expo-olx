// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBOYjUUmzuYKBtJJvNdfZBzlbepweZ7AX0",
    authDomain: "olxfirebasereact-5aad4.firebaseapp.com",
    projectId: "olxfirebasereact-5aad4",
    storageBucket: "olxfirebasereact-5aad4.appspot.com",
    messagingSenderId: "755426849199",
    appId: "1:755426849199:web:31b0f2b1adb74ab64fff5a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app)


export { auth, db, storage }