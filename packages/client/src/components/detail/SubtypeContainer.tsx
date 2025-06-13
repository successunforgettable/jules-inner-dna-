import React from 'react';
import styles from './SubtypeContainer.module.css';
import clsx from 'clsx';
import DetailToken from './DetailToken'; // To display visual representations

export type SubtypeContainerId = 'self' | 'oneToOne' | 'social';

export interface SubtypeContainerProps {
  id: SubtypeContainerId;
  emoji: string;
  title: string;
  description: string; // Type-specific
  placedTokensCount: number;
  maxTokensForVisualDisplay: number; // How many token visuals to show (e.g., 5-7) before just showing count
  totalTokensAllowed: number; // Max tokens this container can conceptually hold (e.g., 10 if all in one)
  onContainerClick?: (containerId: SubtypeContainerId) => void; // For click-to-add model
  onTokenClickInContainer?: (containerId: SubtypeContainerId, tokenIndex: number) => void; // For click-to-remove
  tokenGradient: string; // Gradient for the tokens displayed in this container
  isActive?: boolean; // e.g., if it's the currently selected target for adding tokens
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const SubtypeContainer: React.FC<SubtypeContainerProps> = ({
  id,
  emoji,
  title,
  description,
  placedTokensCount,
  maxTokensForVisualDisplay = 7, // Show up to 7 dots, then just a number
  // totalTokensAllowed, // Not directly used for rendering logic here, more for page-level validation
  onContainerClick,
  onTokenClickInContainer,
  tokenGradient,
  isActive = false,
  sizeContext = 'desktop',
}) => {

  const handleContainerClick = () => {
    if (onContainerClick) {
      onContainerClick(id);
    }
  };

  const handleTokenClick = (index: number) => {
    if (onTokenClickInContainer) {
      onTokenClickInContainer(id, index);
    }
  };

  const fillPercentage = Math.min((placedTokensCount / maxTokensForVisualDisplay) * 100, 100);
  const backgroundStyle = {
    // Using a pseudo-element for fill to not interfere with potential background images/textures
    // This is now handled in CSS with a CSS variable for percentage
  };

  return (
    <div
      className={clsx(
        styles.subtypeContainer,
        styles[sizeContext],
        isActive && styles.active,
        placedTokensCount > 0 && styles.hasTokens
      )}
      onClick={handleContainerClick}
      role="button" // Making the container itself clickable to add tokens
      aria-label={`Container for ${title}. Contains ${placedTokensCount} tokens. Click to add a token.`}
      tabIndex={0} // Make it focusable
      style={{ '--fill-percentage': `${fillPercentage}%` } as React.CSSProperties }
    >
      <div className={styles.header}>
        <span className={styles.emoji} role="img" aria-label={`${title} emoji`}>{emoji}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.tokenDisplayArea}>
        {/* Display visual tokens up to maxTokensForVisualDisplay */}
        {Array.from({ length: Math.min(placedTokensCount, maxTokensForVisualDisplay) }).map((_, index) => (
          <DetailToken
            key={`${id}-token-${index}`}
            id={`${id}-token-${index}`} // These are just visual, not the actual data tokens
            gradientStyle={tokenGradient}
            isPlaced={true}
            onClick={() => handleTokenClick(index)} // Click to remove this specific visual token
            title={`Placed token ${index + 1} in ${title}`}
          />
        ))}
        {/* If more tokens than can be visually displayed, show a counter for the remainder */}
        {placedTokensCount > maxTokensForVisualDisplay && (
          <span className={styles.extraTokensCount}>
            +{placedTokensCount - maxTokensForVisualDisplay}
          </span>
        )}
      </div>
       {placedTokensCount > 0 && (
         <div className={styles.placedTokensCountDisplay}>
            {placedTokensCount} Token{placedTokensCount === 1 ? '' : 's'} Placed
        </div>
       )}
    </div>
  );
};

export default SubtypeContainer;
