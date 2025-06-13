## Client-Side Detail Element Experience Components

This document contains the content of components related to the Detail Element distribution experience, found in `packages/client/src/components/detail/`.

---
**File Path:** `packages/client/src/components/detail/DetailToken.tsx`
---
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './DetailToken.module.css';
import clsx from 'clsx';

export interface DetailTokenProps {
  id: string | number;
  gradientStyle: string;
  isPlaced?: boolean;
  onClick?: (id: string | number) => void;
  isDraggable?: boolean;
  title?: string;
}

const DetailToken: React.FC<DetailTokenProps> = ({
  id,
  gradientStyle,
  isPlaced = false,
  onClick,
  isDraggable = false,
  title = "Detail Token"
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // TODO (Accessibility): Consider useReducedMotion() from Framer Motion
  // to disable or simplify the pulsing animation if prefers-reduced-motion is active.
  // const shouldReduceMotion = useReducedMotion();
  // const pulseAnimation = shouldReduceMotion ? {} : { scale: [1, 1.08, 1, 1.08, 1] ... };

  const unplacedAnimation = {
    scale: [1, 1.08, 1, 1.08, 1],
    transition: {
      duration: 2.5, // Corresponds to a GDS long duration (e.g., > --animation-duration-long)
      ease: "easeInOut",
      repeat: Infinity,
      delay: Math.random() * 0.8 // Stagger animations slightly for multiple tokens
    }
  };

  return (
    <motion.div
      className={clsx(styles.detailToken, isPlaced && styles.placed)}
      style={{ background: gradientStyle }}
      onClick={handleClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && handleClick()}
      role={onClick ? "button" : undefined}
      aria-label={title}
      tabIndex={onClick ? 0 : -1}
      animate={!isPlaced && !isDraggable ? unplacedAnimation : {}}
      layout // Add layout prop for smooth transition if tokens are reordered/removed from a list
    >
      {/* Tokens are primarily visual */}
    </motion.div>
  );
};

export default DetailToken;
```

---
**File Path:** `packages/client/src/components/detail/DetailToken.module.css`
---
```css
/* DetailToken.module.css - Typography not directly applicable, uses GDS vars */
.detailToken {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circular);
  border: 1px solid rgba(var(--ui-text-on-dark-rgb), 0.8);
  box-shadow: var(--shadow-token);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--animation-duration-short) ease-out,
              box-shadow var(--animation-duration-short) ease-out;
}

.detailToken:hover:not(.placed) {
  transform: scale(1.1);
  box-shadow: var(--shadow-interactive-hover);
}

.placed {
  cursor: pointer; /* Placed tokens are also clickable to remove */
  /* No scale animation on placed tokens by default, but can have hover */
}
.placed:hover {
  transform: scale(1.05); /* Slight hover for placed tokens */
  box-shadow: var(--shadow-interactive-hover);
}

/* For drag state (if DnD is implemented later) */
/*
.dragging {
  opacity: 0.7;
  cursor: grabbing;
}
*/
```

---
**File Path:** `packages/client/src/components/detail/SubtypeContainer.tsx`
---
```tsx
import React from 'react';
import styles from './SubtypeContainer.module.css';
import clsx from 'clsx';
import DetailToken from './DetailToken';

export type SubtypeContainerId = 'self' | 'oneToOne' | 'social';

