import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * usePermission
 *
 * A strict React hook for checking permissions using explicit "resource.action" format only.
 * - No default actions assumed
 * - Case-insensitive matching
 */
const usePermission = () => {
  // Safely memoize permissions to prevent selector warnings
  const rawPermissions = useSelector((state) => state.auth.user?.permissions);
  const permissions = useMemo(() => rawPermissions || {}, [rawPermissions]);

  /**
   * Parses a permission string like "admin.edit" into { key, action }.
   * Returns { key: null, action: null } if input is invalid or incomplete.
   */
  const parseDotPermission = (input) => {
    if (typeof input !== "string" || !input.includes(".")) {
      return { key: null, action: null };
    }

    const [key, action] = input.split(".");
    if (!key || !action) return { key: null, action: null };

    return {
      key: key.toLowerCase(),
      action: action.toLowerCase(),
    };
  };

  /**
   * Checks if the user has a specific permission (e.g., "admin.edit").
   * Returns false for invalid or incomplete strings.
   */
  const hasPermission = (permission) => {
    const { key, action } = parseDotPermission(permission);
    if (!key || !action) return false;

    const resourceKey = `${key}Actions`;
    return !!permissions?.[resourceKey]?.[action];
  };

  /**
   * Checks if the user has at least one of the given permissions.
   * @param {string[]} permissionList - e.g. ["admin.edit", "role.archive"]
   */
  const hasAnyPermission = (permissionList = []) => {
    return permissionList.some((perm) => hasPermission(perm));
  };

  /**
   * Checks if the user has all of the given permissions.
   * @param {string[]} permissionList - e.g. ["admin.edit", "role.archive"]
   */
  const hasAllPermission = (permissionList = []) => {
    return permissionList.every((perm) => hasPermission(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
  };
};

export default usePermission;
