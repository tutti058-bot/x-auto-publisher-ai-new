import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTuv425V4UonFpuc6_vHi5Cmk1XUpakTM",
  authDomain: "ai-news-af3a1.firebaseapp.com",
  projectId: "ai-news-af3a1",
  storageBucket: "ai-news-af3a1.firebasestorage.app",
  messagingSenderId: "349375009777",
  appId: "1:349375009777:web:3cac336b20f74453d62a50"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export async function addView(id) {

  const ref = doc(db, "views", id);

  const snap = await getDoc(ref);

  if (snap.exists()) {

    await updateDoc(ref, {
      count: increment(1)
    });

  } else {

    await setDoc(ref, {
      count: 1
    });

  }

}

export async function getRanking() {

  const q = query(
    collection(db, "views"),
    orderBy("count", "desc"),
    limit(5)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}