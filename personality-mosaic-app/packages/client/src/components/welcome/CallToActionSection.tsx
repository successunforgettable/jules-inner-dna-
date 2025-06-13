import React from 'react';
import styles from './CallToActionSection.module.css'; // Assuming this exists from previous step
// Using placeholder buttons from AuthButtons for consistency,
// these would ideally be common/PrimaryButton and common/SecondaryButton
import { PrimaryButton, SecondaryButton } from '../auth/AuthButtons';

interface CallToActionSectionProps {
  onBeginAssessmentClick: () => void;
  onLoginClick: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  onBeginAssessmentClick,
  onLoginClick,
}) => {
  const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default if it's a hash link for SPA scrolling
    console.log("Learn More clicked");
    // Scrolling or navigation logic
    const targetElement = document.getElementById('feature-highlights-section'); // Assuming FeatureHighlights has an ID
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.callToActionSection}>
      <PrimaryButton onClick={onBeginAssessmentClick} className={styles.ctaButton}>
        Begin Your Assessment
      </PrimaryButton>
      <SecondaryButton onClick={onLoginClick} className={styles.ctaButton}>
        Login
      </SecondaryButton>
      <a href="#feature-highlights-section" onClick={handleLearnMore} className={styles.learnMoreLink}>
        Learn More
      </a>
    </section>
  );
};

export default CallToActionSection;
