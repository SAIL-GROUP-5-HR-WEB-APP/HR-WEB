// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional prop for role-based protection
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Rehydrate auth state from localStorage on mount
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("role");
    setToken(storedToken);
    setRole(storedRole);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // ⏳ prevent redirect flicker
  }

  // 🔒 Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 Logged in but no access → go to home
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
