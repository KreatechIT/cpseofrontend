/**
 * Custom hook to calculate pagination ranges for displaying page numbers.
 * Supports dynamic ellipsis ("...") when there are too many pages.
 *
 * @param {number} currentPage - The current active page number.
 * @param {number} totalPages - Total number of pages available.
 * @param {number} paginationItemsToDisplay - Max number of page items to show in pagination.
 *
 * @returns {Object}
 *   - pages: Array of page numbers to display.
 *   - showLeftEllipsis: Boolean, whether to show "..." on the left.
 *   - showRightEllipsis: Boolean, whether to show "..." on the right.
 */
export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}) {
  // Determine if we need ellipsis on the left
  const showLeftEllipsis = currentPage - 1 > paginationItemsToDisplay / 2;

  // Determine if we need ellipsis on the right
  const showRightEllipsis =
    totalPages - currentPage + 1 > paginationItemsToDisplay / 2;

  /**
   * Calculate the page numbers to display based on current page and total pages.
   * Adjusts start and end range to ensure the correct number of items and handles ellipsis.
   */
  function calculatePaginationRange() {
    // If total pages are less than or equal to the max items to display, show all pages
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate half of the display items to center the current page
    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);

    // Initial start and end range around the current page
    const initialRange = {
      start: currentPage - halfDisplay,
      end: currentPage + halfDisplay,
    };

    // Adjust range to stay within 1 and totalPages
    const adjustedRange = {
      start: Math.max(1, initialRange.start),
      end: Math.min(totalPages, initialRange.end),
    };

    // If start is at the beginning, expand end to fill paginationItemsToDisplay
    if (adjustedRange.start === 1) {
      adjustedRange.end = paginationItemsToDisplay;
    }

    // If end is at the last page, move start back to show enough pages
    if (adjustedRange.end === totalPages) {
      adjustedRange.start = totalPages - paginationItemsToDisplay + 1;
    }

    // Adjust range further if ellipsis are needed
    if (showLeftEllipsis) adjustedRange.start++;
    if (showRightEllipsis) adjustedRange.end--;

    // Generate array of page numbers to display
    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, i) => adjustedRange.start + i
    );
  }

  // Calculate the final pages array
  const pages = calculatePaginationRange();

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}
