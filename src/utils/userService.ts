import { firestore } from "../../firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  providerId: string;
  photoURL: string | null;
}

export const getUserRole = async (uid: string): Promise<any> => {
  const userDoc = await getDoc(doc(firestore, "users", uid));
  return userDoc.exists() ? userDoc.data().role : "user";
  //   const userDocRef = doc(firestore, "users", uid);
  //   onSnapshot(userDocRef, (docSnapshot) => {
  //     const data = docSnapshot.data();
  //     return data?.role;
  //   });
};

export const setUserRole = async (user: User, userRole: string): Promise<string> => {
  const userDoc = await getDoc(doc(firestore, "users", user.uid));

  if (!userDoc.exists()) {
    await setDoc(
      doc(firestore, "users", user.uid),
      {
        email: user.email,
        role: userRole,
      }
      // ,
      // { merge: true }
    );
  }
  // const role = userDoc.exists() ? userDoc.data().role : "user"
  return userRole;
};
