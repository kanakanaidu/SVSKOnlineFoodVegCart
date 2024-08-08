import { CartItem } from "./slices/cartSlice";

export interface Location {
    lat: number;
    lng: number;
}

export interface Retailer {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    location: string; // "latitude,longitude" format
    status: 'pending' | 'approved' | 'rejected';
    remarks?: string;
}

export interface DeliveryBoy {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    location: string; // "latitude,longitude" format
    status: 'pending' | 'approved' | 'rejected';
    remarks?: string;
}

export interface OrderItem {
    itemName: string;
    quantity: string;
    price: string;
}

export interface Order {
    id?: string; // Optional because Firestore will generate an ID
    customerName: string;
    customerEmail: string;
    address: string;
    orderItems: CartItem[];
    orderValue: string;
    status: 'pending' | 'delivered' | 'cancelled' | string;
    location?: Location; // "latitude,longitude" format
    retailerId?: string;
    deliveryBoyId?: string;
    remarks?: string;
}
