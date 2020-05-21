import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";

//This will be provided by firebase during setup :)
var firebaseConfig = {
  apiKey: "your_firebase_project_api_key",
  authDomain: "your_firebase_project_authDomain",
  databaseURL: "your_firebase_project_authDomain",
  projectId: "your_firebase_project_projectId",
  storageBucket: "your_firebase_project_storageBucket",
  messagingSenderId: "your_firebase_project_messagingSenderId",
  appId: "your_firebase_project_appId",
  measurementId: "your_firebase_project_measurementId",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore_fieldvalue = firebase.firestore.FieldValue;
export const fire_auth = firebase.auth();
export const fire_store = firebase.firestore();
export const fire_storage = firebase.storage();
export const fire_analytics = firebase.analytics();
