import { loadStripe, Stripe } from '@stripe/stripe-js';

// Replace with your actual publishable key from Stripe dashboard
// Ensure this is managed via environment variables for different environments (dev, prod)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PLACEHOLDER_STRIPE_PUBLISHABLE_KEY';

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error("Stripe publishable key is not set. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.");
}

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    // Return a rejected promise or null if the key is not available
    return Promise.resolve(null);
  }
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};
