import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const apps = getApps();

const firebaseConfig = {
  // apiKey: "AIzaSyCzoDjbbL17M7kI2HWkBuUZB_MR4J3vKc0",
  // authDomain: "food-ecommerce-app-7feed.firebaseapp.com",
  // databaseURL: "https://food-ecommerce-app-7feed-default-rtdb.firebaseio.com",
  // projectId: "food-ecommerce-app-7feed",
  // storageBucket: "food-ecommerce-app-7feed.appspot.com",
  // messagingSenderId: "393805613315",
  // appId: "1:393805613315:web:8b4f397d1f88f12eb98136",
  apiKey: "AIzaSyAii_VVuGuJjWJKZRmwV3QkCV5CWjYUpNg",
  authDomain: "svskonline-ba87d.firebaseapp.com",
  databaseURL: "https://svskonline-ba87d-default-rtdb.firebaseio.com",
  projectId: "svskonline-ba87d",
  storageBucket: "svskonline-ba87d.appspot.com",
  messagingSenderId: "118736530068",
  appId: "1:118736530068:web:cb94cbd6306f2776d0e281",
  measurementId: "G-641DBRG3WR"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// database
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
