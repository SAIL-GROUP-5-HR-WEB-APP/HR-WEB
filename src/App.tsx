import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Faqs from "./Pages/Faqs";
import Header from "./Static/Header";
import Footer from "./Static/Footer";
import LoginPage from "./Pages/LoginPage";
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
import EmployeeVotingSection from "./Pages/EmployeeVotingSection";
import SingleEmployeedetails from "./Pages/SingleEmployeedetails";
import Settings from "./Pages/Settings";
import Attendance from "./Pages/Attendance";
import DemoPage from "./Pages/DemoPage";
import HRVoteLeaderboard from "./Pages/HRVoteLeaderboard";
import AnonymousSurveyForm from "./Pages/AnonymousSurveyForm";

const AppContent = () => {
  const location = useLocation();

  // Paths where header & footer should be hidden
  const hideHeaderAndFooterPaths = [
    "/login",
    "/changepassword",
    "/reset-password",
    "/onboarding",
    "/dashboard",
    "/EmployeeDashboard",
    "/OTP",
    "/setting",
    "/admin",
    "/demo",
    "/SingleEmployeedetails",
    "/vote",
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
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/changepassword" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/OTP" element={<OTPmodal />} />

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
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vote"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeVotingSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <AnonymousSurveyForm />
            </ProtectedRoute>
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
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaderboard" element={<HRVoteLeaderboard />} />
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
