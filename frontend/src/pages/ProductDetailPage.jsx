import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactUs from '../components/ContactUs';
const product = {
  name: 'Mix And Match Shatter/Budder 28g (4 X 7G)',
  category: 'Concentrates',
  price: 120.0,
  originalPrice: 150.0,
  purchases: 135,
  features: ['Cerebral', 'Creative', 'Relaxing', 'Sleepy', 'Uplifting'],
  helpsWith: [
    'Anxiety', 'Arthritis', 'Chronic Pain', 'Depression', 'Fatigue', 'Headaches'
  ],
  flavors: ['Citrus', 'Earthy', 'Pungent', 'Sour'],
  image: 'https://via.placeholder.com/250x300?text=Product+Image',
  thumbnails: [
    'https://via.placeholder.com/100x100?text=Bud1',
    'https://via.placeholder.com/100x100?text=Bud2',
    'https://via.placeholder.com/100x100?text=Bud3',
    'https://via.placeholder.com/100x100?text=Bud4'
  ]
};

const ProductDetailPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image);

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && setIsModalOpen(false);
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="bg-white pt-30 text-gray-800 px-4 sm:px-6 lg:px-20 py-10">

      {/* Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image + Thumbnails */}
        <div className="flex flex-col items-center">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-60 sm:w-72 h-auto mb-4 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {[product.image, ...product.thumbnails].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImage(img)}
                className={`w-12 h-12 border rounded cursor-pointer ${
                  selectedImage === img ? 'ring-2 ring-green-500' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <p className="uppercase text-sm text-gray-500">{product.category}</p>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="text-sm text-gray-500 mb-4">
            <span className="line-through">${product.originalPrice}</span>{' '}
            <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span> ·{' '}
            {product.purchases} Purchases
          </div>

          {/* Effects */}
          <div className="mb-4">
            <p className="font-semibold mb-1">Effects:</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {product.features.map((f, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded">{f}</span>
              ))}
            </div>
          </div>

          {/* Helps With */}
          <div className="mb-4">
            <p className="font-semibold mb-1">Helps With:</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {product.helpsWith.map((h, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded">{h}</span>
              ))}
            </div>
          </div>

          {/* Flavors */}
          <div className="mb-4">
            <p className="font-semibold mb-1">Flavors:</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {product.flavors.map((f, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded">{f}</span>
              ))}
            </div>
          </div>

          {/* Purchase Action */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <select className="border px-4 py-2 rounded text-sm">
              <option>1 × 28G</option>
            </select>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm">
              Add to Cart · ${product.price.toFixed(2)}
            </button>
          </div>

          {/* Info List */}
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              Free Express Shipping on Orders Over $120
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              Order before 12PM for same-day dispatch
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              Support 6 days/week · 7 AM to 7 PM
            </li>
          </ul>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16 max-w-4xl mx-auto">
        <button className="border border-green-500 text-green-600 rounded-full px-6 py-2 mb-4">
          Description
        </button>
        <p className="text-sm text-gray-700 leading-relaxed">
          Jungle Diamonds is a slightly indica dominant hybrid strain (60% indica/40% sativa) created...
        </p>
      </div>

      {/* Zoom Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
          <div className="bg-white p-4 rounded-xl shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Zoomed"
              className="w-full h-auto object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* Featured Product Section */}
      <div className="mt-20">
        <h3 className="text-xl font-bold mb-6">Featured Product</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: '2 Oz Deal Watermelon Zkittles + Purple Gushers',
              price: 80.0,
              image: 'https://via.placeholder.com/100x130?text=Bud',
              rating: 4.8
            },
            {
              title: '2 Oz Deal Ali Tuna + Master Tuna',
              price: 120.0,
              originalPrice: 130.0,
              tag: '50 BUDDIES',
              image: 'https://via.placeholder.com/100x130?text=Combo',
              rating: 4.9
            },
            {
              title: 'Mix And Match Shatter/Budder 28g (4 X 7G)',
              price: 120.0,
              originalPrice: 150.0,
              image: 'https://via.placeholder.com/100x130?text=Mix',
              rating: 5.0,
              outOfStock: true
            },
            {
              title: 'Mix And Match Shatter/Budder 28g (4 X 7G)',
              price: 120.0,
              image: 'https://via.placeholder.com/100x130?text=Mix2',
              rating: 4.7
            }
          ].map((item, i) => (
            <div key={i} className="border rounded-lg p-4 text-sm relative">
              {item.tag && (
                <div className="text-xs bg-yellow-400 text-black px-2 py-1 inline-block mb-2 rounded">
                  {item.tag}
                </div>
              )}
              {item.outOfStock && (
                <div className="absolute top-2 right-2 text-white bg-red-500 px-2 py-1 rounded text-xs">
                  Out of Stock
                </div>
              )}
              <img src={item.image} alt={item.title} className="h-28 w-full object-contain mb-2" />
              <p className="font-semibold mb-1">{item.title}</p>
              <p className="mb-1 text-gray-500">
                {item.originalPrice && (
                  <span className="line-through mr-1">${item.originalPrice}</span>
                )}
                <span className="text-green-600 font-bold">${item.price}</span>
              </p>
              {!item.outOfStock && (
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 mt-2 rounded-full">
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    <ContactUs/>
    <Footer/>
    </>
  );
};

export default ProductDetailPage;
