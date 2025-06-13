import React from 'react';
import styles from './AuthModal.module.css'; // Using the same shared CSS module
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary'; // For more button types if needed
}

export const PrimaryButton: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button className={clsx(styles.button, styles.primaryButton, className)} {...props}>
    {children}
  </button>
);

export const SecondaryButton: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button className={clsx(styles.button, styles.secondaryButton, className)} {...props}>
    {children}
  </button>
);

// A button styled like a link, often used for secondary actions like "Forgot password?" or switching forms
export const SecondaryLinkButton: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button className={clsx(styles.linkButton, className)} {...props}>
    {children}
  </button>
);
