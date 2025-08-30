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

  // 🔒 Check if logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 Check if user has permission
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
