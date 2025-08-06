import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Sidebar from "./Sidebar";

const Header: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  const handleToggle = (): void => {
    setToggle(!toggle);
  };

  return (
    <div className="relative">
      <div className="max-w-[1280px] px-8 mx-auto flex items-center mt-6 bg-white 
      rounded-full p-4 justify-between w-[70%] shadow-md  ">
        <ul className="flex gap-16  text-center text-gray-500 hover:text-indigo-600 items-center 
        max-tablet:hidden  ">
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/pricing">PRICING</Link>
          </li>
          <li className="flex items-center gap-1">
            <Link to="/faqs">FAQS</Link>
            <LuChevronDown size={18} />
          </li>
          <li className="flex items-center gap-1">
            <Link to="/about">ABOUT</Link>
            <LuChevronDown size={18} />
          </li>
        </ul>
        <div className="hidden max-tablet:block">
          {toggle ? (
            <RxCross1 size={35} onClick={handleToggle} />
          ) : (
            <RxHamburgerMenu size={35} onClick={handleToggle} />
          )}
        </div>
      </div>
      {toggle && <Sidebar handleToggle={handleToggle} />}
    </div>
  );
};

export default Header;
