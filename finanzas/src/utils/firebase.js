// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9MAjiD8EGOUko6oGBK-wC9AXbD8ji68g",
  authDomain: "finanzaspersonales-97b17.firebaseapp.com",
  projectId: "finanzaspersonales-97b17",
  storageBucket: "finanzaspersonales-97b17.firebasestorage.app",
  messagingSenderId: "777561756334",
  appId: "1:777561756334:web:ad52c6e0ff3cdeb07f133f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };