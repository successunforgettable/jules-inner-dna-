import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ""; // Default to empty if not set

let gaInitialized = false;

export const initGA = () => {
  if (GA_MEASUREMENT_ID && !gaInitialized) {
    try {
      ReactGA.initialize(GA_MEASUREMENT_ID, {
        // Optional: You can pass GA4 Config params here if needed
        // testMode: import.meta.env.DEV, // Example: Enable test mode in development
      });
      gaInitialized = true;
      console.log("GA Initialized with ID:", GA_MEASUREMENT_ID);
    } catch (error) {
      console.error("Error initializing GA:", error);
    }
  } else if (!GA_MEASUREMENT_ID && import.meta.env.PROD) { // Only warn in production if ID is missing
    console.warn("VITE_GA_MEASUREMENT_ID is not set. GA not initialized.");
  } else if (gaInitialized) {
    // console.log("GA already initialized.");
  } else if (import.meta.env.DEV) {
    console.log("GA not initialized (DEV mode without Measurement ID or already initialized).");
  }
};

export const sendPageView = (path: string) => {
  if (gaInitialized) {
    ReactGA.send({ hitType: "pageview", page: path, title: document.title }); // Added title
    // console.log(`GA Pageview Sent: ${path}, Title: ${document.title}`);
  }
};

export const sendGAEvent = (category: string, action: string, label?: string, value?: number) => {
  if (gaInitialized) {
    ReactGA.event({
      category: category,
      action: action,
      label: label, // Optional
      value: value, // Optional
    });
    // console.log(`GA Event Sent: Category=${category}, Action=${action}, Label=${label}, Value=${value}`);
  }
};
