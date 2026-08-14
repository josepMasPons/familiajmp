import { initializeApp } from "firebase/app";

// ------------------- FIRESTORE ---------------------
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc
} from "firebase/firestore";

// ------------------- STORAGE -----------------------
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
  listAll
} from "firebase/storage";

// ------------------- AUTH --------------------------
import { getAuth } from "firebase/auth";

// ------------------- CONFIG ------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC35BsoAbJoLKezwEWzsz2FDrAPwWSYq_k",
  authDomain: "worldjmp24.firebaseapp.com",
  databaseURL: "https://worldjmp24-default-rtdb.firebaseio.com",
  projectId: "worldjmp24",
  storageBucket: "worldjmp24.appspot.com", // << CORREGIT!
  messagingSenderId: "629045931558",
  appId: "1:629045931558:web:1d4100e21318b0dd0000e7"
};

// ------------------- INIT ---------------------------
export const appL = initializeApp(firebaseConfig);

export const auth = getAuth(appL);

export const db = getFirestore(appL);

export const storageCar = getStorage(appL);

// ------------------- USERS --------------------------
export async function registerNewUser(user) {
  try {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef, user.uid), user);
  } catch (e) {
    console.error("Error afegint document:", e);
  }
}

export async function getUserInfo(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function userExists(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function updateUser(user) {
  try {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef, user.uid), user);
  } catch (e) {
    console.error("Error actualitzant usuari:", e);
  }
}

// ------------------- LINKS --------------------------
export async function fetchLinkData(uid) {
  const links = [];
  const q = query(collection(db, "links"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((item) => {
    const link = { ...item.data(), docId: item.id };
    links.push(link);
  });

  return links;
}

export async function insertNewLink(link) {
  try {
    const linksRef = collection(db, "links");
    return await addDoc(linksRef, link);
  } catch (e) {
    console.error("Error afegint enllaç:", e);
  }
}

export async function existsUsername(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty ? null : querySnapshot.docs[0].data().uid;
}

export async function getUserPublicProfileInfo(uid) {
  return {
    profile: await getUserInfo(uid),
    links: await fetchLinkData(uid)
  };
}

// ------------------- STORAGE (PHOTOS) ----------------
export async function getUserProfilePhoto(usernamePhoto) {
  const imgRef = ref(storageCar, `images/${usernamePhoto}`);
  return await getDownloadURL(imgRef);
}

export async function setUserProfilePhoto(uid, file) {
  const imgRef = ref(storageCar, `images/${uid}`);
  return await uploadBytes(imgRef, file);
}

export async function getProfilePhotoUrl(path) {
  const imgRef = ref(storageCar, path);
  return await getDownloadURL(imgRef);
}

// ------------------- AUTH ----------------------------
export async function logoutFirebase() {
  await auth.signOut();
}

// ------------------- LINKS CRUD ----------------------
export async function deleteLink(docId) {
  await deleteDoc(doc(db, "links", docId));
}

export async function updateLink(docId, link) {
  return await setDoc(doc(db, "links", docId), link);
}
