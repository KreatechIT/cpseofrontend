import { useRef, useCallback } from "react";

/**
 * Custom hook to prevent automatic focus on a component when it is opened.
 * Useful in cases where a component (like a dropdown or modal) auto-focuses
 * an element, but you want to control focus manually.
 *
 * Returns a `ref` to attach to the element, an `onOpenAutoFocus` handler
 * to prevent default auto-focus behavior, and a `tabIndex` for keyboard accessibility.
 */
const usePreventAutoFocus = () => {
  // Create a ref to attach to the element we want to control focus for
  const ref = useRef(null);

  /**
   * Callback to prevent the automatic focus behavior when a component opens.
   * @param {Event} event - The auto-focus event triggered by the component
   */
  const onOpenAutoFocus = useCallback((event) => {
    // Prevent the default auto-focus action
    event.preventDefault();

    // Optionally focus the element manually without scrolling
    ref.current?.focus({ preventScroll: true });
  }, []);

  // Return the ref, the auto-focus handler, and a tabIndex to make it focusable
  return { ref, onOpenAutoFocus, tabIndex: -1 };
};

export default usePreventAutoFocus;
