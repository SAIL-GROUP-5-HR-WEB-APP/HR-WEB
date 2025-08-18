import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Pricing from "./Pages/Pricing";
import Faqs from "./Pages/Faqs";
import Header from "./Static/Header";
import Footer from "./Static/Footer";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Onboarding from "./Pages/Onboarding";
import Contact from "./Pages/Contact";
import ScrollToTop from "./Components/ScrollToTop";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

const AppContent = () => {
  const location = useLocation();
  const hideHeaderAndFooter = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/reset",
    "/onboarding",
  ];

  return (
    <>
      {!hideHeaderAndFooter.includes(location.pathname) && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
      </Routes>
      {!hideHeaderAndFooter.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
