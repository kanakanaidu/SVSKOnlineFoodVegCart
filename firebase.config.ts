import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const apps = getApps();

const firebaseConfig = {
  apiKey: "AIzaSyAmZ8Atxnffoqa-xPcVpdg1VIoQ3Bx1mSo",
  authDomain: "lepakshionlinestore-abcd.firebaseapp.com",
  projectId: "lepakshionlinestore-abcd",
  storageBucket: "lepakshionlinestore-abcd.appspot.com",
  messagingSenderId: "821996480852",
  appId: "1:821996480852:web:baedd0a4b7a0cc4e5bc0c1",
  measurementId: "G-N0P3SNW8X7"

  // apiKey: "AIzaSyAii_VVuGuJjWJKZRmwV3QkCV5CWjYUpNg",
  // authDomain: "svskonline-ba87d.firebaseapp.com",
  // databaseURL: "https://svskonline-ba87d-default-rtdb.firebaseio.com",
  // projectId: "svskonline-ba87d",
  // storageBucket: "svskonline-ba87d.appspot.com",
  // messagingSenderId: "118736530068",
  // appId: "1:118736530068:web:cb94cbd6306f2776d0e281",
  // measurementId: "G-641DBRG3WR",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// database
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
