## Client-Side Welcome Screen Components

This document contains the content of Welcome screen components found in `packages/client/src/components/welcome/`.

---
**File Path:** `packages/client/src/components/welcome/WelcomeLayout.tsx`
---
```tsx
import React from 'react';
import styles from './WelcomeLayout.module.css';

interface WelcomeLayoutProps {
  children: React.ReactNode;
}

const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({ children }) => {
  return (
    <div className={styles.welcomeLayout}>
      <div className={styles.maxWidthContainer}>
        {children}
      </div>
    </div>
  );
};

export default WelcomeLayout;
```

---
**File Path:** `packages/client/src/components/welcome/WelcomeLayout.module.css`
---
```css
/* WelcomeLayout.module.css - Updated to use a static gradient */
.welcomeLayout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
  /* Static gradient using GDS variables */
  background: linear-gradient(135deg, var(--ui-background-welcome-gradient-start), var(--ui-background-welcome-gradient-end));
}

.maxWidthContainer {
  width: 100%;
  max-width: var(--max-width-welcome);
  margin-left: auto;
  margin-right: auto;
  padding: 0 var(--space-md); /* Mobile padding */
}

@media (min-width: 768px) { /* Tablet and Desktop */
  .maxWidthContainer {
    padding: 0 var(--space-lg); /* Desktop padding */
  }
}

@media (min-width: 1024px) {
  .maxWidthContainer {
    padding: 0 var(--space-xl); /* Larger Desktop padding */
  }
}
```

---
**File Path:** `packages/client/src/components/welcome/WelcomeHeader.tsx`
---
```tsx
import React from 'react';
import styles from './WelcomeHeader.module.css';

const WelcomeHeader: React.FC = () => {
  return (
    <header className={styles.welcomeHeader}>
      {/* Apply .h1-style or .display-large if defined in globals.css, or use h1 directly */}
      <h1 className={styles.logoTitle}>Personality Mosaic</h1>
      {/* Apply .h3-style or similar if defined, or use p/h2 directly */}
      <p className={styles.subtitle}>Build Your Personality Tower</p>
    </header>
  );
};

export default WelcomeHeader;
```

---
**File Path:** `packages/client/src/components/welcome/WelcomeHeader.module.css`
---
```css
/* WelcomeHeader.module.css - Typography uses GDS vars */
.welcomeHeader {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.logoTitle { /* GDS Display Large */
  font-size: var(--font-size-display-large-mobile);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-display-large);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-xs);
}

.subtitle { /* GDS Heading H3 (as per visual hierarchy for a subtitle to Display Large) */
  font-size: var(--font-size-heading-h3-mobile);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading-h3);
  color: var(--ui-text-secondary);
}

@media (min-width: 768px) {
  .logoTitle {
    font-size: var(--font-size-display-large-desktop);
  }
  .subtitle {
    font-size: var(--font-size-heading-h3-desktop);
  }
}
```

