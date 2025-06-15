import React, { useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import styles from './SubscriptionPage.module.css';
import PrimaryButton from '../components/common/buttons/PrimaryButton';
import useAuthStore from '../contexts/store/useAuthStore'; // Import auth store
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender

// TODO: Define Plan interface based on Spec 23.1, move to a shared types file if used elsewhere
interface Plan {
  id: string;
  name: string;
  price: string;
  priceDetails?: string;
  cycle: string;
  features: string[];
  // isCurrentPlan?: boolean; // This will be calculated dynamically
  ctaText?: string;
  stripePriceId: string | null; // Explicitly allow null for free plan
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const currentPlanId = user?.subscriptionPlan;

  useEffect(() => {
    sendGAEvent('Subscription', 'ViewPlansPage');
  }, []);

  // Placeholder data - this would eventually come from a config or backend
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free Tier',
      price: '$0',
      cycle: '',
      features: ['1 full assessment', 'Basic report view', 'Limited assessment history'],
      stripePriceId: null, // Explicitly null
      ctaText: 'Continue with Free',
    },
    {
      id: 'premium_monthly',
      name: 'Inner DNA Premium',
      price: '$19.99', // Updated price
      cycle: '/month',
      features: ['Unlimited assessments', 'Full detailed reports', 'Complete assessment history', 'Advanced insights dashboard', 'Early access to new features'],
      stripePriceId: 'price_monthly_placeholder_xxxx', // Updated placeholder
      ctaText: 'Choose Monthly',
    },
    {
      id: 'premium_annual',
      name: 'Inner DNA Premium',
      price: '$199.99', // Updated price
      cycle: '/year',
      priceDetails: 'billed annually',
      features: ['All Premium Monthly features', '2 months free (save 16%)'],
      stripePriceId: 'price_annual_placeholder_yyyy', // Updated placeholder
      ctaText: 'Choose Annual',
    },
  ];

  const handleChoosePlan = (plan: Plan) => {
    const isUserOnPremium = currentPlanId === 'premium_monthly' || currentPlanId === 'premium_annual';

    if (plan.id === 'free' && isUserOnPremium) {
      console.log('User is Premium, cannot select Free. Or handle downgrade.');
      // Potentially navigate to a page explaining downgrade implications or support
      return;
    }
    if (plan.id === currentPlanId) {
      console.log('This is already your current plan.');
      return; // Or navigate to dashboard/profile
    }

    if (plan.id === 'free') {
      console.log('Continue with Free plan selected/confirmed.');
      sendGAEvent('Subscription', 'SelectPlan', plan.id, 0); // Value 0 for free
      navigate('/dashboard');
    } else {
      const priceAsNumber = parseFloat(plan.price.replace(/[^\d.-]/g, ''));
      sendGAEvent('Subscription', 'SelectPlan', plan.id, isNaN(priceAsNumber) ? undefined : priceAsNumber);
      console.log(`Upgrade/Change to Plan: ${plan.name} (ID: ${plan.id}, Stripe Price ID: ${plan.stripePriceId})`);
      // Navigate to a payment page, passing plan details
      // Example: navigate(`/payment?planId=${plan.id}&priceId=${plan.stripePriceId}`);
      // For this shell, we'll use a generic /payment route
      navigate('/payment', { state: { selectedPlan: plan } });
    }
  };

  return (
    <div className={styles.subscriptionPage}>
      <h1 className={styles.pageTitle}>Choose Your Plan</h1>
      <p className={styles.pageSubtitle}>Unlock the full potential of your Inner DNA insights.</p>
      <div className={styles.plansContainer}>
        {plans.map(plan => {
          const isCurrentPlan = plan.id === currentPlanId;
          const isUserPremium = currentPlanId === 'premium_monthly' || currentPlanId === 'premium_annual';
          let buttonText = plan.ctaText || 'Choose Plan';
          let buttonDisabled = false;

          if (isCurrentPlan) {
            buttonText = 'Your Current Plan';
            buttonDisabled = true;
          } else if (plan.id === 'free' && isUserPremium) {
            buttonText = 'Manage Subscription'; // Or "Downgrade to Free" if that's an option
            // Potentially disable or handle differently: for now, let handleChoosePlan manage it
          }

          return (
            <div key={plan.id} className={`${styles.planCard} ${isCurrentPlan ? styles.currentPlan : ''}`}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.planPrice}>
                {plan.price}
                {plan.cycle && <span className={styles.planCycle}>{plan.cycle}</span>}
              </p>
              {plan.priceDetails && <p className={styles.planPriceDetails}>{plan.priceDetails}</p>}
              <ul className={styles.planFeatures}>
                {plan.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
              <PrimaryButton
                onClick={() => handleChoosePlan(plan)}
                className={styles.choosePlanButton}
                disabled={buttonDisabled}
                size="large"
              >
                {buttonText}
              </PrimaryButton>
            </div>
          );
        })}
      </div>
      {/* TODO: Add FAQs or more details about plans if needed */}
    </div>
  );
};
export default SubscriptionPage;
