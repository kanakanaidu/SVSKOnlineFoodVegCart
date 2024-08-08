import { useEffect, useState } from "react";
import { cancelOrder, getOrdersForUser } from "../utils/orderService";
import { Order } from "../store/types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const OrderList: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (user?.email) {
                    const fetchedOrders = await getOrdersForUser(user.email);
                    setOrders(fetchedOrders);
                }
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // const handleCancel = async (orderId: string) => {
    //     const confirmed = window.confirm('Are you sure you want to cancel this order?');
    //     if (confirmed) {
    //         try {
    //             await cancelOrder(orderId);
    //             setOrders(orders.map(order =>
    //                 order.id === orderId ? { ...order, status: 'cancelled' } : order
    //             ));
    //         } catch (err) {
    //             console.error('Failed to cancel order', err);
    //         }
    //     }
    // };
    const handleCancel = async () => {
        if (selectedOrderId && cancellationReason.trim()) {
            try {
                await cancelOrder(selectedOrderId, cancellationReason);
                setOrders(orders.map(order =>
                    order.id === selectedOrderId ? { ...order, status: 'cancelled', cancellationReason } : order
                ));
                setShowModal(false);
                setSelectedOrderId(null);
                setCancellationReason('');
            } catch (err) {
                console.error('Failed to cancel order', err);
            }
        }
    };
    const openModal = (orderId: any) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrderId(null);
        setCancellationReason('');
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        const sortedOrders = [...orders].sort((a, b) => {
            if (a.status < b.status) return newSortOrder === 'asc' ? -1 : 1;
            if (a.status > b.status) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setOrders(sortedOrders);
    };

    const filteredOrders = statusFilter === 'all' ? orders : orders.filter(order => (order.status === statusFilter && order.customerEmail === user?.email));

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Order List</h1>
                <label className="flex items-center">
                    <span className="mr-2">Filter by status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="ml-2 p-2 border rounded"
                    >
                        <option value="all">All</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </label>
            </div>
            <div className="flex flex-col border rounded-lg overflow-hidden">
                <div className="flex bg-gray-800 text-white p-2">
                    <div className="flex-1 p-2">Order ID</div>
                    <div className="flex-1 p-2">Customer Name</div>
                    <div className="flex-1 p-2">Address</div>
                    <div className="flex-1 p-2">Items</div>
                    <div className="flex-1 p-2">Order Value</div>
                    <div className="flex-1 p-2 cursor-pointer" onClick={handleSort}>
                        Status {sortOrder === 'asc' ? '↑' : '↓'}
                    </div>
                </div>
                {filteredOrders.map((order) => (
                    <div key={order.id} className="flex even:bg-gray-100 p-2">
                        <div className="flex-1 p-2">{order.id}</div>
                        <div className="flex-1 p-2">{order.customerName}</div>
                        <div className="flex-1 p-2">{order.address}</div>
                        <div className="flex-1 p-2">
                            <ul>
                                {order.orderItems.map((item, index) => (
                                    <li key={index}>
                                        {item.title} (Qty: {item.qty}, Price: ${item.price})
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 p-2">{order.orderValue}</div>
                        <div className="flex-1 p-2">{order.status}
                            {order.status === 'pending' && (
                                <button
                                    onClick={() => openModal(order.id)}
                                    className="ml-2 p-1 bg-red-500 text-white rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
                        <textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter cancellation reason"
                        />
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="p-2 bg-gray-500 text-white rounded mr-2">Close</button>
                            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;