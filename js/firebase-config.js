import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";

const firebaseConfig = {
	apiKey: "AIzaSyCni58nYfqke3dQ0YF85mUG0GelTXd4wbU",
	authDomain: "insta-web-48e44.firebaseapp.com",
	databaseURL: "https://insta-web-48e44-default-rtdb.firebaseio.com",
	projectId: "insta-web-48e44",
	storageBucket: "insta-web-48e44.appspot.com",
	messagingSenderId: "685569844225",
	appId: "1:685569844225:web:ee6d8428a9616b11f44c00",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, firestore, storage };
