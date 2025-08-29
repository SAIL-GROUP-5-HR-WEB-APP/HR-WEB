// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional prop for role-based protection
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  // const user = JSON.parse(localStorage.getItem("user") || "{}"); // 👈 grab full user object

  // 🔒 Check if logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 Check if user has permission
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  // // 🚦 Special case: employees must complete onboarding before dashboard
  // if (role === "employee" && !user.isOnboarded) {
  //   return <Navigate to="/onboarding" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
