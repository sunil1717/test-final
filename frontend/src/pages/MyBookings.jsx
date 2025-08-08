import React, { useEffect } from "react";
import { useShopStore } from "../store/shopStore";
import Navbar from "../components/Navbar";

export default function MyBookings() {
  const { bookings = [], fetchBookings } = useShopStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mt-15 sm:mt-30  mx-auto px-4 py-6">
        <h1 className="text-2xl text-red-600 font-bold mb-6 text-left">My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const tyre = booking.tyre;
              const qty = booking.quantity;
              const total = tyre?.price ? tyre.price * qty : 0;

              return (
                <div
                  key={booking._id}
                  className="border-b-1 rounded shadow-sm bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex gap-4">
                    {tyre?.image && (
                      <img
                        src={tyre.image}
                        alt="Tyre"
                        className="w-24 h-24 object-contain  rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">
                        {tyre?.brand} - {tyre?.model}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Size: {tyre?.width}/{tyre?.profile}R{tyre?.rimSize}
                      </p>
                      <p className="text-gray-600 text-sm">Price: ${tyre?.price}</p>
                      <p className="text-gray-600 text-sm">Qty: {qty}</p>
                      <p className="text-gray-800 font-semibold">Total: ${total}</p>
                    </div>
                  </div>

                  <div className="text-sm text-right sm:text-left">
                    <p className="text-gray-700">
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          booking.status === "Pending"
                            ? "text-yellow-600"
                            : booking.status === "Confirmed"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {booking.status}
                      </span>
                    </p>
                    <p className="text-gray-600">Payment: {booking.paymentMethod}</p>
                    <p className="text-gray-600">Address: {booking.address}</p>
                    <p className="text-gray-600">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
