import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PrimaryButton from '../common/buttons/PrimaryButton';
import styles from './CheckoutForm.module.css';
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender

interface CheckoutFormProps {
  selectedPlanStripePriceId: string | null; // To be used later for API call
  // clientSecret: string; // Will be needed for payment intents
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ selectedPlanStripePriceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("Stripe.js has not loaded yet.");
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("CardElement not found");
      setError("Payment details are missing. Please refresh and try again.");
      setProcessing(false);
      return;
    }

    console.log("TODO: Stripe payment submission logic here.");
    console.log("Selected Stripe Price ID:", selectedPlanStripePriceId);
    console.log("Cardholder Name:", cardholderName);
    // Example of creating a payment method:
    // const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement,
    //   billing_details: {
    //     name: cardholderName,
    //   },
    // });

    // if (pmError) {
    //   setError(pmError.message || "An error occurred creating payment method.");
    //   setProcessing(false);
    //   return;
    // }
    // console.log("PaymentMethod created:", paymentMethod);
    // TODO: Send paymentMethod.id to backend to create/confirm subscription with payment intent

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Example: Simulate success/failure for GA event
    const paymentSuccess = Math.random() > 0.3; // Simulate payment success
    if (paymentSuccess) {
      console.log("Simulated payment successful.");
      sendGAEvent('Payment', 'Success', selectedPlanStripePriceId || 'UnknownPlan');
      // TODO: Handle actual success (e.g., navigate to a success page, update user profile)
    } else {
      const simulatedError = "Simulated payment error. Please try again.";
      setError(simulatedError);
      console.log(simulatedError);
      sendGAEvent('Payment', 'Failure', selectedPlanStripePriceId || 'UnknownPlan', undefined); // Label can be error message if desired
    }
    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        color: 'var(--ui-text-primary)', // Use CSS variable if possible, else direct value
        fontFamily: 'var(--font-family-primary), sans-serif',
        fontSize: '16px', // Match --font-size-base
        '::placeholder': {
          color: 'var(--ui-text-tertiary)', // Use CSS variable if possible
        },
        padding: '12px' // Corresponds to --space-3, ensure this works or use JS options
      },
      invalid: {
        color: 'var(--system-error-primary)',
        iconColor: 'var(--system-error-primary)',
      },
    },
    // hidePostalCode: true, // Optional: if you collect billing address separately
  };

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <div className={styles.formRow}>
        <label htmlFor="cardholderName" className={styles.label}>Cardholder Name</label>
        <input
          id="cardholderName"
          type="text"
          placeholder="Full Name as it appears on card"
          className={styles.inputField}
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
          disabled={processing}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>Card Details</label>
        <CardElement options={cardElementOptions} className={styles.stripeElement} />
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <PrimaryButton type="submit" disabled={!stripe || processing} isLoading={processing} fullWidth className={styles.submitButton}>
        {processing ? 'Processing...' : 'Confirm & Pay'}
      </PrimaryButton>
    </form>
  );
};
export default CheckoutForm;
