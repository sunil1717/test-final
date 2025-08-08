import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingBag, FaBars, FaTimes, FaCheckCircle, FaArrowRight, FaArrowLeft, } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import { useShopStore } from "../store/shopStore";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


import { motion, AnimatePresence } from 'framer-motion';








export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;




  const [iconState, setIconState] = useState("search");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const [searched, setSearched] = useState(false);
  const checkServiceArea = useShopStore((state) => state.checkServiceArea);
  // const serviceable = useShopStore((state) => state.serviceable);

  const { fetchCart } = useShopStore();
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const navigate = useNavigate();
  const cart = useShopStore((state) => state.cart);
  const itemCount = (cart || []).reduce((acc, item) => acc + item.quantity, 0);




  const [pincode, setPincode] = useState('');
  const [suburb, setSuburb] = useState('');
  const [serviceable, setServiceable] = useState(null);
  const [step, setStep] = useState("pincode");


  useEffect(() => {
    fetchCart();
  }, []);



  const handleSearch = async () => {
    if (!pincode.trim() || !suburb.trim()) return;

    setIconState("loading");
    const isServiceable = await checkServiceArea(pincode.trim(), suburb.trim());
    setServiceable(isServiceable);
    setSearched(true);
    setIconState("done");

    setTimeout(() => {
      setIconState("search");
    }, 1500);
  };



  useEffect(() => {
    setSearched(false);
    setServiceable(null);
  }, [pincode, suburb]);


  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
    >
      <header className="bg-white shadow-md px-2 sm:px-6 py-2 relative z-50 ">
        <div className="flex items-center justify-between max-w-[1300px] mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <img src="/logoB.png" alt="Top Shelf" className="h-12 sm:h-19" />
          </div>


          {/* Middle: Search bar */}
          <div className="w-full max-w-sm mx-auto px-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">

              {/* STEP 1: PINCODE INPUT */}
              <AnimatePresence>
                {step === "pincode" && (
                  <motion.div
                    key="pincode"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                    className="flex w-full items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Enter your pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => pincode.trim() && setStep("suburb")}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
                    >
                      <FaArrowRight />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* STEP 2: SUBURB + SEARCH */}
              <AnimatePresence>
                {step === "suburb" && (
                  <motion.div
                    key="suburb"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="flex w-full items-center gap-2">
                      <button
                        onClick={() => setStep("pincode")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
                      >
                        <FaArrowLeft />
                      </button>

                      <input
                        type="text"
                        placeholder="Enter your suburb "
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none text-sm"
                      />

                      {/* Desktop Search Button */}
                      <div className="hidden sm:block">
                        <button
                          onClick={handleSearch}
                          disabled={!(pincode.trim() && suburb.trim())}
                          className={`rounded-full p-2 text-white transition 
                  ${pincode.trim() && suburb.trim()
                              ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                              : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                          {iconState === "search" && <FaSearch size={16} />}
                          {iconState === "loading" && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              <FaSearch size={16} />
                            </motion.div>
                          )}
                          {iconState === "done" && <FaCheckCircle size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Search Button Below Input */}
                    <div className="sm:hidden  mt-2 flex justify-center">
                      <button
                        onClick={handleSearch}
                        disabled={!(pincode.trim() && suburb.trim())}
                        className={`w-30 flex items-center justify-center rounded-full py-2 text-white font-medium transition 
                ${pincode.trim() && suburb.trim()
                            ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                          }`}
                      >
                        {iconState === "search" && <FaSearch  size={16} />}
                        {iconState === "loading" && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <FaSearch size={16} />
                          </motion.div>
                        )}
                        {iconState === "done" && <FaCheckCircle size={16} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DELIVERY MESSAGE */}
            <AnimatePresence>
              {searched && (pincode.trim() || suburb.trim()) && (
                <motion.p
                  key="message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`text-sm mt-2 text-center ${serviceable ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {serviceable
                    ? "Good news! We deliver to this area."
                    : "Sorry, we currently do not serve this location."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>





          {/* Right: Cart + Login + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Login or Greeting (Desktop) */}
            <div className="relative hidden md:flex flex-col items-end text-sm text-gray-700">
              {user ? (
                <>
                  <div className="text-right">
                    Hello, <span className="font-semibold">{user.name}</span><br />
                    <span className="text-xs text-gray-500">{user.phone}</span>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="mt-1 px-3 py-1 hover:cursor-pointer bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login/user")}
                    className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm hover:bg-gray-600 hover:cursor-pointer"
                  >
                    Login
                  </button>

                </>
              )}
            </div>

            {/* Cart Icon */}
            <div className="relative" onClick={() => navigate("/cart")}>
              <FaShoppingBag size={25} className="text-gray-700 hover:cursor-pointer" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700  hover:cursor-pointer md:hidden"
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Bottom Menu: Desktop */}
        <nav className="mt-4 hidden md:flex text-sm font-medium text-gray-700 justify-center gap-6 flex-wrap">
          <a href="/" className={` ${currentPath === '/' ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`}>Home</a>

          <a href="/mybooking" className={` ${currentPath === '/mybooking' ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`}>My Booking</a>

          <a href="/#contact" className="hover:text-red-600" >Contact Us</a>
          <a href="/blogs" className="hover:text-red-600">Blog</a>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.3, transformOrigin: "top" }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.3 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="md:hidden  font-medium space-y-3 text-sm text-gray-800 px-4 py-4 rounded-b-2xl shadow-lg origin-top"
            >
              <a href="/" className={` block ${currentPath === '/' ? ' text-red-600 font-semibold' : 'hover:text-red-600'}`}>Home</a>

              <a href="/mybooking" className={`block ${currentPath === '/mybooking' ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`}>My Booking</a>
              <a href="/#contact" className="block hover:text-red-600">Contact Us</a>
              <a href="/blogs" className="block hover:text-red-600">Blog</a>

              {user ? (
                <>
                  {/* 👋 Greeting at top */}
                  <div className="mt-2 text-sm text-gray-800 text-center">
                    <div>Hello, <strong>{user.name}</strong></div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </div>

                  {/* 🚪 Logout at bottom */}
                  <div className="mt-auto pt-6 flex justify-center border-t border-white/40">
                    <button
                      onClick={logoutUser}
                      className="px-6 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href="/login/user"
                    className="px-7 py-2 text-sm bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                  >
                    Login
                  </a>

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>





      </header>
    </motion.nav>
  );
}
