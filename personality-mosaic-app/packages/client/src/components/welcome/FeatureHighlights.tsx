import React from 'react';
import styles from './FeatureHighlights.module.css';

interface HighlightItemProps {
  phaseName: string;
  description: string;
}

const HighlightItem: React.FC<HighlightItemProps> = ({ phaseName, description }) => (
  <div className={styles.highlightItem}>
    <div className={styles.iconPlaceholder}></div>
    <h3 className={styles.phaseName}>{phaseName}</h3>
    <p className={styles.phaseDescription}>{description}</p>
  </div>
);

const FeatureHighlights: React.FC = () => {
  const features = [
    {
      phaseName: "Foundation",
      description: "Choose your core values and fundamental traits."
    },
    {
      phaseName: "Building",
      description: "Select blocks that define your operational styles and interactions."
    },
    {
      phaseName: "Colors",
      description: "Pick palettes representing your common emotional and mental states."
    },
    {
      phaseName: "Details",
      description: "Add unique elements that signify your nuanced characteristics."
    },
    {
      phaseName: "Results",
      description: "View your complete personality tower and detailed insights report."
    }
  ];

  return (
    <section className={styles.featureHighlights}>
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
