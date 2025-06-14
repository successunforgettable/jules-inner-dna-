import React from 'react';
import styles from './FeatureHighlights.module.css';

interface HighlightItemProps {
  phaseName: string;
  description: string;
  iconSvg: React.ReactNode;
}

const HighlightItem: React.FC<HighlightItemProps> = ({ phaseName, description, iconSvg }) => (
  <div className={styles.highlightItem}>
    {iconSvg}
    <h3 className={styles.phaseName}>{phaseName}</h3>
    <p className={styles.phaseDescription}>{description}</p>
  </div>
);

const commonSvgProps = {
  width: "48",
  height: "48",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  strokeWidth: "1.5",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const featureIcons: Record<string, React.ReactNode> = {
  Foundation: (
    <svg {...commonSvgProps} className={styles.iconPlaceholder} aria-label="Foundation Icon">
      <path d="M4 20h16M6 17.5L12 14l6 3.5M12 3v11" stroke="var(--ui-icon-primary)" />
    </svg>
  ),
  Building: (
    <svg {...commonSvgProps} className={styles.iconPlaceholder} aria-label="Building Icon">
      <path d="M7 19h10M7 15h10M7 11h10M7 7h10" stroke="var(--ui-icon-primary)" />
    </svg>
  ),
  Colors: (
    <svg {...commonSvgProps} className={styles.iconPlaceholder} aria-label="Colors Icon">
      <path d="M12 21a9 9 0 000-18h.5M7.5 6A2.5 2.5 0 015 8.5 2.5 2.5 0 012.5 6 2.5 2.5 0 015 3.5a2.5 2.5 0 012.5 2.5zM17.5 6A2.5 2.5 0 0115 8.5a2.5 2.5 0 01-2.5-2.5A2.5 2.5 0 0115 3.5a2.5 2.5 0 012.5 2.5zM12.5 11a2.5 2.5 0 01-2.5 2.5A2.5 2.5 0 017.5 11a2.5 2.5 0 012.5-2.5A2.5 2.5 0 0112.5 11z" stroke="var(--ui-icon-primary)" />
    </svg>
  ),
  Details: (
    <svg {...commonSvgProps} className={styles.iconPlaceholder} aria-label="Details Icon">
      <path d="M12 2l.9 2.8L16 6l-2.1 2.1.9 2.9L12 9.8l-2.8 1.2.9-2.9L8 6l3.1-.2.9-2.8zM12 12l.9 2.8L16 16l-2.1 2.1.9 2.9L12 19.8l-2.8 1.2.9-2.9L8 16l3.1-.2.9-2.8z" stroke="var(--ui-icon-primary)" />
    </svg>
  ),
  Results: (
    <svg {...commonSvgProps} className={styles.iconPlaceholder} aria-label="Results Icon">
      <path d="M14 3v4a1 1 0 001 1h4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M5 3a2 2 0 012-2h7l5 5v1a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" stroke="var(--ui-icon-primary)" />
    </svg>
  ),
};

const FeatureHighlights: React.FC = () => {
  const featuresData = [
    {
      phaseName: "Foundation",
      description: "Choose core values that form your personality foundation",
      iconSvg: featureIcons["Foundation"]
    },
    {
      phaseName: "Building",
      description: "Select behavioral patterns that shape your tower structure",
      iconSvg: featureIcons["Building"]
    },
    {
      phaseName: "Colors",
      description: "Paint your tower with your emotional and mental states",
      iconSvg: featureIcons["Colors"]
    },
    {
      phaseName: "Details",
      description: "Add finishing touches that show your life priorities",
      iconSvg: featureIcons["Details"]
    },
    {
      phaseName: "Results",
      description: "Discover your complete personality profile and growth path",
      iconSvg: featureIcons["Results"]
    }
  ];

  return (
    <section className={styles.featureHighlights}>
      <h2 className={styles.sectionTitle}>How You'll Build Your Tower</h2>
      <div className={styles.highlightsContainer}>
        {featuresData.map((feature) => (
          <HighlightItem key={feature.phaseName} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
