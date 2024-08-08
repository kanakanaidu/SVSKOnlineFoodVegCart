import React, { useState, useEffect } from 'react';
import { getRetailers, getDeliveryBoys } from '../../utils/adminService';
import { getOrders, updateOrder } from '../../utils/orderService'; // You'll need to create this service
import { Retailer, DeliveryBoy, Order } from '../../store/types'; // Define appropriate types for your data
import { notifyError, notifySuccess } from '../../utils/NotificationManager';

const OrderProcessing: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOrders = await getOrders();
      const fetchedRetailers = await getRetailers();
      const fetchedDeliveryBoys = await getDeliveryBoys();
      setOrders(fetchedOrders);
      setRetailers(fetchedRetailers);
      setDeliveryBoys(fetchedDeliveryBoys);
    };
    fetchData();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const getNearestEntities = (orderLocation: string, entities: (Retailer | DeliveryBoy)[]) => {
    // const [orderLat, orderLon] = orderLocation.split(',').map(Number);
    // const [orderLat, orderLon] = orderLocation ? JSON.parse(orderLocation) : null;
    const ordLoc = JSON.stringify(orderLocation);
    const orderLoc = JSON.parse(ordLoc);
    return entities
      .map(entity => {
        // const [entityLat, entityLon] = entity.location.split(',').map(Number);
        const entLoc = JSON.stringify(entity.location);
        const entityLoc = JSON.parse(entLoc);
        const distance = calculateDistance(orderLoc.lat, orderLoc.lng, entityLoc.lat, entityLoc.lng);
        return { ...entity, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  };

  const handleAssign = async (orderId: string, retailerId: string, deliveryBoyId: string, fbUpdate: boolean) => {
    try {
      setOrders(orders.map(order => order.id === orderId ? { ...order, retailerId, deliveryBoyId } : order));
      if (fbUpdate) {
        await updateOrder(orderId, { retailerId, deliveryBoyId });
        notifySuccess('Order has been assigned to Retailer and Delivery Boy!!!');
      }
    } catch (error) {
      console.error("Error assigning retailer and delivery boy:", error);
      notifyError("Error assigning retailer and delivery boy: "+error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Processing</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Retailer</th>
            <th className="py-2">Delivery Boy</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const nearestRetailers = order.location ? getNearestEntities(order.location, retailers) : [];
            const nearestDeliveryBoys = order.location ? getNearestEntities(order.location, deliveryBoys) : [];

            return (
              <tr key={order.id} className="border-b">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.customerName}</td>
                <td className="py-2">
                  <select
                    value={order.retailerId || ''}
                    onChange={(e) => handleAssign(order.id, e.target.value, order.deliveryBoyId || '', false)}
                    className="p-2 border rounded w-full"
                  >
                    <option value="">Select Retailer</option>
                    {nearestRetailers.map(retailer => (
                      <option key={retailer.id} value={retailer.id}>
                        {retailer.name} ({retailer.distance.toFixed(2)} km)
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <select
                    value={order.deliveryBoyId || ''}
                    onChange={(e) => handleAssign(order.id, order.retailerId || '', e.target.value, false)}
                    className="p-2 border rounded w-full"
                  >
                    <option value="">Select Delivery Boy</option>
                    {nearestDeliveryBoys.map(deliveryBoy => (
                      <option key={deliveryBoy.id} value={deliveryBoy.id}>
                        {deliveryBoy.name} ({deliveryBoy.distance.toFixed(2)} km)
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleAssign(order.id, order.retailerId || '', order.deliveryBoyId || '', true)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderProcessing;
