import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const apps = getApps();

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID
  apiKey: "AIzaSyAii_VVuGuJjWJKZRmwV3QkCV5CWjYUpNg",
  authDomain: "svskonline-ba87d.firebaseapp.com",
  databaseURL: "https://svskonline-ba87d-default-rtdb.firebaseio.com",
  projectId: "svskonline-ba87d",
  storageBucket: "svskonline-ba87d.appspot.com",
  messagingSenderId: "118736530068",
  appId: "1:118736530068:web:cb94cbd6306f2776d0e281",
  measurementId: "G-641DBRG3WR",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// database
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
