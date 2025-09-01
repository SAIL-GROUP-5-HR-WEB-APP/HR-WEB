import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Sidebar from "./Sidebar";
import logo from "../assets/Logo.png";
import Button from "../Components/Reuseable/Button";

const Header: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const navItems = [
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[90px] bg-transparent backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-all duration-500">
      <div className="max-w-[1440px] mx-auto px-20 sm:px-8 flex items-center justify-between h-full">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src={logo}
            alt="ZYRA Logo"
            className="w-[200px] h-[200px] object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-12">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative text-lg font-semibold text-white/90 hover:text-white transition-colors duration-300 ${
                location.pathname === item.path ? "text-white" : ""
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-gradient-to-r from-indigo-400 to-pink-500 animate-slide-in" />
              )}
            </Link>
          ))}
        </nav>

        {/* Call to Action Button */}
        <div className="hidden lg:flex items-center">
          <Link to="/signup">
            <Button
              title="Get started"
              bg="#4338CA"
              textColor="white"
              borderColor="border-transparent"
              hoverr="hover:from-indigo-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={handleToggle}
          aria-label="Toggle menu"
        >
          {toggle ? (
            <RxCross1
              size={32}
              className="text-white/90 hover:text-indigo-400 transition-colors duration-200"
            />
          ) : (
            <RxHamburgerMenu
              size={32}
              className="text-white/90 hover:text-indigo-400 transition-colors duration-200"
            />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {toggle && <Sidebar handleToggle={handleToggle} />}
      </div>

      {/* Inline CSS for Animation */}
      <style>
        {`
          @keyframes slide-in {
            0% { width: 0; }
            100% { width: 100%; }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
