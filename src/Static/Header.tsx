import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <ul>
        <Link to="/">
          <li>home</li>
        </Link>
        <Link to="/pricing">
          {" "}
          <li>pricing</li>
        </Link>
        <Link to="/faqs">
          <li>faqs</li>
        </Link>
        <Link to="/about">
          {" "}
          <li>about</li>
        </Link>
      </ul>
    </div>
  );
};

export default Header;
