import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyDPMeeWfqqpsQ7QKMFPO6qWEjOFj-qN7Ww",
    authDomain: "sistema-d5f53.firebaseapp.com",
    projectId: "sistema-d5f53",
    storageBucket: "sistema-d5f53.appspot.com",
    messagingSenderId: "967885456600",
    appId: "1:967885456600:web:0a2fc720158a695d14c3ad",
    measurementId: "G-VJY6TWV228"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

export default firebase;