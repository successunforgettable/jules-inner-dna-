import React from 'react';
import styles from './ScoreBarDisplay.module.css';
import clsx from 'clsx';

export interface ScoreBarDisplayProps {
  scores: Record<string, number>; // e.g., {"1": 0.25, "2": 0.15, ...} (normalized scores)
  primaryType?: string; // The user's primary type string, e.g., "1"
  title?: string; // Optional title for the display, e.g., "Enneagram Type Scores"
}

const ScoreBarDisplay: React.FC<ScoreBarDisplayProps> = ({ scores, primaryType, title }) => {
  // Sort scores for display: primary type first, then by score descending, then by type number
  const sortedScoreEntries = Object.entries(scores).sort(([typeA, scoreA], [typeB, scoreB]) => {
    if (typeA === primaryType) return -1;
    if (typeB === primaryType) return 1;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return parseInt(typeA) - parseInt(typeB);
  });

  return (
    <div className={styles.scoreBarDisplayContainer}>
      {title && <h3 className={styles.displayTitle}>{title}</h3>}
      <ul className={styles.scoreList}>
        {sortedScoreEntries.map(([type, score]) => {
          const percentage = Math.max(0, Math.min(score * 100, 100)); // Ensure 0-100 range
          const isPrimary = type === primaryType;
          return (
            <li key={type} className={clsx(styles.scoreItem, isPrimary && styles.primaryType)}>
              <span className={styles.typeLabel}>Type {type}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(percentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Score for Type ${type}: ${Math.round(percentage)}%`}
                />
              </div>
              <span className={styles.percentageLabel}>{Math.round(percentage)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ScoreBarDisplay;
