// components/ComingSoon.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/reusables/CountdownTimer";

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const targetDate = new Date("2024-08-15T09:00:00");

  const handleSecretButtonClick = () => {
    navigate("/Home");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-saffron-600 via-white to-green-600 text-center">
      {/* <h1 className="text-6xl font-bold mb-4">Lepakshi Online Kirana Store</h1> */}
      <h1 className="text-6xl font-bold mb-4 text-orange-500">
        Coming Soon...
      </h1>

      {/* Display the Indian flag GIF image */}
      {/* <div className="flex gap-4 mb-8">
        <img src="../../public/images/indian-flag.gif" alt="Indian Flag" className="w-64 h-64" />
        <img src="../../public/images/independence-day-india-gifs.gif" alt="Indian Flag" className="w-64 h-64" />
      </div> */}
      {/* Container for images with relative positioning */}
      <div className="relative flex items-center justify-center mb-8">
        {/* First GIF */}
        <img src="/images/indian-flag.gif" alt="Indian Flag" className="w-48 h-48" />
        {/* Second GIF with absolute positioning to overlap */}
        <img
          src="/images/indian-flag2.gif"
          alt="Indian Flag2"
          className="absolute w-36 h-36 top-24 left-24"
        />
      </div>

      <p className="text-2xl mb-8 text-blue-500">
        We're launching on August 15th, 9 AM
      </p>
      <CountdownTimer targetDate={targetDate} />
      <button
        onClick={handleSecretButtonClick}
        className="mt-8 p-2 bg-transparent border-none text-lg text-white"
        style={{ opacity: 0 }}
      >
        Secret Button
      </button>
    </div>
  );
};

export default ComingSoon;
