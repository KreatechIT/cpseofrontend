import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "@/utils/tokenHelper";

const PrivateRoute = function () {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If not logged in or don't have access token, redirect to login page
  if (!isAuthenticated || !getAccessToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
