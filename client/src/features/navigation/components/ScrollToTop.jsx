import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Utility component that resets the window scroll position to the top upon navigation.
 * This is crucial in Single Page Applications (SPAs) where scroll state is otherwise preserved between views.
 * 
 * @returns {null} This component does not render any visual elements.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Execution of the scroll reset whenever the route (pathname) changes.
  useEffect(() => {
    // Immediate scroll to the top of the document.
    // Using 'instant' instead of 'smooth' provides a better user experience during page transitions.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
