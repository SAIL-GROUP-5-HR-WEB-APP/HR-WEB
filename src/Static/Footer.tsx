import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 ">
      <div className="max-w-7xl mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <Link to="/">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="mr-2">
              <div className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold">
                <span className="text-xs">Z</span>
              </div>
            </div>
            <span className="text-xl font-semibold">ZYRAHR</span>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-6 text-sm justify-center md:justify-start mb-4 md:mb-0">
          <Link to="/">
            <nav className="hover:text-gray-900 ">Home</nav>
          </Link>
          <Link to="/pricing">
            <nav className="hover:text-gray-900">Pricing</nav>
          </Link>
          <Link to="/about">
            <nav className="hover:text-gray-900">About</nav>
          </Link>
          <Link to="/faqs">
            <nav className="hover:text-gray-900">FAQs</nav>
          </Link>
        </nav>
        <div className="flex space-x-4 justify-center md:justify-end">
          <a href="#" className="hover:text-gray-900">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-gray-900">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-gray-900">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-gray-900">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
      <div className="border-t border-gray-200  place-items-center mt-9">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center text-xs text-gray-500 gap-2 ">
          <div className="flex gap-4  ">
            <p>&copy; 2024 ZYRAHR. All rights reserved.</p>
            <a href="#" className="hover:text-blue-700">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-700">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-700">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
