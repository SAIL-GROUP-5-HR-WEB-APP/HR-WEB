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
import HrDashboard from "./Pages/HrDashboard"; // dashboard home page
import Leave from "./Pages/Leave";
import Departments from "./Pages/Departments";
import EmployeesDetails from "./Pages/EmployeesDetails";
import Payroll from "./Pages/Payroll";
import DepartmentDetails from "./Pages/DepartmentDetails"; // This import is crucial for the routing to work
import DashboardLayout from "./Pages/DashboardLayout"; // layout wrapper
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import OTPmodal from "./Pages/OTPmodal";
import ProtectedRoute from "./Components/Reuseable/ProtectedRoute";
import SuperAdmin from "./Pages/SuperAdmin";
import Unauthorized from "./Pages/Unauthorized";
import SingleEmployeedetails from "./Pages/SingleEmployeedetails";
import Settings from "./Pages/Settings";

const AppContent = () => {
  const location = useLocation();

  // Paths where header & footer should be hidden
  const hideHeaderAndFooterPaths = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/reset-password",
    "/onboarding",
    "/dashboard",
    "/EmployeeDashboard",
    "/OTP",
    "/setting",
    "/admin",
    "/unauthorized",
    "/SingleEmployeedetails",
  ];

  const shouldHide = hideHeaderAndFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHide && <Header />}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/OTP" element={<OTPmodal />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/SingleEmployeedetails/:id"
          element={<SingleEmployeedetails />}
        />

        {/* Protected Routes */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SuperAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/EmployeeDashboard"
          element={
            // <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Dashboard with nested protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HrDashboard />} /> {/* default dashboard */}
          <Route path="leave" element={<Leave />} />
          <Route path="department" element={<Departments />} />
          <Route path="department/:id" element={<DepartmentDetails />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="employees" element={<EmployeesDetails />} />
        </Route>
      </Routes>

      {!shouldHide && <Footer />}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
