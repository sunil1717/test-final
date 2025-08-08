import React from 'react';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-red-950 text-white px-4 sm:px-8 md:px-20 py-12 mt-10 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        {/* Logo & About */}
        <div>
          <h2 className="text-xl font-bold mb-3"> TOP SHELF</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            #1 Canadian top rated online dispensary that meets the customers’
            needs in every single medical marijuana aspect. The team here at
            TopShelfBC is heavily involved in the Canadian cannabis industry
            for over 15 years. We strive to provide the top quality products,
            service and care at the lowest prices you’ll ever find.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">QUICK LINK</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>Track Your Order</li>
            <li>Shop All</li>
            <li>Flower</li>
            <li>Edibles</li>
            <li>Concentrates</li>
            <li>Refunds</li>
            <li>Mushrooms</li>
            <li>Promotions / Bundles</li>
            <li>Support</li>
            <li>Reward</li>
            <li>Blog</li>
            <li>Shipping FAQ</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">CONTACT US</h3>
          <p className="text-sm text-gray-300 mb-6">info@topshelfbc.cc</p>
          <h3 className="text-lg font-semibold mb-3">MORE</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>Buy weed online in Canada</li>
            <li>Buy weed online in New Brunswick</li>
            <li>Buy weed online in Prince Edward Island</li>
            <li>Buy weed online in Northwest Territories</li>
            <li>Buy weed online in Saskatchewan</li>
          </ul>
        </div>

        {/* More Regions & Payment Icons */}
        <div className="flex flex-col justify-between h-full">
          <ul className="text-sm text-gray-300 space-y-1">
            <li>Buy weed online in Manitoba</li>
            <li>Buy weed online in Québec</li>
            <li>Buy weed online in British Columbia</li>
            <li>Buy weed online in Ontario</li>
            <li>Buy weed online in Alberta</li>
          </ul>
          <div className="flex gap-4 text-white mt-6">
            <FaCcMastercard size={28} />
            <FaCcVisa size={28} />
            <FaCcAmex size={28} />
            <FaCcPaypal size={28} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 my-6" />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4 text-center">
        <p>© 2025 MOBILE TYRES DESIGNED AND DEVELOPED BY INNOVADE TECHNOLOGIES</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Out Of Stock</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
