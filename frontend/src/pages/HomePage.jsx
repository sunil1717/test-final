import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import WhyUsSection from '../components/WhyUsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogsSection from '../components/BlogsSection';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUs';
import RecommendedProducts from "../components/RecommendedProducts"
import { ArrowUpIcon } from "@heroicons/react/24/outline";

import { Truck, ShieldCheck, DollarSign } from 'lucide-react';


import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';



import useAuthStore from "../store/authStore";
import { useShopStore } from '../store/shopStore';
import { useNavigate } from "react-router-dom";

import useScrollToHash from "../hooks/useScrollToHash"


import filterOptions from "../data/tyre_unique_values.json";

import { ChevronDownIcon } from '@heroicons/react/24/solid'


export default function HomePage() {
  useScrollToHash();

  const resultsRef = useRef(null);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    searchByRego,
    searchBySize,

    addToCart,
    cart,
  } = useShopStore();

  const [mode, setMode] = useState('rego');
  const [regoForm, setRegoForm] = useState({ rego: '', state: '' });
  const [sizeForm, setSizeForm] = useState({ width: '', profile: '', rimSize: '' });

  const [results, setResults] = useState([]);
  const [selectedTyre, setSelectedTyre] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [commonBrand, setCommonBrand] = useState(null);


  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedTyreKey, setAddedTyreKey] = useState(null);



  const [selectedPriceOption, setSelectedPriceOption] = useState({});

  const [openCardKey, setOpenCardKey] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);





  const [filters, setFilters] = useState({
    brand: '',
    type: '',
    sort: '',
  });



  const getTyreKey = (tyre) => {
    const size = tyre.SIZE || `${tyre?.width}/${tyre?.profile}R${tyre?.rimSize}`;
    return `${tyre?.brand || tyre?.Brand}-${tyre?.model || tyre?.Model}-${size}`;
  };




  const parsedSizes = filterOptions.SIZE.map(sizeStr => {
    const match = sizeStr.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
    return match ? { width: match[1], profile: match[2], rimSize: match[3] } : null;
  }).filter(Boolean);

  const uniqueWidths = [...new Set(parsedSizes.map(s => s.width))].sort();
  const uniqueProfiles = [...new Set(parsedSizes.map(s => s.profile))].sort();
  const uniqueRimSizes = [...new Set(parsedSizes.map(s => s.rimSize))].sort();




  const handleRegoSearch = async () => {
    setSearching(true);
    setResults([]);


    setHasSearched(false);

    const res = await searchByRego(regoForm);


    if (res.error) {
      alert("Search failed. Please try again.");
      setSearching(false);
      return;
    }

    if (res.multipleMatches) {
      // Flatten matched variants into individual tyre cards with vehicle info
      const flatResults = res.variants


      setCommonBrand(res.vehicleMake || '');
      setResults(flatResults);
    } else {
      // Single match
      const matchedTyres = res.matchedTyres || [];
      const matchedVehicle = res.vehicle || null;

      setCommonBrand(matchedVehicle?.make || '');

      setResults(matchedTyres);


    }

    setHasSearched(true);
    setSearching(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };





  const handleSizeSearch = async () => {
    setCommonBrand(null);
    setSearching(true);
    const res = await searchBySize(sizeForm);


    setResults(res);
    setSelectedTyre(null);
    setHasSearched(true);
    setSearching(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };


  const renderTyreCard = (tyre) => {
    const tyreKey = getTyreKey(tyre);
    const isOutofstock = Number(tyre["In Stock"]) === 0;
    const isAlreadyInCart = cart.some(
      (item) => getTyreKey(item.tyre) === tyreKey
    );


    let width = '', profile = '', rimSize = '';
    if (tyre.SIZE && typeof tyre.SIZE === 'string') {
      const match = tyre.SIZE.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
      if (match) {
        [, width, profile, rimSize] = match;
      }
    }

    const priceOptions = [
      { qty: 1, label: "1 Qty", price: tyre["Price for 1"] },
      { qty: 2, label: "2 Qty", price: tyre["Price for 2"] },
      { qty: 3, label: "3 Qty", price: tyre["Price for 3"] },
      { qty: 4, label: "4 Qty", price: tyre["Price for 4"] },
      { qty: 5, label: "5 Qty", price: tyre["Price for 5"] },
    ].filter(option => option.price != null);

    const selectedQty = selectedPriceOption[tyreKey];
    const selectedOption = priceOptions.find(option => option.qty === selectedQty);

    return (
      <div
        key={tyreKey}
        onClick={() => {
          if (isMobile) {
            setOpenCardKey((prevKey) => (prevKey === tyreKey ? null : tyreKey));
          }
        }}
        className="relative group bg-white rounded-lg shadow-md overflow-hidden p-4 hover:shadow-lg transition-shadow duration-300"
      >
        {/* Out of Stock Badge */}
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
          {width}/{profile}R{rimSize}
        </p>
        <p className="text-sm text-gray-500 text-center mb-1">
          Load/Speed: {tyre["LOAD/SPEED RATING"]}
        </p>
        {
                  isMobile && !isOutofstock && (
                    <button className="w-full p-2 text-center text-red-400 underline" >Buy Now</button>
                  )
                }

        {/* Drop-up Hover Box */}
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
                      name={`price-option-home-${tyreKey}`}
                      value={option.qty}
                      checked={selectedPriceOption[tyreKey] === option.qty}
                      onChange={() =>
                        setSelectedPriceOption((prev) => ({
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
                      const newTyre = {
                        width: Number(width),
                        profile: Number(profile),
                        rimSize,
                        brand: tyre.Brand,
                        model: tyre.Model,
                        image: tyre.image_url,
                        price: selectedOption.price,
                        "Price for 1": tyre["Price for 1"],
                        "Price for 2": tyre["Price for 2"],
                        "Price for 3": tyre["Price for 3"],
                        "Price for 4": tyre["Price for 4"],
                        "Price for 5": tyre["Price for 5"],
                      };
                      addToCart(newTyre, selectedOption.qty);
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
      </div>
    );
  };











  const [showTopBtn, setShowTopBtn] = useState(false);
  const [loading, setLoading] = useState(() => {
    const hasLoaded = sessionStorage.getItem("hasSeenLogo");
    return !hasLoaded;
  });


  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasSeenLogo", "true");

      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);




  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };






  const filteredResults = results
    .filter(tyre => {
      const matchesBrand = filters.brand ? tyre.Brand === filters.brand : true;
      const matchesType = filters.type ? tyre.Type === filters.type : true;
      return matchesBrand && matchesType;
    })
    .sort((a, b) => {
      if (filters.sort === "low-to-high") return a["Price Incl GST"] - b["Price Incl GST"];
      if (filters.sort === "high-to-low") return b["Price Incl GST"] - a["Price Incl GST"];
      return 0;
    });



  const uniqueBrands = results.length > 0
    ? [...new Set(results.map(tyre => tyre.Brand))]
    : [];

  const uniqueTypes = results.length > 0
    ? [...new Set(results.map(tyre => tyre.Type))]
    : [];



  const infoData = [
    {
      icon: <Truck className="text-red-600 w-7 h-7" />,
      title: "Reliable Shipping",
      description:
        "Green Society provides Canada Post Xpress Shipping right to your doorstep! You can also opt in for shipping insurance. For orders over $149, shipping is free!",
    },
    {
      icon: <ShieldCheck className="text-red-600 w-7 h-7" />,
      title: "You're Safe With Us",
      description:
        "Our secure payment system accepts the most common forms of payments making the checkout process quicker! The payments we accept are debit, all major credit cards, and cryptocurrency.",
    },
    {
      icon: <DollarSign className="text-red-600 w-7 h-7" />,
      title: "Best Quality & Pricing",
      description:
        "Here at Green Society, we take pride in the quality of our products and service. Our prices are set to ensure you receive your medication at a reasonable price and safely.",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <img
          src="/logoB.jpg"
          alt="Loading..."
          className="w-15 h-13 animate-pulse"
        />
      </div>
    );
  }







  return (
    <>
      <div className="font-sans  overflow-y-hidden">

        {searching && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md transition-opacity duration-500">
    <div className="flex flex-col items-center justify-center space-y-4  rounded-xl ">
      
      {/* Logo */}
      <img
        src="/logoB.jpg"
        alt="Loading..."
        className="w-15 h-10 animate-ping  text-black"
      />

      {/* Animated progress bar */}
      <div className="relative w-15 h-1 bg-gray-300 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-red-500 animate-progress-bar rounded-full"></div>
      </div>

     
      
    </div>
  </div>
)}


        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-16 sm:pt-25">
          {/* Background Image with zoom and fade effect */}
          <motion.div
            className="h-150 bg-cover bg-center bg-no-repeat flex items-center justify-start sm:justify-center px-4"
            style={{ backgroundImage: `url('/bg.jpg')` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-black/50 z-0" />
            {/* search  Container with slide-up animation */}
            <motion.div
              className="mt-5 z-10 rounded-lg text-start sm:text-center  max-w-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              {/* typewritter */}

              <div className="mb-6 min-h-[4rem] sm:min-h-[3rem]">
                <h1 className="text-3xl sm:text-5xl text-white font-bold drop-shadow-lg">
                  We Provide
                </h1>
                <div className="text-red-400 font-bold text-2xl sm:text-3xl mt-1">
                  <Typewriter
                    words={['Premium Tyres', 'Quality Service', 'Fast Delivery']}
                    loop
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={40}
                    delaySpeed={1500}
                  />
                </div>
              </div>


              {/* search box */}

              <div className="bg-white/5 backdrop-blur-md shadow-lg border border-white/30 p-6 rounded mt-10 sm:mt-20 w-full max-w-sm sm:max-w-5xl  mx-auto">

                <div className="flex justify-center mb-4">
                  <button
                    className={`px-4 py-2 mr-2 w-full sm:w-auto rounded ${mode === 'rego' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setMode('rego')}
                  >
                    Search by Rego
                  </button>
                  <button
                    className={`px-4 py-2 w-full sm:w-auto rounded ${mode === 'size' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setMode('size')}
                  >
                    Search by Size
                  </button>
                </div>

                {mode === 'rego' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:mt-7  ">
                    <input
                      type="text"
                      placeholder="Rego"
                      value={regoForm.rego}
                      onChange={(e) => setRegoForm({ ...regoForm, rego: e.target.value })}
                      className="border px-3 py-2 text-white/95 rounded w-full"
                    />
                    <select
                      value={regoForm.state}
                      onChange={(e) => setRegoForm({ ...regoForm, state: e.target.value })}
                      className="border px-3 py-2 text-white/95 rounded w-full max-w-[180px] mx-auto sm:mx-0"

                    >
                      <option value="" className='text-black' >State</option>
                      {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"].map((stateCode) => (
                        <option className='text-black' key={stateCode} value={stateCode}>
                          {stateCode}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleRegoSearch}
                      disabled={searching}
                      className={`bg-red-600 text-white px-3 py-2 rounded col-span-1 sm:col-span-2 w-full transition
    ${searching ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    >
                      {searching ? 'Searching Tyres...' : 'Search Tyre'}
                    </button>

                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/95 sm:mt-7 ">
                    <select
                      value={sizeForm.width}
                      onChange={(e) => setSizeForm({ ...sizeForm, width: e.target.value })}
                      className="border px-3 py-2 rounded w-full  "
                    >
                      <option className='text-gray-700' value="">Select Width</option>
                      {uniqueWidths.map(w => (
                        <option className='text-gray-700' key={w} value={w}>{w}</option>
                      ))}
                    </select>

                    <select
                      value={sizeForm.profile}
                      onChange={(e) => setSizeForm({ ...sizeForm, profile: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    >
                      <option className='text-gray-700' value="">Select Profile</option>
                      {uniqueProfiles.map(p => (
                        <option className='text-gray-700' key={p} value={p}>{p}</option>
                      ))}
                    </select>

                    <select
                      value={sizeForm.rimSize}
                      onChange={(e) => setSizeForm({ ...sizeForm, rimSize: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    >
                      <option className='text-gray-700' value="">Select Rim Size</option>
                      {uniqueRimSizes.map(r => (
                        <option className='text-gray-700' key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    <button
                      onClick={handleSizeSearch}
                      disabled={searching}
                      className={`px-4 py-2 rounded col-span-1 sm:col-span-3 w-40 transition 
    ${searching ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    >
                      {searching ? "Searching..." : "Search Tyre"}
                    </button>

                  </div>
                )}
              </div>


            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section>
          <div className="bg-gray-100 py-10 px-6 sm:px-10 lg:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              {infoData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="bg-white shadow-md rounded-full p-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Recommended Products */}
        {hasSearched && results.length > 0 && <RecommendedProducts tyres={results} />}


        {/*Filter section */}
        {hasSearched && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 ">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Filters */}
              <div className="lg:w-1/4 bg-white shadow rounded p-4">
                <h3 className="text-lg font-semibold mb-3">Filter Tyres</h3>

                <div className="space-y-4">
                  {/* Brand Filter */}
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>

                  {/* Type Filter */}
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">All Types</option>
                    {uniqueTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  {/* Sort by Price */}
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Sort by Price</option>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                  </select>
                </div>
              </div>

              {/* Results Section */}
              <div ref={resultsRef} className="lg:w-3/4">
                {commonBrand && (
                  <div className="text-center mb-8 p-6 bg-gradient-to-r from-white via-gray-100 to-white rounded-xl shadow-md">

                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
                      Tyres for <span className="text-red-600 underline decoration-underline">{commonBrand}</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                      We found matching tyres based on your search
                    </p>
                  </div>
                )}


                {filteredResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredResults.map((tyre, index) => (
                      <div key={getTyreKey(tyre) + index}>
                        {renderTyreCard(tyre)}
                      </div>
                    ))}
                  </div>
                ) : (
                  hasSearched && !searching && (
                    <div className="text-center text-gray-600 mt-10">
                      <p>No tyres found for your search. Please try different criteria.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}






        {/* Why Choose Us */}
        <WhyUsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Blog Section */}
        <section id='blog'>
          <BlogsSection />
        </section>

        {/* Contact Us */}
        <ContactUs />

        {/* Footer */}
        <Footer />
      </div>
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
