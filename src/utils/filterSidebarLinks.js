/**
 * Recursively filters sidebar items based on permission functions.
 *
 * @param {Array} items - Array of sidebar items, each may have:
 *                        - `hasPermission`: boolean or function returning boolean
 *                        - `children`: nested array of sidebar items
 * @param {Object} permissionFns - Object containing functions to check permissions
 * @returns {Array} - Filtered array of sidebar items allowed for the current user
 */
const filterSidebarLinks = (items, permissionFns) => {
  return items
    .map((item) => {
      // Determine if this item is allowed to be shown
      // - If `hasPermission` is a function, call it with permissionFns
      // - If `hasPermission` is a boolean, use it directly
      // - If `hasPermission` is not defined, default to true
      const isAllowed =
        typeof item.hasPermission === "function"
          ? item.hasPermission(permissionFns)
          : item.hasPermission ?? true;

      // If the item is not allowed, exclude it (return null)
      if (!isAllowed) return null;

      // If the item has children, recursively filter them as well
      const filteredChildren = item.children
        ? filterSidebarLinks(item.children, permissionFns)
        : null;

      // Return a new object with the filtered children (or null if no children)
      return { ...item, children: filteredChildren };
    })
    .filter(Boolean); // Remove any nulls from the array (disallowed items)
};

export default filterSidebarLinks;
