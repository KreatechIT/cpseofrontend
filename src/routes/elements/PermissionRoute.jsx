import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import usePermission from "@/hooks/usePermission";

const UnauthorisedPage = lazy(() => import("@/pages/UnauthorisedPage"));

const PermissionRoute = ({ children, userType, permission }) => {
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  // Check role match
  if (userType !== user?.role.toLowerCase()) {
    return (
      <Suspense fallback={null}>
        <UnauthorisedPage />
      </Suspense>
    );
  }

  // Only check permission if it's provided
  if (permission && !hasPermission(permission)) {
    return (
      <Suspense fallback={null}>
        <UnauthorisedPage />
      </Suspense>
    );
  }

  return children;
};

export default PermissionRoute;
