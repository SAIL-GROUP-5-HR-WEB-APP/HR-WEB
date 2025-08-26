import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Api from "./Api";

const ProtectedRoute: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Api.get("/api/v1/auth/verified");
        if (res.status === 200) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <p>Loading...</p>; // you can replace with spinner/loader
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
