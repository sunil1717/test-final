import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CheckCircle2 } from "lucide-react";

export default function OrderComplete() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white px-4  py-12  flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="text-red-600 w-16 h-16 mb-4" />
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h2>

        <p className="text-gray-600 max-w-md mb-2">
          Thank you for your booking. Our team will contact you shortly for confirmation and delivery details.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          You can view your booking status in the <span className="font-bold">Booking</span> section.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition hover:cursor-pointer"
        >
          Go to Home
        </button>
      </div>
    </>
  );
}
