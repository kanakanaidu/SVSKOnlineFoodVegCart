import { useEffect, useState } from "react";
import { DeliveryBoy, Retailer } from "../../store/types";
import { firestore } from "../../../firebase.config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const AdminPartners: React.FC = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDB, setShowModalDB] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [selectedRetailerId, setSelectedRetailerId] = useState<string | null>(null);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [selectedDBId, setSelectedDBId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetailers = async () => {
      const querySnapshot = await getDocs(collection(firestore, "retailers"));
      const pendingRetailers = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Retailer))
        .filter((retailer) => retailer.status === "approved");
      setRetailers(pendingRetailers);
      setLoading(false);
    };

    const fetchDeliveryBoys = async () => {
      const querySnapshot = await getDocs(collection(firestore, "deliveryBoys"));
      const pendingDeliveryBoys = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as DeliveryBoy))
        .filter((dBoy) => dBoy.status === "approved");
      setDeliveryBoys(pendingDeliveryBoys);
      setLoading(false);
    };

    fetchDeliveryBoys();
    fetchRetailers();
  }, []);

  const handleApproval = async (id: any, status: string) => {
    const retailerRef = doc(firestore, "retailers", id);
    await updateDoc(retailerRef, { status });
    setRetailers((prevRetailers) =>
      prevRetailers.filter((retailer) => retailer.id !== id)
    );
  };

  const handleRejection = async () => {
    if (selectedRetailerId && rejectReason.trim()) {
      const retailerRef = doc(firestore, "retailers", selectedRetailerId);
      await updateDoc(retailerRef, { status: "blocked", remarks: rejectReason });
      setRetailers((prevRetailers) =>
        prevRetailers.filter((retailer) => retailer.id !== selectedRetailerId)
      );
      setShowModal(false);
      setSelectedRetailerId(null);
      setRejectReason('');
    }
  };

  const openModal = (retailerId: any) => {
    setSelectedRetailerId(retailerId);
    handleRejection();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRetailerId(null);
    setRejectReason('');
  };

  const handleApprovalDB = async (id: any, status: string) => {
    const dBoyRef = doc(firestore, "deliveryBoys", id);
    await updateDoc(dBoyRef, { status });
    setDeliveryBoys((prevDeliveryBoys) =>
      prevDeliveryBoys.filter((dBoy) => dBoy.id !== id)
    );
  };

  const handleRejectionDB = async () => {
    if (selectedDBId && rejectReason.trim()) {
      const dBoyRef = doc(firestore, "deliveryBoys", selectedDBId);
      await updateDoc(dBoyRef, { status: "blocked", remarks: rejectReason });
      setDeliveryBoys((prevDeliveryBoys) =>
        prevDeliveryBoys.filter((dBoy) => dBoy.id !== selectedDBId)
      );
      setShowModalDB(false);
      setSelectedDBId(null);
      setRejectReason('');
    }
  };

  const openModalDB = (dBoyId: any ) => {
    setSelectedDBId(dBoyId);
    handleRejectionDB();
    setShowModalDB(true);
  };

  const closeModalDB = () => {
    setShowModalDB(false);
    setSelectedDBId(null);
    setRejectReason('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <><div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Retailer's Requests</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Aadhar</th>
            <th className="py-2">Address</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {retailers.length > 0 && retailers.map((retailer) => (
            <tr key={retailer.id}>
              <td className="py-2">{retailer.id}</td>
              <td className="py-2">{retailer.name}</td>
              <td className="py-2">{retailer.email}</td>
              <td className="py-2">{retailer.phoneNumber}</td>
              <td className="py-2">{retailer.identity}</td>
              <td className="py-2">{retailer.address}</td>
              <td className="py-2">
                <button
                  onClick={() => handleApproval(retailer.id, "reactivated")}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Reactivate
                </button>
                <button
                  onClick={() => openModal(retailer.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Block
                </button>
              </td>
            </tr>
          ))}
          {retailers.length <= 0 && (<tr>
            <td className="text-center" colSpan={7}>
              <h1 className="font-bold mb-4 text-rose-500">no requests pending for approval</h1>
            </td>
          </tr>)}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Reject Retailer</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter reject reason" />
            <div className="flex justify-end">
              <button onClick={closeModal} className="p-2 bg-gray-500 text-white rounded mr-2">Close</button>
              <button onClick={handleRejection} className="p-2 bg-red-500 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Delivery Boy's Requests</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Aadhar</th>
              <th className="py-2">Address</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.length > 0 && deliveryBoys.map((dBoy) => (
              <tr key={dBoy.id}>
                <td className="py-2">{dBoy.id}</td>
                <td className="py-2">{dBoy.name}</td>
                <td className="py-2">{dBoy.email}</td>
                <td className="py-2">{dBoy.phoneNumber}</td>
                <td className="py-2">{dBoy.identity}</td>
                <td className="py-2">{dBoy.address}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleApprovalDB(dBoy.id, "reactivated")}
                    className="bg-green-500 text-white p-2 rounded mr-2"
                  >
                    Reactivate
                  </button>
                  <button
                    onClick={() => openModalDB(dBoy.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Block
                  </button>
                </td>
              </tr>
            ))}
            {deliveryBoys.length <= 0 && (<tr>
              <td className="text-center" colSpan={7}>
                <h1 className="font-bold mb-4 text-rose-500">no requests pending for approval</h1>
              </td>
            </tr>)}
          </tbody>
        </table>
        {showModalDB && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Reject DeliveryBoy</h2>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter reject reason" />
              <div className="flex justify-end">
                <button onClick={closeModalDB} className="p-2 bg-gray-500 text-white rounded mr-2">Close</button>
                <button onClick={handleRejectionDB} className="p-2 bg-red-500 text-white rounded">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div></>
  );
};

export default AdminPartners;