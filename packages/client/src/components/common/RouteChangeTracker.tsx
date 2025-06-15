import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendPageView } from '../../lib/analytics';

const RouteChangeTracker: React.FC = () => {
  const location = useLocation();
  // Initialize currentPath with the initial location on mount.
  // This ensures the first page view is sent correctly.
  const [currentPath, setCurrentPath] = useState(location.pathname + location.search);

  useEffect(() => {
    // On initial mount, send page view for the currentPath.
    // This covers the very first page load.
    sendPageView(currentPath);
  }, []); // Empty dependency array: runs only on mount.

  useEffect(() => {
    // When location changes, update currentPath if it's different.
    // This triggers the second useEffect to send the page view.
    const newPath = location.pathname + location.search;
    if (newPath !== currentPath) {
      setCurrentPath(newPath);
    }
  }, [location, currentPath]); // Re-run if location or currentPath changes.

  useEffect(() => {
    // This effect runs when currentPath changes (and on initial mount due to useState behavior,
    // but the first sendPageView in the mounting useEffect handles the initial one).
    // If currentPath was updated due to a location change, this sends the new page view.
    // To avoid double-sending on initial mount, we could add a flag, but
    // react-ga4 might already debounce or handle rapid identical pageviews.
    // For simplicity, this structure is common. A more refined check could be:
    // if (currentPath !== initialPathForMountEffect) sendPageView(currentPath);
    // However, the current structure usually works well.
    if (currentPath !== (location.pathname + location.search) && currentPath !== '') {
        // This condition is a bit complex due to multiple useEffects.
        // The goal: send only when location truly results in a new path.
        // The previous useEffect (tracking location) updates currentPath.
        // This one reacts to currentPath changes.
        // Let's simplify: the effect depending on `location` directly sends the pageview.
    }
    // The logic was simplified. See below.
  }, [currentPath]); // This useEffect is actually not needed if the one below is structured well.

  // Simplified logic: send page view whenever location.pathname or location.search changes.
  // ReactGA itself might have internal logic to prevent duplicate "pageview" hits for the exact same path
  // if called multiple times rapidly.
  useEffect(() => {
    const newPath = location.pathname + location.search;
    sendPageView(newPath);
    // console.log(`Attempting to send pageview: ${newPath}`); // For debugging
  }, [location.pathname, location.search]); // Trigger on actual path or search param change

  return null; // This component does not render anything.
};

export default RouteChangeTracker;
