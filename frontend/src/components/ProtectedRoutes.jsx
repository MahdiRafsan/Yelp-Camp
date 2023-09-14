import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserToken } from "../features/auth/authSlice";
import { toast } from "react-toastify";
const ProtectedRoutes = () => {
  const token = useSelector(selectUserToken);
  const location = useLocation();

  if (!token) {
    toast.error("You must be logged in to access that page!");
  }

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace={true} />
  );
};

export default ProtectedRoutes;
