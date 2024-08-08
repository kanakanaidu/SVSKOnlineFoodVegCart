import { firestore } from '../../firebase.config'; // Adjust the path to your firebase config
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const retailersCollection = collection(firestore, 'retailers');
const deliveryBoysCollection = collection(firestore, 'deliveryBoys');

export const getRetailers = async () => {
  const snapshot = await getDocs(retailersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addRetailer = async (retailer: any) => {
  const docRef = await addDoc(retailersCollection, retailer);
  return docRef.id;
};

export const updateRetailer = async (id: string, retailer: any) => {
  const docRef = doc(retailersCollection, id);
  await updateDoc(docRef, retailer);
};

export const deleteRetailer = async (id: string) => {
  const docRef = doc(retailersCollection, id);
  await deleteDoc(docRef);
};

export const getDeliveryBoys = async () => {
  const snapshot = await getDocs(deliveryBoysCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addDeliveryBoy = async (deliveryBoy: any) => {
  const docRef = await addDoc(deliveryBoysCollection, deliveryBoy);
  return docRef.id;
};

export const updateDeliveryBoy = async (id: string, deliveryBoy: any) => {
  const docRef = doc(deliveryBoysCollection, id);
  await updateDoc(docRef, deliveryBoy);
};

export const deleteDeliveryBoy = async (id: string) => {
  const docRef = doc(deliveryBoysCollection, id);
  await deleteDoc(docRef);
};