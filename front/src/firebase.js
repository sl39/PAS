import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId:  process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.REACT_APP_messagingSenderId,
  appId:  process.env.REACT_APP_appId,
  measurementId:  process.env.REACT_APP_measurementId
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); 
export default app;