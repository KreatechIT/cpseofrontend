/**
 * Paginates an array of items based on current page and items per page.
 *
 * @param {Array} items - Full array of items to paginate.
 * @param {number} currentPage - Current active page (1-indexed).
 * @param {number} itemsPerPage - Number of items per page.
 * @returns {Array} - Paginated slice of items.
 */
const paginate = (items, { currentPage, itemsPerPage }) => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  return items.slice(startIdx, endIdx);
};

export { paginate };
