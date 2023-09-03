import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserToken } from "../features/auth/authSlice";

const ProtectedRoutes = () => {
  const token = useSelector(selectUserToken)
  return token ? <Outlet /> : <Navigate to="/auth" replace={true} />;
};

export default ProtectedRoutes;
