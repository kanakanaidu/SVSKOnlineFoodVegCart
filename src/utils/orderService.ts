import { collection, addDoc, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { Order } from '../store/types';

export const calculateDeliveryCharge = (orderAmount: number): number => {
  if (orderAmount > 3000) return 0;  // Free delivery for orders over 3000
  if (orderAmount > 500) return 100; // Delivery charge of 100 for orders up to 3000
  if (orderAmount > 100) return 50;  // Delivery charge of 50 for orders up to 500
  return 10;                          // Delivery charge of 10 for orders below 100
};

export const addOrder = async (order: Order) => {
  try {
    const docRef = await addDoc(collection(firestore, 'orders'), order);
    console.log('Order added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding order: ', e);
  }
};

export const getOrdersForUser = async (uEmail: string) => {
  const orders: Order[] = [];
  const ordersRef = collection(firestore, 'orders');
  const q = query(ordersRef, where('customerEmail', '==', uEmail));
  const querySnapshot = await getDocs(q);

  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  for (const docSnapshot of querySnapshot.docs) {
    const orderData = docSnapshot.data();
    orders.push({
      id: docSnapshot.id, // Add the ID to the order for identification
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      orderItems: orderData.orderItems,
      orderValue: orderData.orderValue,
      status: orderData.status,
      location: orderData.location
    });

  }
  return orders;
};

export const getOrders = async (): Promise<Order[]> => {
  const orders: Order[] = [];
  const querySnapshot = await getDocs(collection(firestore, 'orders'));
  for (const docSnapshot of querySnapshot.docs) {
    const orderData = docSnapshot.data();
    // const itemsSnapshot = await getDocs(collection(docSnapshot.ref, 'orderItems'));
    // const items: CartItem[] = itemsSnapshot.docs.map((itemDoc) => itemDoc.data() as CartItem);

    orders.push({
      id: docSnapshot.id, // Add the ID to the order for identification
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      orderItems: orderData.orderItems,
      orderValue: orderData.orderValue,
      status: orderData.status,
      location: orderData.location,
      retailerId: orderData.retailerId,
      deliveryBoyId: orderData.deliveryBoyId
    });

  }
  return orders;
};

export const updateOrder = async (id: string, data: any) => {
  try {
    const docRef = doc(firestore, 'orders', id); // Ensure correct document reference
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId: string, reason: string): Promise<void> => {
  const orderRef = doc(firestore, 'orders', orderId);
  await updateDoc(orderRef, {
    status: 'cancelled',
    remarks: reason,
  });
};

export const getRetailerOrders = async (retailerId: string) => {
  const orders: Order[] = [];
  const q = query(collection(firestore, "orders"), where("retailerId", "==", retailerId));
  const querySnapshot = await getDocs(q);
  for (const docSnapshot of querySnapshot.docs) {
    const orderData = docSnapshot.data();
    orders.push({
      id: docSnapshot.id, // Add the ID to the order for identification
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      orderItems: orderData.orderItems,
      orderValue: orderData.orderValue,
      status: orderData.status,
      location: orderData.location,
      retailerId: orderData.retailerId,
      deliveryBoyId: orderData.deliveryBoyId
    });
  }
  return orders;
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeliveryOrders = async (deliveryId: string) => {
  const orders: Order[] = [];
  const q = query(collection(firestore, "orders"), where("deliveryId", "==", deliveryId));
  const querySnapshot = await getDocs(q);
  for (const docSnapshot of querySnapshot.docs) {
    const orderData = docSnapshot.data();
    orders.push({
      id: docSnapshot.id, // Add the ID to the order for identification
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      orderItems: orderData.orderItems,
      orderValue: orderData.orderValue,
      status: orderData.status,
      location: orderData.location,
      retailerId: orderData.retailerId,
      deliveryBoyId: orderData.deliveryBoyId
    });
  }
  return orders;
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(firestore, "orders", orderId);
  await updateDoc(orderRef, { status: status });
};