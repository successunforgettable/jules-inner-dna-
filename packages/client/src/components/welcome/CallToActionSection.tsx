import React from 'react';
import styles from './CallToActionSection.module.css';
import PrimaryButton from '../common/buttons/PrimaryButton';
import SecondaryButton from '../common/buttons/SecondaryButton';
import LinkButton from '../common/buttons/LinkButton';

interface CallToActionSectionProps {
  onBeginAssessmentClick: () => void;
  onLoginClick: () => void;
  beginButtonText?: string; // New optional prop
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  onBeginAssessmentClick,
  onLoginClick,
  beginButtonText = "Begin Your Assessment", // Default text
}) => {
  const handleLearnMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Learn More clicked");
    const targetElement = document.getElementById('feature-highlights-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.callToActionSection}>
      <PrimaryButton
        onClick={onBeginAssessmentClick}
        className={styles.ctaButton}
        size="large"
      >
        {beginButtonText} {/* Use dynamic text */}
      </PrimaryButton>
      <SecondaryButton
        onClick={onLoginClick}
        className={styles.ctaButton}
        size="large"
      >
        Login
      </SecondaryButton>
      <LinkButton onClick={handleLearnMore} className={styles.learnMoreLink}>
        Learn More
      </LinkButton>
    </section>
  );
};

export default CallToActionSection;
