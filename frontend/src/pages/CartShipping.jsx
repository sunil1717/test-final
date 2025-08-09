import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useShopStore } from "../store/shopStore";

const CartShipping = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useShopStore();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.tyre.price * item.quantity,
    0
  );
  const shipping = subtotal >= 150 ? 0: 10;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-22 sm:mt-30 bg-white  p-4 sm:p-6 md:p-8">
        <div className="flex justify-center items-center space-x-3 mb-8">
          <div className="text-red-700 font-medium">1. Shopping Cart</div>
          <span className="text-gray-400">—</span>
          <div className="text-gray-400 font-semibold">2. Checkout</div>
          <span className="text-gray-400">—</span>
          <div className="text-gray-400">3. Order Complete</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Cart Summary */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Shipping Summary</h2>
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.tyre.brand} - {item.tyre.model}</p>
                      <p className="text-sm text-gray-500">
                        {item.tyre.width}/{item.tyre.profile}R{item.tyre.rimSize}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.tyre.price}
                      </p>
                    </div>
                    <p className="font-semibold text-red-500">
                      ${(item.quantity * item.tyre.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Price Summary */}
          <div className="bg-white border rounded-lg p-5 shadow-sm h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${(shipping).toFixed(2)}</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${(total).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full hover:cursor-pointer"
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartShipping;
