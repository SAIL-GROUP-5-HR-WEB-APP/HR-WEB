import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          
          <div className="mr-2">
            <div className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold">
          
              <span className="text-xs">H</span>
            </div>
          </div>
          <span className="text-xl font-semibold">SolveHR</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm justify-center md:justify-start mb-4 md:mb-0">
          <a href="#" className="hover:text-gray-800">Home</a>
          <a href="#" className="hover:text-gray-800">Products</a>
          <a href="#" className="hover:text-gray-800">Pricing</a>
          <a href="#" className="hover:text-gray-800">About</a>
          <a href="#" className="hover:text-gray-800">Contact</a>
        </nav>
        <div className="flex space-x-4 justify-center md:justify-end">
          <a href="#" className="hover:text-gray-800"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-800"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-800"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-800"><FaLinkedinIn /></a>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center text-xs text-gray-500 gap-2">
          <p>&copy; 2024 SolveHR. All rights reserved.</p>
          <div className="flex gap-4  ">
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
            <a href="#" className="hover:text-gray-700">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
