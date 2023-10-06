import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAJrn2yauEfXwRtFOZVPUARrR6lMFsUJBA",
    authDomain: "netflix-movie-f6542.firebaseapp.com",
    projectId: "netflix-movie-f6542",
    storageBucket: "netflix-movie-f6542.appspot.com",
    messagingSenderId: "679035506034",
    appId: "1:679035506034:web:ed34144f55127ba578a1eb"
  };

  let app;

  if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
  } else {
      app = firebase.app();
  }
  
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  export { db, auth };