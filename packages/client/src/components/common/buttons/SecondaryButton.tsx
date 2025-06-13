import React from 'react';
import { motion } from 'framer-motion';
import styles from './SecondaryButton.module.css'; // Separate CSS module
import clsx from 'clsx';
// import Spinner from '../feedback/Spinner';

// Props can be very similar to PrimaryButtonProps
export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLoading?: boolean;
  size?: 'large' | 'medium'; // Default 'large'
  fullWidth?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
        styles.secondaryButton,
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        isLoading && styles.loading,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
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

export default SecondaryButton;
