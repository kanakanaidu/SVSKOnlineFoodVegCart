// RetailerRegistration.tsx
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase.config";
import useGeolocation from "../utils/useGeolocation";
import MapPicker from "../components/reusables/MapPicker";
import { v4 as uuidv4 } from "uuid"; // for generating a unique password
import { createUserWithEmailAndPassword } from "firebase/auth";
import sendWhatsApp from "../utils/sendMessage";
import { toast } from "react-toastify";

const RetailerRegistration: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const { location: currentLocation } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const password = uuidv4().slice(0, 8); // generate an 8-character password
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Create a reference to the document with the user ID as the document ID
      const docRef = doc(firestore, "retailers", user.uid);
      await setDoc(docRef, {
        id: user.uid,
        name,
        email,
        phoneNumber: phone,
        address,
        location: selectedLocation,
        status: "pending",
        password,
      });
      // await addDoc(collection(firestore, "retailers", user.uid), {
      //     id: user.uid,
      //     name,
      //     email,
      //     phoneNumber: phone,
      //     address,
      //     location: selectedLocation,
      //     status: "pending",
      //     password
      // });
      toast.success("Registration submitted 😀, awaiting approval.");
      // const whatsappMessage = `Hello ${name},\nYour account has been created.\nEmail: ${email}\nPassword: password will be shared once admin approved your account.`;
      const whatsappMessage = `Hello ${name},\nYour account has been created.\nEmail: ${email}\nPassword: ${password}\nAccount Type: Retailer`;
      // const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      // setMessage(`Retailer created successfully! Share the login details: ${whatsappLink}`);
      await sendWhatsApp(phone, whatsappMessage);

      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error submitting registration", error, "🙄");
      toast.error(`Error submitting registration: ${error} 🙄`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Retailer Registration
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:{" "}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email:{" "}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone:{" "}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address:{" "}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location:{" "}
          </label>
          <MapPicker
            onLocationSelect={setSelectedLocation}
            initialLocation={currentLocation}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RetailerRegistration;
