import React, { useEffect, useState } from "react";
import { Order } from "../store/types";
import { getDeliveryOrders, updateOrderStatus } from "../utils/orderService";

const DeliveryOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = new URLSearchParams(location.search);
  const deliveryId = searchParams.get("deliveryId");

  useEffect(() => {
    const fetchOrders = async () => {
      if (deliveryId) {
        try {
          const ordersRet = await getDeliveryOrders(deliveryId);
          setOrders(ordersRet);
          setLoading(false);
        } catch (error) {
          setError("Failed to fetch orders");
          setLoading(false);
        }
      }
      setError(`${deliveryId} deliveryId is not correct. please try again.`);
      setLoading(false);
    };

    fetchOrders();
  }, [deliveryId]);

  const handleStatusChange = async (orderId: any, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      // setOrders(orders.map(order =>
      //     order.id === orderId ? { ...order, status: 'cancelled' } : order
      // ));
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Orders</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Customer Name</th>
            <th className="py-2">Items</th>
            <th className="py-2">Quantity</th>
            <th className="py-2">Price</th>
            <th className="py-2">Status</th>
            <th className="py-2">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2">{order.customerName}</td>
              <td className="py-2">{order.orderItems.join(", ")}</td>
              <td className="py-2">{order.orderItems.join(", ")}</td>
              <td className="py-2">₹ {order.orderValue}</td>
              <td className="py-2">{order.status}</td>
              <td className="py-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="pending">Out for Delivery</option>
                  <option value="completed">Delivered at Home</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryOrderPage;
