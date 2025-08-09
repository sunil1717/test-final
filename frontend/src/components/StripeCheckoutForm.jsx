import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../utils/axiosInstance";
import useAuthStore from "../store/authStore";
import { useShopStore } from "../store/shopStore";




const StripeCheckoutForm = ({ amount,postcode,suburb,address ,onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();
  const phoneNumber = user?.phone || "";

    const {checkServiceArea } = useShopStore();
  

  
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if(!address || !postcode || !suburb){
      setErrorMessage("plz fill all details ")
      return;
    }

    const isServiceable = await checkServiceArea(postcode.trim(),suburb.trim());
     

    
    if (!isServiceable) {
      setErrorMessage(`Sorry, we currently do not serve this service area`);
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not loaded yet. Please try again.");
      return;
    }

    setLoading(true);

    try {
     
      const res = await axios.post("/api/stripe/create-payment-intent", {
        amount,
        phone: phoneNumber,
        postcode,
        suburb
       
      });

      const { clientSecret } = res.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            phone: phoneNumber,
          },
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", result.paymentIntent);
        onSuccess();
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Stripe error:", err);
      setErrorMessage(
        err.response?.data?.error || "Payment failed. Please check your details and try again."
      );
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      

      <CardElement className="border p-2 rounded"  options={{
              style: { base: { fontSize: '16px' } },
              hidePostalCode: true
            }} />

      {errorMessage && (
        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
