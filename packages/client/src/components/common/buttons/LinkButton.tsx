import React from 'react';
import { motion } from 'framer-motion';
import styles from './LinkButton.module.css'; // New CSS module for LinkButton
import clsx from 'clsx';

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  // No isLoading for simple link buttons
  size?: 'medium' | 'small'; // Default 'medium'
  // No fullWidth for link buttons typically
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  text,
  onClick,
  isDisabled = false,
  size = 'medium', // Corresponds to body-small or caption-text
  type = 'button',
  iconBefore,
  iconAfter,
  className,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      className={clsx(
        styles.linkButton,
        styles[size],
        isDisabled && styles.disabled,
        className
      )}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {iconBefore && <span className={styles.iconWrapper}>{iconBefore}</span>}
      {children || text}
      {iconAfter && <span className={styles.iconWrapper}>{iconAfter}</span>}
    </motion.button>
  );
};

export default LinkButton;
