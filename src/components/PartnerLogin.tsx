import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { setUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { setUserRole } from "../utils/userService";

const PartnerLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // @ts-ignore
  const [role, setRole] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      //   const userCredential = await signInWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );
      // const user = userCredential.user;
      const {
        user: { uid, refreshToken, providerData },
      } = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ refreshToken, ...providerData[0] }));
      localStorage.setItem(
        "user",
        JSON.stringify({ refreshToken, ...providerData[0] })
      );
      localStorage.setItem("uid", uid);
      // Check if user is a retailer
      const retailerDoc = await getDoc(doc(firestore, "retailers", uid));
      if (retailerDoc.exists()) {
        setRole("retailer");
        localStorage.setItem("userRole", "retailer");
        if (providerData[0]) setUserRole(providerData[0], "retailer");
        // navigate(`/retailerOrderPage?retailerId=${uid}`);
        navigate("/retailerOrderPage");
        return;
      }
      // Check if user is a retailer
      const deliveryDoc = await getDoc(doc(firestore, "deliveryBoys", uid));
      if (deliveryDoc.exists()) {
        setRole("dBoy");
        localStorage.setItem("userRole", "dBoy");
        if (providerData[0]) setUserRole(providerData[0], "dBoy");
        // navigate(`/deliveryOrderPage?deliveryId=${uid}`);
        navigate("/deliveryOrderPage");
        return;
      }
      setError("User not found. Please check your email and password.");
    } catch (error) {
      setError("Failed to log in. Please check your email and password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Partner's Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerLogin;
