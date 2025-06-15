import React, { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom'; // To get selected plan from state
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../lib/stripe';
import CheckoutForm from '../components/payments/CheckoutForm';
import styles from './PaymentPage.module.css';
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender
// PrimaryButton is imported by CheckoutForm, not directly used here unless for other actions

// Interface for plan data received via route state
interface PlanForPayment {
  id: string;
  name: string;
  price: string;
  cycle: string;
  stripePriceId: string | null; // Match definition in SubscriptionPage
}

const PaymentPage: React.FC = () => {
  const stripePromise = getStripe();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<PlanForPayment | null>(null);

  useEffect(() => {
    const routeState = location.state as { selectedPlan?: PlanForPayment };
    if (routeState && routeState.selectedPlan) {
      const plan = routeState.selectedPlan;
      setSelectedPlan(plan);
      sendGAEvent('Payment', 'FormRender', plan.id); // Send event when plan is set
    } else {
      console.warn("No plan selected. Navigated to PaymentPage without state.");
      // TODO: Handle missing plan (e.g., redirect to /subscribe or show a message with a link)
    }
  }, [location.state]);

  // TODO: Fetch clientSecret from backend API to initialize Elements provider for Payment Intents
  // const [clientSecret, setClientSecret] = useState<string | null>(null);
  // useEffect(() => {
  //   if (selectedPlan?.stripePriceId) {
  //     // Example: api.post('/create-payment-intent', { priceId: selectedPlan.stripePriceId })
  //     //   .then(res => setClientSecret(res.data.clientSecret));
  //   }
  // }, [selectedPlan]);

  // For now, Elements options will be minimal as clientSecret is not fetched.
  // const elementsOptions = clientSecret ? { clientSecret, appearance: { theme: 'stripe' } } : undefined;
  const elementsOptions = undefined; // No client secret yet

  if (!selectedPlan) {
    return (
      <div className={styles.paymentPage}>
        <h1 className={styles.pageTitle}>Payment</h1>
        <p className={styles.infoText}>
          No subscription plan was selected. Please <RouterLink to="/subscribe">choose a plan</RouterLink> first.
        </p>
      </div>
    );
  }

  if (!stripePromise) {
     return (
      <div className={styles.paymentPage}>
        <h1 className={styles.pageTitle}>Subscribe to {selectedPlan.name}</h1>
        <p className={styles.planSummary}>{selectedPlan.price}{selectedPlan.cycle}</p>
        <p className={styles.infoText}>Loading payment gateway...</p>
      </div>
    );
  }

  return (
    <div className={styles.paymentPage}>
      <h1 className={styles.pageTitle}>Subscribe to {selectedPlan.name}</h1>
      <p className={styles.planSummary}>{selectedPlan.price}{selectedPlan.cycle}</p>

      <Elements stripe={stripePromise} options={elementsOptions}>
        <CheckoutForm selectedPlanStripePriceId={selectedPlan.stripePriceId} />
      </Elements>

      <p className={styles.infoText}>
        This is a UI shell. Payment intent creation and actual payment processing will be implemented in subsequent steps.
      </p>
    </div>
  );
};
export default PaymentPage;
