// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";  //初期化
import { getFirestore } from 'firebase/firestore'; //Firestore読み込み
import { getAuth } from 'firebase/auth'; //Auth読み込み
import { getStorage } from 'firebase/storage'; //storage読み込み


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3wQq74_P-tn8eL-dBA7CxNAv7TQwqeJA",
  authDomain: "chatapp-52ae8.firebaseapp.com",
  projectId: "chatapp-52ae8",
  storageBucket: "chatapp-52ae8.appspot.com",
  messagingSenderId: "1066336179780",
  appId: "1:1066336179780:web:26260e09f0830368424e11"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); //初期化
const db = getFirestore(firebaseApp); //各ViewでgetFirestoreするのが面倒だからここで定義
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// export default { db, auth };
export {db, auth, storage};
