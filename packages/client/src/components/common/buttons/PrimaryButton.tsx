import React from 'react';
import { motion } from 'framer-motion';
import styles from './PrimaryButton.module.css';
import clsx from 'clsx';
// Placeholder for a Spinner component for isLoading state
// import Spinner from '../feedback/Spinner';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string; // If children are not provided
  isLoading?: boolean;
  size?: 'large' | 'medium'; // Default 'large'
  fullWidth?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  // className prop is implicitly part of ButtonHTMLAttributes
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  text,
  onClick,
  isDisabled = false,
  isLoading = false,
  size = 'large',
  type = 'button',
  fullWidth = false,
  iconBefore,
  iconAfter,
  className,
  ...props
}) => {
  const disabled = isDisabled || isLoading;

  return (
    <motion.button
      type={type}
      className={clsx(
        styles.primaryButton,
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        isLoading && styles.loading,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      // whileHover not needed here as CSS handles it, unless more complex animation desired
      {...props}
    >
      {isLoading && (
        // <Spinner size="small" color="currentColor" />
        <span className={styles.loadingSpinner} role="status" aria-live="polite"></span>
      )}
      {!isLoading && iconBefore && <span className={styles.iconWrapper}>{iconBefore}</span>}
      {!isLoading && (children || text)}
      {!isLoading && iconAfter && <span className={styles.iconWrapper}>{iconAfter}</span>}
    </motion.button>
  );
};

export default PrimaryButton;
