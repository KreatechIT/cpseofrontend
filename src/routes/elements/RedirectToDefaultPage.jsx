import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RedirectToDefaultPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "ADMIN") {
    return <Navigate to="/user-access/dashboard" replace />;
  } else {
    return <Navigate to="/seo/dashboard" replace />;
  }
};

export default RedirectToDefaultPage;
