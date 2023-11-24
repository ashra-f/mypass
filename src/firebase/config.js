import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB7LvH1kIDF9ooslZpF_4hiG042mwcGPGc",
  authDomain: "mypass-5ea4d.firebaseapp.com",
  projectId: "mypass-5ea4d",
  storageBucket: "mypass-5ea4d.appspot.com",
  messagingSenderId: "989606671413",
  appId: "1:989606671413:web:871d55217c731dd5a72d7c",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get instances for authentication and Firestore
const db = getFirestore(app)

export { db }
