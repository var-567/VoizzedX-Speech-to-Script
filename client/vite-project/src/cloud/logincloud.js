import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVJgIB9dkcuTL71Rc3eUZF7MbuEVqfrWM",
  authDomain: "speech2script-596f3.firebaseapp.com",
  projectId: "speech2script-596f3",
  storageBucket: "speech2script-596f3.appspot.com",
  messagingSenderId: "850778909479",
  appId: "1:850778909479:web:ef179f15a2b5f1852b9702",
  measurementId: "G-4XQKS8JWG9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
