import React from "react";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Pricing from "./Pages/Pricing";
import Faqs from "./Pages/Faqs";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Static/Header";
import Footer from "./Static/Footer";
import Login from './Pages/Login';
import SignupPage from "./Pages/SignupPage";
import Onboarding from "./Pages/Onboarding";
import Contact from "./Pages/Contact";

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
