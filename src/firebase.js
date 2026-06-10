import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCEY90S54BsDYpii77kWkFuXko34RkXeRU",
  authDomain: "trademind-ai-a0456.firebaseapp.com",
  projectId: "trademind-ai-a0456",
  storageBucket: "trademind-ai-a0456.firebasestorage.app",
  messagingSenderId: "290508657488",
  appId: "1:290508657488:web:5430538188ee01dd335255"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
