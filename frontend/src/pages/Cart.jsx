import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useShopStore } from "../store/shopStore";
import { ArrowLeft } from "lucide-react";

const Cart = () => {
  const {
    cart,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useShopStore();

  const navigate = useNavigate();
  const [loadingItemId, setLoadingItemId] = useState(null);


  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (tyreId, newQty, tyre) => {
    if (newQty >= 1 && newQty <= 5) {
      const priceKey = `Price for ${newQty}`;
      const updatedPrice = tyre[priceKey] || tyre.price;

      setLoadingItemId(tyreId);
      try {
        updateCartItem(tyreId, newQty, updatedPrice);
      } finally {
        setTimeout(() => setLoadingItemId(null), 400);
      }


    }
  };

  const handleRemoveItem = (tyreId) => {
    if (window.confirm("Remove this item from cart?")) {
      removeFromCart(tyreId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      clearCart();
    }
  };

  const total = (cart || []).reduce(
    (acc, item) => acc + item.tyre.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      

     
         
     
     

      <div className="min-h-screen mt-15 sm:mt-30 bg-white flex justify-center pt-2 ">

        <div className="bg-white w-full pl-2 pr-2  rounded-lg shadow-lg">
          {loadingItemId && (
            <div className="w-full h-1 bg-gray-200 overflow-hidden mb-1 ">
              <div className="h-full bg-red-600 animate-progress"></div>
            </div>
          )}
           <button
        onClick={() => navigate("/")}
        className=" top-6 left-1 mb-3 mt-2 text-gray-700  hover:text-red-600 flex items-center gap-1"
      >
        
        <ArrowLeft size={20} />
        <span className="text-sm sm:text-base">Home</span>
      </button>
          


          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Your Cart{" "}
              <span className="text-gray-500">({cart?.length || 0})</span>
            </h2>
            {cart?.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-sm pr-2 text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {(cart || []).length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="border-b pb-4 mb-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.tyre.image}
                      alt=""
                      className="h-20 w-20 object-contain border border-gray-300 rounded"
                    />
                    <div>
                      <p className="text-lg font-semibold text-red-700">
                        {item.tyre.brand} - {item.tyre.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.tyre.width}/{item.tyre.profile}R{item.tyre.rimSize}
                      </p>
                      <p className="text-sm  text-gray-500">
                        ${item.tyre.price} x {item.quantity}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const isSelected = item.quantity === num;
                          return (
                            <button
                              key={num}
                              onClick={() => handleQuantityChange(item._id, num, item.tyre)}
                              className={`w-8 h-8 rounded border border-gray-400 text-sm font-semibold transition
          ${isSelected ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"}
          hover:bg-red-500 hover:text-white`}
                            >
                              {num}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="ml-4 text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg font-semibold">
                    ${(item.quantity * item.tyre.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="border-t mt-6 pt-4 flex justify-between text-xl font-semibold">
            <span>Total</span>
            <span className="text-red-500">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/shipping")}
              className="mt-6 w-64 mx-auto bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-bold text-lg hover:cursor-pointer"
              disabled={cart.length === 0}
            >
              Proceed to Shipping
            </button>
          </div>
        </div>
      </div>






      <style>
        {`
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-progress {
    animation: progress 0.8s ease-in-out infinite;
  }
`}
      </style>





    </>
  );
};

export default Cart;
