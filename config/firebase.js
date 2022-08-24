import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
const config = {
  apiKey: "AIzaSyAtIgniFH_wbdDh2N3o5sF2AWBLXd_W8gY",
  
  authDomain: "portal-cliente-6cc75.firebaseapp.com",

  projectId: "portal-cliente-6cc75",

  storageBucket: "portal-cliente-6cc75.appspot.com",

  messagingSenderId: "1097253016818",

  appId: "1:1097253016818:web:854a5de9138835bd2e2c6b"
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
const firestore = firebase.firestore()

const auth = firebase.auth()

const storage = firebase.storage()

const provider = new firebase.auth.GoogleAuthProvider()

export { firebase, firestore, auth, storage, provider }