export interface SubtypeContainerProps {
  id: SubtypeContainerId;
  emoji: string;
  title: string;
  description: string;
  placedTokensCount: number;
  maxTokensForVisualDisplay?: number;
  totalTokensAllowed?: number;
  onContainerClick?: (containerId: SubtypeContainerId) => void;
  onTokenClickInContainer?: (containerId: SubtypeContainerId, tokenIndex: number) => void;
  tokenGradient: string;
  isActive?: boolean;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const SubtypeContainer: React.FC<SubtypeContainerProps> = ({
  id,
  emoji,
  title,
  description,
  placedTokensCount,
  maxTokensForVisualDisplay = 5, // Adjusted for better visual in typical container sizes
  // totalTokensAllowed, // Not directly used for rendering logic here
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

  // Calculate fill percentage based on actual placed tokens vs. a typical max (e.g. 7 or total 10).
  // For visual effect, let's assume max for 100% fill is around 7-8 tokens.
  const maxVisualFillTokens = 7;
  const fillPercentage = Math.min((placedTokensCount / maxVisualFillTokens) * 100, 100);

  return (
    <div
      className={clsx(
        styles.subtypeContainer,
        styles[sizeContext],
        isActive && styles.active,
        placedTokensCount > 0 && styles.hasTokens,
        placedTokensCount >= maxVisualFillTokens && styles.isVisuallyFull // Optional class
      )}
      onClick={handleContainerClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleContainerClick()}
      role="button"
      aria-label={`Container for ${title}. Contains ${placedTokensCount} tokens. Click to add a token.`}
      tabIndex={0}
      style={{ '--fill-percentage': `${fillPercentage}%` } as React.CSSProperties }
    >
      <div className={styles.header}>
        <span className={styles.emoji} role="img" aria-label={`${title} emoji`}>{emoji}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.tokenDisplayArea}>
        {Array.from({ length: Math.min(placedTokensCount, maxTokensForVisualDisplay) }).map((_, index) => (
          <DetailToken
            key={`${id}-token-${index}`}
            id={`${id}-token-${index}`}
            gradientStyle={tokenGradient}
            isPlaced={true}
            onClick={(e) => { // Prevent container click when clicking token
                e.stopPropagation();
                handleTokenClick(index);
            }}
            title={`Placed token ${index + 1} in ${title}. Click to remove.`}
          />
        ))}
        {placedTokensCount > maxTokensForVisualDisplay && (
          <span className={styles.extraTokensCount}>
            +{placedTokensCount - maxTokensForVisualDisplay}
          </span>
        )}
      </div>
       {placedTokensCount > 0 && (
         <div className={styles.placedTokensCountDisplay}>
            {placedTokensCount} Token{placedTokensCount === 1 ? '' : 's'}
        </div>
       )}
    </div>
  );
};

export default SubtypeContainer;
```

---
**File Path:** `packages/client/src/components/detail/SubtypeContainer.module.css`
---
```css
/* SubtypeContainer.module.css - Typography uses GDS vars */
.subtypeContainer {
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  border: 2px dashed var(--ui-border-medium);
  border-radius: var(--radius-lg);
  background-color: var(--ui-background-main);
  box-shadow: var(--shadow-dropdown);
  min-height: 120px;
  transition: border-color var(--animation-duration-short) ease,
              background-color var(--animation-duration-short) ease,
              box-shadow var(--animation-duration-short) ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.subtypeContainer::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  height: var(--fill-percentage, 0%);
  background-color: var(--ui-accent-primary);
  opacity: 0.1;
  transition: height var(--animation-duration-medium) ease-in-out;
  z-index: 0;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.subtypeContainer.active,
.subtypeContainer:hover {
  border-color: var(--ui-accent-primary);
  box-shadow: var(--shadow-interactive-hover);
}
.subtypeContainer.active {
  border-style: solid;
}

.header {
  display: flex; align-items: center;
  gap: var(--space-sm); margin-bottom: var(--space-xs);
  z-index: 1;
}
.emoji { font-size: var(--font-size-heading-h2-mobile); }
.title { /* Heading H3 */
  font-size: var(--font-size-heading-h3-mobile);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  margin-bottom: 0; /* Override global */
}
.description { /* Body Small */
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  margin-bottom: var(--space-md);
  flex-grow: 1;
  z-index: 1;
}
.tokenDisplayArea {
  display: flex; flex-wrap: wrap;
  gap: var(--space-xs);
  min-height: calc(var(--placed-stone-size-mobile, 24px) + 4px); /* Min height for one row of tokens */
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-xs) 0;
  z-index: 1;
}
.extraTokensCount { /* Caption text */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  font-style: italic; margin-left: var(--space-sm);
}
.placedTokensCountDisplay { /* Caption text */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-medium);
  color: var(--ui-accent-primary);
  text-align: center; margin-top: auto; /* Push to bottom if space */
  padding-top: var(--space-xs);
  z-index: 1;
}

