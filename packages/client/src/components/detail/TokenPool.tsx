import React from 'react';
import styles from './TokenPool.module.css';
import DetailToken from './DetailToken';
import { motion, AnimatePresence } from 'framer-motion';

export interface TokenPoolProps {
  availableTokenCount: number;
  totalTokens: number; // e.g., 10
  tokenGradient: string; // Gradient for tokens in the pool
  onPoolClick?: () => void; // If clicking the pool itself has an action (e.g., add token to active container)
  onTokenClickInPool?: (tokenIndex: number) => void; // If individual tokens in pool are clickable to "send"
}

const TokenPool: React.FC<TokenPoolProps> = ({
  availableTokenCount,
  totalTokens,
  tokenGradient,
  onPoolClick, // Not used in this specific click-to-add model for containers
  onTokenClickInPool,
}) => {
  const tokensToDisplay = Math.min(availableTokenCount, totalTokens); // Don't display more than total

  return (
    <div className={styles.tokenPoolWrapper} onClick={onPoolClick} role={onPoolClick ? "button" : undefined} tabIndex={onPoolClick ? 0 : undefined}>
      <h3 className={styles.poolTitle}>Available Tokens</h3>
      {availableTokenCount > 0 ? (
        <div className={styles.tokensContainer}>
          <AnimatePresence>
            {Array.from({ length: tokensToDisplay }).map((_, index) => (
              <motion.div
                key={`pool-token-${index}`} // Key needs to be stable if order changes, but here it's just count
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.05 }}
              >
                <DetailToken
                  id={`pooltoken-${index}`}
                  gradientStyle={tokenGradient}
                  isPlaced={false} // These are in the pool
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
