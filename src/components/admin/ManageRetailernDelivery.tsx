import React, { useState, useEffect } from "react";
import {
  getRetailers,
  addRetailer,
  updateRetailer,
  deleteRetailer,
  getDeliveryBoys,
  addDeliveryBoy,
  updateDeliveryBoy,
  deleteDeliveryBoy,
} from "../../utils/adminService";
// import MapPicker from '../reusables/MapPicker';
// import useGeolocation from '../../utils/useGeolocation';

interface Retailer {
  id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  email: string;
}

interface DeliveryBoy {
  id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  email: string;
}

const AdminForm: React.FC = () => {
  // @ts-ignore
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [newRetailer, setNewRetailer] = useState<Retailer>({
    name: "",
    phoneNumber: "",
    address: "",
    location: location ? `${location.lat}','${location.lng}` : "",
    email: ""
  });
  const [newDeliveryBoy, setNewDeliveryBoy] = useState<DeliveryBoy>({
    name: "",
    phoneNumber: "",
    address: "",
    location: "",
    email: ""
  });
  const [editingRetailer, setEditingRetailer] = useState<string | null>(null);
  const [editingDeliveryBoy, setEditingDeliveryBoy] = useState<string | null>(
    null
  );
  // const { location: currentLocation, error } = useGeolocation();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedRetailers: any = await getRetailers();
      const fetchedDeliveryBoys: any = await getDeliveryBoys();
      setRetailers(fetchedRetailers);
      setDeliveryBoys(fetchedDeliveryBoys);
    };
    fetchData();
  }, []);

  const handleRetailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRetailer({ ...newRetailer, [name]: value });
  };

  const handleDeliveryBoyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDeliveryBoy({ ...newDeliveryBoy, [name]: value });
  };

  const handleRetailerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRetailer) {
      await updateRetailer(editingRetailer, newRetailer);
      setRetailers(
        retailers.map((r) =>
          r.id === editingRetailer ? { id: editingRetailer, ...newRetailer } : r
        )
      );
      setEditingRetailer(null);
    } else {
      const id = await addRetailer(newRetailer);
      setRetailers([...retailers, { id, ...newRetailer }]);
    }
    setNewRetailer({ name: "", phoneNumber: "", address: "", location: "", email: "" });
  };

  const handleDeliveryBoySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeliveryBoy) {
      await updateDeliveryBoy(editingDeliveryBoy, newDeliveryBoy);
      setDeliveryBoys(
        deliveryBoys.map((d) =>
          d.id === editingDeliveryBoy
            ? { id: editingDeliveryBoy, ...newDeliveryBoy }
            : d
        )
      );
      setEditingDeliveryBoy(null);
    } else {
      const id = await addDeliveryBoy(newDeliveryBoy);
      setDeliveryBoys([...deliveryBoys, { id, ...newDeliveryBoy }]);
    }
    setNewDeliveryBoy({ name: "", phoneNumber: "", address: "", location: "", email: "" });
  };

  const handleEditRetailer = (id: string) => {
    const retailer = retailers.find((r) => r.id === id);
    if (retailer) {
      setNewRetailer(retailer);
      setEditingRetailer(id);
    }
  };

  const handleEditDeliveryBoy = (id: string) => {
    const deliveryBoy = deliveryBoys.find((d) => d.id === id);
    if (deliveryBoy) {
      setNewDeliveryBoy(deliveryBoy);
      setEditingDeliveryBoy(id);
    }
  };

  const handleDeleteRetailer = async (id: string) => {
    await deleteRetailer(id);
    setRetailers(retailers.filter((r) => r.id !== id));
  };

  const handleDeleteDeliveryBoy = async (id: string) => {
    await deleteDeliveryBoy(id);
    setDeliveryBoys(deliveryBoys.filter((d) => d.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form
          onSubmit={handleRetailerSubmit}
          className="p-4 bg-gray-100 rounded"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingRetailer ? "Edit Retailer" : "Add Retailer"}
          </h2>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newRetailer.name}
              onChange={handleRetailerChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={newRetailer.phoneNumber}
              onChange={handleRetailerChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={newRetailer.address}
              onChange={handleRetailerChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={newRetailer.location}
              onChange={handleRetailerChange}
              className="p-2 border rounded w-full"
            />
          </div>
          {/* <MapPicker onLocationSelect={(setSelectedLocation)=> newRetailer.location = `${setSelectedLocation.lat}','${setSelectedLocation.lng}`} initialLocation={currentLocation} /> */}
          {/* <div>
            <label>
              Location:
              <MapPicker onLocationSelect={setLocation} initialLocation={location} />
            </label>
          </div>
          {location && (
            <div className="mt-4">
              <label>
                Selected Location: Latitude {location.lat}, Longitude {location.lng}
              </label>
            </div>
          )} */}

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {editingRetailer ? "Update Retailer" : "Add Retailer"}
          </button>
        </form>

        <form
          onSubmit={handleDeliveryBoySubmit}
          className="p-4 bg-gray-100 rounded"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingDeliveryBoy ? "Edit Delivery Boy" : "Add Delivery Boy"}
          </h2>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newDeliveryBoy.name}
              onChange={handleDeliveryBoyChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={newDeliveryBoy.phoneNumber}
              onChange={handleDeliveryBoyChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={newDeliveryBoy.address}
              onChange={handleDeliveryBoyChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={newDeliveryBoy.location}
              onChange={handleDeliveryBoyChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {editingDeliveryBoy ? "Update Delivery Boy" : "Add Delivery Boy"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Retailers</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-center">Name</th>
              <th className="py-2 text-center">Email</th>
              <th className="py-2 text-center">Phone Number</th>
              <th className="py-2 text-center">Address</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {retailers.map((retailer) => (
              <tr key={retailer.id} className="border-b">
                <td className="py-2 text-center">{retailer.name}</td>
                <td className="py-2 text-center">{retailer.email}</td>
                <td className="py-2 text-center">{retailer.phoneNumber}</td>
                <td className="py-2 text-center">{retailer.address}</td>
                <td className="py-2 text-center">
                  <button
                    onClick={() => handleEditRetailer(retailer.id!)}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRetailer(retailer.id!)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Delivery Boys</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-center">Name</th>
              <th className="py-2 text-center">Email</th>
              <th className="py-2 text-center">Phone Number</th>
              <th className="py-2 text-center">Address</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.map((deliveryBoy) => (
              <tr key={deliveryBoy.id} className="border-b">
                <td className="py-2 text-center">{deliveryBoy.name}</td>
                <td className="py-2 text-center">{deliveryBoy.email}</td>
                <td className="py-2 text-center">{deliveryBoy.phoneNumber}</td>
                <td className="py-2 text-center">{deliveryBoy.address}</td>
                <td className="py-2 text-center">
                  <button
                    onClick={() => handleEditDeliveryBoy(deliveryBoy.id!)}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDeliveryBoy(deliveryBoy.id!)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminForm;
