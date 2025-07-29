import React from "react";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Pricing from "./Pages/Pricing";
import Faqs from "./Pages/Faqs";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Static/Header";
import Footer from "./Static/Footer";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faqs" element={<Faqs />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