/* Responsive Sizes */
.mobile { width: 100%; min-height: 120px; }
.tablet { width: 220px; min-height: 140px; }
.tablet .emoji { font-size: var(--font-size-heading-h1-mobile); }
.tablet .title { font-size: var(--font-size-heading-h3-mobile); }
.desktop { width: 240px; min-height: 160px; }
.desktop .emoji { font-size: var(--font-size-heading-h1-desktop); }
.desktop .title { font-size: var(--font-size-heading-h3-desktop); }
.desktop .description { font-size: var(--font-size-body-small-desktop); }

.desktop .extraTokensCount, .tablet .extraTokensCount,
.desktop .placedTokensCountDisplay, .tablet .placedTokensCountDisplay {
  font-size: var(--font-size-caption-text-desktop);
}
```

---
**File Path:** `packages/client/src/components/detail/TokenPool.tsx`
---
```tsx
import React from 'react';
import styles from './TokenPool.module.css';
import DetailToken from './DetailToken';
import { motion, AnimatePresence } from 'framer-motion';

export interface TokenPoolProps {
  availableTokenCount: number;
  totalTokens: number;
  tokenGradient: string;
  onPoolClick?: () => void;
  onTokenClickInPool?: (tokenIndex: number) => void;
}

const TokenPool: React.FC<TokenPoolProps> = ({
  availableTokenCount,
  totalTokens,
  tokenGradient,
  onPoolClick,
  onTokenClickInPool,
}) => {
  const tokensToDisplay = Math.min(availableTokenCount, totalTokens);

  // TODO (Accessibility): Consider useReducedMotion() for token appearance.
  // const shouldReduceMotion = useReducedMotion();
  // const tokenTransition = (index) => shouldReduceMotion ? {duration:0.01} : { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.05 };

  return (
    <div
      className={styles.tokenPoolWrapper}
      onClick={onPoolClick}
      role={onPoolClick ? "button" : undefined} // Make pool clickable if onPoolClick is provided
      tabIndex={onPoolClick ? 0 : -1}
      aria-label={onPoolClick ? "Token Pool, click to interact" : "Token Pool"}
    >
      <h3 className={styles.poolTitle}>Available Tokens</h3>
      {availableTokenCount > 0 ? (
        <div className={styles.tokensContainer}>
          <AnimatePresence>
            {Array.from({ length: tokensToDisplay }).map((_, index) => (
              <motion.div
                key={`pool-token-${index}`}
                layout // Animate layout changes (e.g. when tokens are removed)
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.03 }}
              >
                <DetailToken
                  id={`pooltoken-${index}`}
                  gradientStyle={tokenGradient}
                  isPlaced={false}
                  onClick={onTokenClickInPool ? () => onTokenClickInPool(index) : undefined}
                  title={`Available token ${index + 1}`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className={styles.allTokensDistributedText}>All tokens distributed!</p>
      )}
      <p className={styles.tokenCount}>
        {availableTokenCount} / {totalTokens} remaining
      </p>
    </div>
  );
};

export default TokenPool;
```

---
**File Path:** `packages/client/src/components/detail/TokenPool.module.css`
---
```css
/* TokenPool.module.css - Typography uses GDS vars */
.tokenPoolWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-dropdown);
  width: 100%;
  max-width: var(--max-width-content-s);
  margin: 0 auto;
}

.poolTitle { /* Heading H3 */
  font-size: var(--font-size-heading-h3-mobile);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  margin-bottom: 0; /* Override global */
}

.tokensContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  min-height: calc(32px + var(--space-xs) * 2); /* Min height for one row of tokens + padding */
  padding: var(--space-xs);
  width: 100%; /* Ensure it takes up space to center tokens */
  /* border: 1px dashed var(--ui-border-container-empty); */
  /* border-radius: var(--radius-md); */
}

.allTokensDistributedText { /* Body Main */
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  font-style: italic;
  padding: var(--space-md) 0;
}

.tokenCount { /* Caption Text */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-medium);
  color: var(--ui-text-secondary);
  background-color: var(--ui-border-container-empty);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-pill);
}

@media (min-width: 768px) {
  .poolTitle {
    font-size: var(--font-size-heading-h3-desktop);
  }
  .allTokensDistributedText {
    font-size: var(--font-size-body-main-desktop);
  }
  .tokenCount {
    font-size: var(--font-size-caption-text-desktop);
  }
}
```

This markdown contains the requested Detail Element component files.
```
