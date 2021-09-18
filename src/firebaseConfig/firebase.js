import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
	apiKey: "AIzaSyA4czn5Vv3uttuCYLYolEmmX7M43uUC6qM",
	authDomain: "angry-chat-49e27.firebaseapp.com",
	projectId: "angry-chat-49e27",
	storageBucket: "angry-chat-49e27.appspot.com",
	messagingSenderId: "14725735952",
	appId: "1:14725735952:web:30f97436220249f9780c95",
	measurementId: "G-4ENBHDJDBY",
};
if (!firebase.apps.length) {
	firebase.initializeApp({ ...firebaseConfig });
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