---
**File Path:** `packages/client/src/components/welcome/HeroSection.tsx`
---
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  // TODO (Accessibility): Consider using useReducedMotion() from Framer Motion
  // to disable or simplify the floating animation if prefers-reduced-motion is active.
  // Example:
  // const shouldReduceMotion = useReducedMotion();
  // const yAnimation = shouldReduceMotion ? ["0px", "0px"] : ["-5px", "5px", "-5px"];
  // animate={{ y: yAnimation }}

  return (
    <section className={styles.heroSection}>
      <motion.div
        className={styles.towerPreviewPlaceholder}
        animate={{
          y: ["-5px", "5px", "-5px"],
        }}
        transition={{
          duration: 2, // Adjusted duration, conceptually var(--animation-duration-long)
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <p>Animated Tower Preview (300x400)</p>
        {/* This inner <p> should also use GDS typography if it's actual text */ }
      </motion.div>
      <div className={styles.descriptionContainer}>
        <p className={styles.descriptionText}>
          Welcome to Personality Mosaic! Embark on a visual journey to construct your unique personality tower.
          Each choice, from foundational stones to intricate details, contributes to a personalized structure
          reflecting your core traits, operational states, and how you navigate the world.
          Discover your architectural self.
        </p>
        <p className={styles.timeEstimate}>
          Estimated time to complete: 5-7 minutes
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
```

---
**File Path:** `packages/client/src/components/welcome/HeroSection.module.css`
---
```css
/* HeroSection.module.css - Typography uses GDS vars */
.heroSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.towerPreviewPlaceholder {
  width: 300px;
  height: 400px;
  background-color: var(--ui-accent-secondary);
  color: var(--ui-text-on-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
}
.towerPreviewPlaceholder p { /* Text inside placeholder */
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  padding: var(--space-md);
  margin-bottom: 0; /* Reset from global p */
}

.descriptionContainer {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.descriptionText { /* Body Main */
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  color: var(--ui-text-secondary);
  font-weight: var(--font-weight-regular);
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 0; /* Reset from global p */
}

.timeEstimate { /* Caption Text */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  color: var(--ui-text-secondary);
  font-weight: var(--font-weight-regular);
  font-style: italic;
  margin-bottom: 0; /* Reset from global p */
}

@media (min-width: 768px) {
  .heroSection {
    flex-direction: row;
    text-align: left;
    gap: var(--space-xl);
  }

  .descriptionContainer {
    align-items: flex-start;
  }

  .descriptionText {
    font-size: var(--font-size-body-main-desktop);
    margin: 0;
  }
  .towerPreviewPlaceholder p {
     font-size: var(--font-size-body-small-desktop);
  }
  /* .timeEstimate uses mobile size for desktop too as per GDS scale for caption */
}
```

---
**File Path:** `packages/client/src/components/welcome/FeatureHighlights.tsx`
---
```tsx
import React from 'react';
import styles from './FeatureHighlights.module.css';

interface HighlightItemProps {
  phaseName: string;
  description: string;
  // icon?: React.ReactNode; // Future: Pass actual icons
}

const HighlightItem: React.FC<HighlightItemProps> = ({ phaseName, description }) => (
  <div className={styles.highlightItem}>
    <div className={styles.iconPlaceholder}></div> {/* Placeholder for icon */}
    <h3 className={styles.phaseName}>{phaseName}</h3>
    <p className={styles.phaseDescription}>{description}</p>
  </div>
);

const FeatureHighlights: React.FC = () => {
  const features = [
    { phaseName: "Foundation", description: "Choose your core values and fundamental traits." },
    { phaseName: "Building", description: "Select blocks that define your operational styles and interactions." },
    { phaseName: "Colors", description: "Pick palettes representing your common emotional and mental states." },
    { phaseName: "Details", description: "Add unique elements that signify your nuanced characteristics." },
    { phaseName: "Results", description: "View your complete personality tower and detailed insights report." }
  ];

  return (
    <section className={styles.featureHighlights} id="feature-highlights-section">
      <h2 className={styles.sectionTitle}>How You'll Build Your Tower</h2>
      <div className={styles.highlightsContainer}>
        {features.map((feature) => (
          <HighlightItem key={feature.phaseName} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
```

---
**File Path:** `packages/client/src/components/welcome/FeatureHighlights.module.css`
---
```css
/* FeatureHighlights.module.css - Typography uses GDS vars */
.featureHighlights {
  width: 100%;
  padding: var(--space-lg) 0;
  text-align: center;
}

.sectionTitle { /* Heading H2 */
  font-size: var(--font-size-heading-h2-mobile);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading-h2);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-lg);
}

.highlightsContainer {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.highlightItem {
  background-color: var(--ui-background-main);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-dropdown);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.iconPlaceholder {
  width: 48px;
  height: 48px;
  background-color: var(--ui-accent-secondary);
  border-radius: var(--radius-circular);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-text-on-dark);
  font-size: 24px; /* For potential text icon, not primary text */
}

.phaseName { /* Body Large (semibold) */
  font-size: var(--font-size-body-large-mobile);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-body-large);
  color: var(--ui-text-primary);
  margin-bottom: 0; /* Reset from global h3 if used */
}

.phaseDescription { /* Body Small */
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  max-width: 300px;
  margin-bottom: 0; /* Reset from global p */
}

@media (min-width: 768px) {
  .sectionTitle {
    font-size: var(--font-size-heading-h2-desktop);
  }
  .highlightsContainer {
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    gap: var(--space-md);
  }
  .highlightItem {
    flex: 1;
    max-width: 200px; /* Max width for each item in a row */
  }
  .phaseName {
    font-size: var(--font-size-body-large-desktop);
  }
  .phaseDescription {
    font-size: var(--font-size-body-small-desktop);
  }
}
```

---
**File Path:** `packages/client/src/components/welcome/CallToActionSection.tsx`
---
```tsx
import React from 'react';
import styles from './CallToActionSection.module.css';
import PrimaryButton from '../common/buttons/PrimaryButton';
import SecondaryButton from '../common/buttons/SecondaryButton';
import LinkButton from '../common/buttons/LinkButton';

interface CallToActionSectionProps {
  onBeginAssessmentClick: () => void;
  onLoginClick: () => void;
  beginButtonText?: string;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  onBeginAssessmentClick,
  onLoginClick,
  beginButtonText = "Begin Your Assessment",
}) => {
  const handleLearnMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
        {beginButtonText}
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
```

---
**File Path:** `packages/client/src/components/welcome/CallToActionSection.module.css`
---
```css
/* CallToActionSection.module.css - Typography from common buttons */
.callToActionSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg) 0;
  margin-top: var(--space-lg);
}

.ctaButton {
  min-width: 240px;
  /* Typography (font-size, line-height, font-weight) is handled by PrimaryButton/SecondaryButton components */
}

.learnMoreLink {
  margin-top: var(--space-xs);
  /* Typography (font-size, line-height, font-weight) is handled by LinkButton component.
     Can override specific aspects here if needed for this context.
     e.g., color: var(--ui-text-secondary);
  */
}

@media (min-width: 768px) {
  .callToActionSection {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-lg);
  }
}
```

This markdown contains the requested Welcome Screen component files.
```
