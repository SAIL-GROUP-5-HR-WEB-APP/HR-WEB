import React, { useState } from "react";
import { Link } from "react-router-dom";

import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import Sidebar from "./Sidebar";
import logo from "../assets/hrlogo.png";
import Button from "../Components/Reuseable/Button";

const Header: React.FC = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <header className="shadow-md h-[70px] fixed top-0 right-0 left-0 bg-white z-40">
      <div className="max-w-[1280px] mx-auto px-20 flex items-center justify-between py-1 ">
        <Link to="/">
          {" "}
          <div className="flex items-center">
            <img src={logo} alt="" className="w-[60px]" />
            <span className="font-bold text-2xl text-indigo-900">HRCORE</span>
          </div>
        </Link>

        <div className="flex gap-7 max-[990px]:hidden ">
          <Link to="/pricing">
            {" "}
            <nav>Pricing</nav>
          </Link>
          <Link to="/about">
            <nav>About</nav>
          </Link>
          <Link to="/faqs">
            {" "}
            <nav>FAQs</nav>
          </Link>
          <Link to="/contact">
            {" "}
            <nav>Contact</nav>
          </Link>
        </div>
        <div className="max-[990px]:hidden ">
          <Link to="/signup">
            <Button
              title="Register"
              bg="#4338CA"
              textColor="white"
              borderColor="white"
              hoverr=" hover:scale-105"
            />
          </Link>
        </div>
        <section className=" hidden max-[990px]:block">
          {toggle ? (
            <RxCross1 size={35} onClick={handleToggle} />
          ) : (
            <RxHamburgerMenu size={35} onClick={handleToggle} />
          )}
        </section>
      </div>
      <div>{toggle && <Sidebar handleToggle={handleToggle} />}</div>
    </header>
  );
};

export default Header;
