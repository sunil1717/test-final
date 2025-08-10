import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '../store/shopStore';
import useAuthStore from '../store/authStore';
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const RecommendedProducts = ({ tyres }) => {



  const getTyreKey = (tyre) => {
    const size = tyre.SIZE || `${tyre?.width}/${tyre?.profile}R${tyre?.rimSize}`;
    return `${tyre?.brand || tyre?.Brand}-${tyre?.model || tyre?.Model}-${size}`;
  };




  const navigate = useNavigate();
  const { addToCart, cart } = useShopStore();
  const { user } = useAuthStore();

  const [recommended, setRecommended] = useState([]);
  const [addedTyreKey, setAddedTyreKey] = useState(null);



  const [selectedpriceoption, setselectedpriceoption] = useState({});

  const [openCardKey, setOpenCardKey] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const getRandomTyres = () => {
    if (!tyres || tyres.length === 0) return [];
    const shuffled = [...tyres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  useEffect(() => {
    setRecommended(getRandomTyres());
  }, [tyres]);

  const handleRefresh = () => {
    setRecommended(getRandomTyres());
  };

  const handleAddToCart = (tyre, price, quantity) => {

    let width = '', profile = '', rimSize = '';
    if (tyre.SIZE && typeof tyre.SIZE === 'string') {
      const match = tyre.SIZE.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
      if (match) {
        [, width, profile, rimSize] = match;
      }
    }
    const newTyre = {
      width: Number(width),
      profile: Number(profile),
      rimSize: rimSize,
      brand: tyre.Brand,
      model: tyre.Model,
      image: tyre.image_url,
      price: price,
      "Price for 1": tyre["Price for 1"],
      "Price for 2": tyre["Price for 2"],
      "Price for 3": tyre["Price for 3"],
      "Price for 4": tyre["Price for 4"],
      "Price for 5": tyre["Price for 5"],
    };
    addToCart(newTyre, quantity);


  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
    }),
  };

  if (!tyres || tyres.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Recommended for You
          </motion.h2>
          <button
            onClick={handleRefresh}
            className="text-red-600 hover:underline text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommended.map((tyre, index) => {
            const tyreKey = getTyreKey(tyre);
            const isAlreadyInCart = cart.some((item) => getTyreKey(item.tyre) === tyreKey);

            const isOutofstock = Number(tyre["In Stock"]) === 0;

            const priceOptions = [
              { qty: 1, label: "1 Qty", price: tyre["Price for 1"] },
              { qty: 2, label: "2 Qty", price: tyre["Price for 2"] },
              { qty: 3, label: "3 Qty", price: tyre["Price for 3"] },
              { qty: 4, label: "4 Qty", price: tyre["Price for 4"] },
              { qty: 5, label: "5 Qty", price: tyre["Price for 5"] },
            ].filter(option => option.price != null);
            const selectedQty = selectedpriceoption[tyreKey];
            const selectedOption = priceOptions.find(option => option.qty === selectedQty);

            return (
              <motion.div
                key={tyre._id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                onClick={() => {
                  if (isMobile) {
                    setOpenCardKey((prevKey) => (prevKey === tyreKey ? null : tyreKey));
                  }
                }}
                viewport={{ once: true, amount: 0.2 }}
                className=" relative group overflow-hidden bg-gray-50 rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.01] flex flex-col items-center"
              >

                {isOutofstock && (
                  <div className="absolute top-2 right-2">
                    <div className="relative overflow-hidden rounded bg-red-600 text-white text-xs font-semibold px-2 py-1 shadow">
                      Out of Stock
                      <span className="shine" />
                    </div>
                  </div>
                )}
                {/* Tyre Image */}
                {tyre.image_url && (
                  <img
                    src={tyre.image_url}
                    alt={`${tyre.Brand} ${tyre.Model}`}
                    className="w-28 h-28 object-contain mx-auto mb-3"
                  />
                )}

                {/* Basic Info */}
                <h4 className="text-md font-semibold text-gray-800 mb-1 text-center">
                  {tyre.Brand} - {tyre.Model}
                </h4>
                <p className="text-sm text-gray-600 text-center mb-1">
                  {tyre.SIZE}
                </p>
                <p className="text-sm text-gray-500 text-center mb-1">
                  Load/Speed: {tyre["LOAD/SPEED RATING"]}
                </p>
                {
                  isMobile && !isOutofstock && (
                    <button className="w-full p-2 text-center text-red-400 underline" >Buy Now</button>
                  )
                }


                {!isOutofstock && (
                  <div
                    className={`absolute bottom-0 left-0 w-full bg-white/20 backdrop-blur-xl border border-black/20 rounded-xl shadow-lg p-1 z-10 transition-all duration-300 ease-in-out transform
    ${isMobile
                        ? openCardKey === tyreKey
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-full opacity-0 pointer-events-none'
                        : 'group-hover:translate-y-0 group-hover:opacity-100 translate-y-full opacity-0'
                      }`}
                  >
                    <div onClick={(e) => e.stopPropagation()} className="space-y-0">
                      {isMobile && (
                        <button onClick={() => {

                          setOpenCardKey(null);

                        }}
                          className=' text-end text-gray-500'><ChevronDownIcon className="w-5 h-5" /></button>
                      )}
                      {priceOptions.map((option) => (
                        <label
                          key={option.qty}
                          className="flex items-center justify-between text-sm text-black/90 font-medium cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`price-option-recomended-${tyreKey}`}
                              value={option.qty}
                              checked={selectedpriceoption[tyreKey] === option.qty}
                              onChange={() =>
                                setselectedpriceoption((prev) => ({
                                  ...prev,
                                  [tyreKey]: option.qty,
                                }))
                              }
                              className="appearance-none w-4 h-4 border border-black rounded-sm bg-white/20 checked:bg-red-500 checked:border-black transition-all shadow-sm"
                            />
                            <span className="text-black/90">Qty {option.qty}</span>
                          </div>
                          <span className="text-black font-semibold">${option.price.toFixed(2)} ea</span>
                        </label>
                      ))}

                      {selectedOption && (




                        <button
                          onClick={() => {
                            if (!user) {
                              navigate("/login/user");
                            } else {

                              handleAddToCart(tyre, selectedOption.price, selectedOption.qty);
                            }
                          }}

                          disabled={isAlreadyInCart}
                          className={`w-full  ${isAlreadyInCart ? "bg-red-400 " : " bg-red-500 hover:bg-red-600"}  text-white font-semibold py-2 rounded-lg shadow-md transition`}
                        >
                          {isAlreadyInCart ? "Already in Cart" : "Add to Cart "}
                        </button>


                      )}
                    </div>
                  </div>


                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;
