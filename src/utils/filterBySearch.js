/**
 * Filters an array of objects based on a search query applied to specific keys.
 *
 * @param {Array} items - Array of objects to filter.
 * @param {string} query - Search string.
 * @param {Array<string>} keys - Keys in each object to match against.
 * @returns {Array} - Filtered array.
 */
export const filterBySearch = (items, query, keys) => {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return (
        typeof value === "string" && value.toLowerCase().includes(lowerQuery)
      );
    })
  );
};
