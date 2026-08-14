//import firebase from './firebase';
import { initializeApp } from "firebase/app";
 
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
//-------------------------------------
import {
  getStorage as getStorageCar,
  ref as refCar,
  uploadBytes,
  getDownloadURL,
  getBytes,
} from "firebase/storage";
//----------------------------------
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC35BsoAbJoLKezwEWzsz2FDrAPwWSYq_k",
  authDomain: "worldjmp24.firebaseapp.com",
  databaseURL: "https://worldjmp24-default-rtdb.firebaseio.com",
  projectId: "worldjmp24",
  storageBucket: "worldjmp24.firebasestorage.app",
  messagingSenderId: "629045931558",
  appId: "1:629045931558:web:1d4100e21318b0dd0000e7"
};

// Initialize Firebase
export const appL = initializeApp(firebaseConfig);
export const auth = getAuth(appL);
export const db = getFirestore();
//export const dbw = writeBatch(getFirestore());
const storageCar = getStorageCar();
//console.log('valor storageCar a firebaseLoc = '+ storageCar);
export {storageCar };
//export function storageF() {  
//}
export async function registerNewUser(user) {
  try {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef, user.uid), user);
  } catch (e) {
    console.error("Error afagint document : ", e);
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
    console.error("Error afagint document: ", e);
  }
}

export async function fetchLinkData(uid) {
  const links = [];
  const q = query(collection(db, "links"), where("uid", "==", uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const link = { ...doc.data() };
    link.docId = doc.id;
    //console.log(doc.id, " => ", doc.data());
    console.log(link);
    links.push(link);
  });
  return links;
}

export async function insertNewLink(link) {
  try {
    const linksRef = collection(db, "links");
    const res = await addDoc(linksRef, link);
    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function existsUsername(username) {
  const users = [];
  const q = query(collection(db, "users"), where("username", "==", username));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    users.push(doc.data());
  });
  return users.length > 0 ? users[0].uid : null;
}

export async function getUserPublicProfileInfo(uid) {
  const profileInfo = await getUserInfo(uid);
  const linksInfo = await fetchLinkData(uid);
  return {
    profile: profileInfo,
    links: linksInfo,
  };
}

export async function getUserProfilePhoto(usernamePhoto) {
  // Create a child reference
  const imagesRef = refCar(storageCar, `images/${usernamePhoto}`);
  // imagesRef now points to 'images'
}
 /*
export async function llegirDirectori(directori){
  const storageRef = storage().ref().child(directori);
  storageRef.listAll().then((resultat) => {
    const urls = [];
    resultat.items.forEach((itemRef) => {
      itemRef.getDownloadURL().then((url) => {
        urls.push(url);
        setUrlsImatges([...urls]);
      });
    });
  });
}
 */
export async function setUserProfilePhoto(uid, file) {
  // Create a root reference
  
  const storage = getStorageCar();

  // Create a reference to 'mountains.jpg'
  //const mountainsRef = ref(storage, username);

  // Create a reference to 'images/mountains.jpg'
  const mountainImagesRef = refCar(storage, `images/${uid}`);

  // While the file names are the same, the references point to different files
  //mountainsRef.name === mountainImagesRef.name; // true
  //mountainsRef.fullPath === mountainImagesRef.fullPath; // false
  // 'file' comes from the Blob or File API
  const res = await uploadBytes(mountainImagesRef, file);
  //console.log("fitxer carregat ! ", res);
  return res;
}

export async function getProfilePhotoUrl(profilePicture) {
  const profileRef = refCar(storageCar, profilePicture);
 // console.log(profilePicture);

  /* const url = await getDownloadURL(
    ref(storage, "images/MBr3m7RbiWSlnskhZ94EZ9Vkh542")
  ); */
  const url = await getDownloadURL(profileRef);
  /* .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
      console.log("url", url);

      // Or inserted into an <img> element
      const img = document.getElementById("myimg");
      img.setAttribute("src", url);
    })
    .catch((error) => {
      // Handle any errors
    }); */
  //console.log({ url });
  return url;
}

export async function logoutFirebase() {
  await auth.signOut();
}

export async function deleteLink(docId) {
  await deleteDoc(doc(db, "links", docId));
}

export async function updateLink(docId, link) {
  const res = await setDoc(doc(db, "links", docId), link);
 // console.log("update link", docId, link, res);
}
 
