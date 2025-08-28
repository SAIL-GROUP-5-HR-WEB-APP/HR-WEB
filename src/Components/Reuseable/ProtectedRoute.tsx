// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  //  Get token from localStorage
  const token = localStorage.getItem("authToken");

  //  Check if token exists
  if (!token) {
    // No token → redirect to login
    return <Navigate to="/login" replace />;
  }

  //  Token exists → allow access to the protected page
  return children;
};

export default ProtectedRoute;
