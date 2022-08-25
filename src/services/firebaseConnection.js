import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTongpu7oCsugXVSDvWNxfKI7o7rFf6lM",
  authDomain: "sistusuario-85628.firebaseapp.com",
  projectId: "sistusuario-85628",
  storageBucket: "sistusuario-85628.appspot.com",
  messagingSenderId: "716572642515",
  appId: "1:716572642515:web:ba7776f788d06129a49826",
  measurementId: "G-KRF25JS0VY"
};

// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;