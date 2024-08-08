import { firestore } from '../../firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    phoneNumber: string | null;
    providerId: string;
    photoURL: string | null;
}

export const getUserRole = async (uid: string): Promise<string> => {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    return userDoc.exists() ? userDoc.data().role : 'user';
};

export const setUserRole = async (user: User): Promise<void> => {
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));

    if (!userDoc.exists()) {
        await setDoc(doc(firestore, 'users', user.uid), {
            email: user.email,
            role: 'user',
        }
            // ,
            // { merge: true }
        );
    }
};