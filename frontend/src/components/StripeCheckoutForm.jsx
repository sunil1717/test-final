import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../utils/axiosInstance";
import useAuthStore from "../store/authStore"; // import auth store

const StripeCheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore(); // get logged-in user
  const phoneNumber = user?.phone || "";

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not loaded yet. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/stripe/create-payment-intent", {
        amount,
        phone: phoneNumber, // pass phone to backend for metadata 
      });

      const { clientSecret } = res.data;
      

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            phone: phoneNumber, //  attach to billing details
         
          },
        },
      });

      if (result.error) {
        console.error(" Payment failed:", result.error.message);
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log(" Payment succeeded:", result.paymentIntent);
        onSuccess(); // Proceed to booking
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(" Stripe error:", err);
      setErrorMessage("Payment failed. Please check your details and try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      {errorMessage && (
        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
