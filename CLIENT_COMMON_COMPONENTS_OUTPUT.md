## Client-Side Common Components

This document contains the content of reusable common components found in `packages/client/src/components/common/`.

---
**File Path:** `packages/client/src/components/common/buttons/PrimaryButton.tsx`
---
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './PrimaryButton.module.css';
import clsx from 'clsx';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLoading?: boolean;
  size?: 'large' | 'medium';
  fullWidth?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
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
      {...props}
    >
      {isLoading && (
        <span className={styles.loadingSpinner} role="status" aria-live="polite"></span>
      )}
      {!isLoading && iconBefore && <span className={styles.iconWrapper}>{iconBefore}</span>}
      {!isLoading && (children || text)}
      {!isLoading && iconAfter && <span className={styles.iconWrapper}>{iconAfter}</span>}
    </motion.button>
  );
};

export default PrimaryButton;
```

---
**File Path:** `packages/client/src/components/common/buttons/PrimaryButton.module.css`
---
```css
/* PrimaryButton.module.css */
.primaryButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);

  background-color: var(--ui-accent-primary);
  color: var(--ui-text-on-dark);

  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-pill);
  border: 2px solid transparent;

  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  transition-property: background-color, border-color, color, transform, box-shadow;
  transition-duration: var(--animation-duration-short); /* GDS Duration */
  transition-timing-function: ease-in-out; /* GDS Easing */
}

.large {
  padding: var(--space-sm) var(--space-xl);
  font-size: var(--font-size-button-text-large-mobile);
  line-height: var(--line-height-button-text-large);
}
@media (min-width: 768px) {
  .large {
    font-size: var(--font-size-button-text-large-desktop);
  }
}

.medium {
  padding: var(--space-xs) var(--space-lg);
  font-size: var(--font-size-button-text-small-mobile);
  line-height: var(--line-height-button-text-small);
}
@media (min-width: 768px) {
  .medium {
    font-size: var(--font-size-button-text-small-desktop);
  }
}

.fullWidth { width: 100%; }

.primaryButton:hover:not(.disabled) {
  background-color: var(--ui-accent-secondary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-dropdown);
}
.primaryButton:active:not(.disabled) {
  transform: translateY(0px);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  background-color: var(--ui-accent-primary);
}
.disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; transform: none; }
.loading { /* No specific style, relies on .disabled and spinner */ }

.iconWrapper { display: inline-flex; align-items: center; }
.iconWrapper svg {
  width: var(--font-size-button-text-large-desktop);
  height: var(--font-size-button-text-large-desktop);
}
.medium .iconWrapper svg {
  width: var(--font-size-button-text-small-desktop);
  height: var(--font-size-button-text-small-desktop);
}

.loadingSpinner {
  width: calc(var(--font-size-button-text-large-desktop) * 0.8);
  height: calc(var(--font-size-button-text-large-desktop) * 0.8);
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 0.8s linear infinite;
  margin-right: var(--space-xs);
}
.medium .loadingSpinner {
  width: calc(var(--font-size-button-text-small-desktop) * 0.8);
  height: calc(var(--font-size-button-text-small-desktop) * 0.8);
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---
**File Path:** `packages/client/src/components/common/buttons/SecondaryButton.tsx`
---
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './SecondaryButton.module.css';
import clsx from 'clsx';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLoading?: boolean;
  size?: 'large' | 'medium';
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
        <span className={styles.loadingSpinner} role="status" aria-live="polite"></span>
      )}
      {!isLoading && iconBefore && <span className={styles.iconWrapper}>{iconBefore}</span>}
      {!isLoading && (children || text)}
      {!isLoading && iconAfter && <span className={styles.iconWrapper}>{iconAfter}</span>}
    </motion.button>
  );
};

export default SecondaryButton;
```

---
**File Path:** `packages/client/src/components/common/buttons/SecondaryButton.module.css`
---
```css
/* SecondaryButton.module.css */
.secondaryButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);

  background-color: transparent;
  color: var(--ui-accent-primary);

  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-pill);
  border: 2px solid var(--ui-accent-primary);

  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  transition-property: background-color, border-color, color, transform, box-shadow;
  transition-duration: var(--animation-duration-short);
  transition-timing-function: ease-in-out;
}

.large {
  padding: var(--space-sm) var(--space-xl);
  font-size: var(--font-size-button-text-large-mobile);
  line-height: var(--line-height-button-text-large);
}
@media (min-width: 768px) {
  .large {
    font-size: var(--font-size-button-text-large-desktop);
  }
}

.medium {
  padding: var(--space-xs) var(--space-lg);
  font-size: var(--font-size-button-text-small-mobile);
  line-height: var(--line-height-button-text-small);
}
@media (min-width: 768px) {
  .medium {
    font-size: var(--font-size-button-text-small-desktop);
  }
}

.fullWidth { width: 100%; }

.secondaryButton:hover:not(.disabled) {
  background-color: var(--ui-accent-primary);
  color: var(--ui-text-on-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-dropdown);
}
.secondaryButton:active:not(.disabled) {
  transform: translateY(0px);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  background-color: var(--ui-accent-primary);
  color: var(--ui-text-on-dark);
}
.disabled {
  opacity: 0.6; cursor: not-allowed;
  color: var(--ui-text-secondary);
  border-color: var(--ui-border-container-empty);
  box-shadow: none; transform: none; background-color: transparent;
}
.loading { /* Spinner color will be current color (accent) */ }

.iconWrapper { display: inline-flex; align-items: center; }
.iconWrapper svg {
  width: var(--font-size-button-text-large-desktop);
  height: var(--font-size-button-text-large-desktop);
}
.medium .iconWrapper svg {
  width: var(--font-size-button-text-small-desktop);
  height: var(--font-size-button-text-small-desktop);
}

.loadingSpinner {
  width: calc(var(--font-size-button-text-large-desktop) * 0.8);
  height: calc(var(--font-size-button-text-large-desktop) * 0.8);
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%; display: inline-block;
  animation: rotation 0.8s linear infinite;
  margin-right: var(--space-xs);
}
.medium .loadingSpinner {
  width: calc(var(--font-size-button-text-small-desktop) * 0.8);
  height: calc(var(--font-size-button-text-small-desktop) * 0.8);
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---
**File Path:** `packages/client/src/components/common/buttons/LinkButton.tsx`
---
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './LinkButton.module.css';
import clsx from 'clsx';

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  size?: 'medium' | 'small';
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  text,
  onClick,
  isDisabled = false,
  size = 'medium',
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
```

---
**File Path:** `packages/client/src/components/common/buttons/LinkButton.module.css`
---
```css
/* LinkButton.module.css */
.linkButton {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xxs);
  background: none;
  border: none;
  color: var(--ui-accent-primary);
  text-decoration: underline;
  cursor: pointer;
  padding: var(--space-xxs) var(--space-xs);
  font-weight: var(--font-weight-medium);
  transition: color var(--animation-duration-micro) ease-in-out, transform var(--animation-duration-micro) ease-in-out;
  border-radius: var(--radius-sm);
}

.medium { /* Default, maps to button-text-small */
  font-size: var(--font-size-button-text-small-mobile);
  line-height: var(--line-height-button-text-small);
}
@media (min-width: 768px) {
  .medium { font-size: var(--font-size-button-text-small-desktop); }
}

.small { /* Maps to caption-text */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
}
@media (min-width: 768px) {
  .small { font-size: var(--font-size-caption-text-desktop); }
}

.linkButton:hover:not(.disabled) {
  color: var(--ui-accent-secondary);
  text-decoration: underline;
}
.linkButton:active:not(.disabled) {
  transform: translateY(1px);
  color: var(--ui-accent-secondary);
}
.linkButton:focus-visible {
  outline: 2px solid var(--ui-accent-primary);
  outline-offset: 2px;
  text-decoration: none;
}
.disabled {
  color: var(--ui-text-secondary);
  cursor: not-allowed;
  text-decoration: none;
  opacity: 0.7;
}

.iconWrapper { display: inline-flex; align-items: center; }
.iconWrapper svg {
  width: var(--font-size-button-text-small-desktop);
  height: var(--font-size-button-text-small-desktop);
}
.small .iconWrapper svg {
  width: var(--font-size-caption-text-desktop);
  height: var(--font-size-caption-text-desktop);
}
```

---
**File Path:** `packages/client/src/components/common/forms/Input.tsx`
---
```tsx
import React from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, containerClassName, className, ...props }) => {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx(styles.inputContainer, containerClassName)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={clsx(styles.input, error && styles.inputError, className)}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
```

---
**File Path:** `packages/client/src/components/common/forms/Input.module.css`
---
```css
/* Input.module.css - Typography uses GDS vars */
.inputContainer {
  display: flex; flex-direction: column;
  margin-bottom: var(--space-md); width: 100%;
}
.label {
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-medium);
  color: var(--ui-text-secondary);
  margin-bottom: var(--space-xs); text-align: left;
}
.input {
  padding: var(--space-sm);
  border: 1px solid var(--ui-border-container-empty);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  color: var(--ui-text-primary);
  background-color: var(--ui-background-main);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;
}
@media (min-width: 768px) {
  .label { font-size: var(--font-size-body-small-desktop); }
  .input { font-size: var(--font-size-body-main-desktop); }
}
.input:focus {
  outline: none;
  border-color: var(--ui-accent-primary);
  box-shadow: 0 0 0 3px rgba(var(--ui-accent-primary-rgb), 0.3);
}
.inputError { border-color: var(--system-error-primary); }
.inputError:focus {
  border-color: var(--system-error-primary);
  box-shadow: 0 0 0 3px rgba(var(--system-error-primary-rgb), 0.3);
}
.errorMessage {
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-regular);
  color: var(--system-error-primary);
  margin-top: var(--space-xs); text-align: left;
}
```

---
**File Path:** `packages/client/src/components/common/Modal.tsx`
---
```tsx
import React from 'react';
import styles from './Modal.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  // TODO (Accessibility): Consider useReducedMotion() hook from Framer Motion here
  // const shouldReduceMotion = useReducedMotion();
  // const modalVariants = shouldReduceMotion ? { ... } : { ... };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // GDS --animation-duration-short
          onClick={onClose}
        >
          <motion.div
            className={`${styles.modal} ${styles[size]}`}
            initial={{ y: -30, opacity: 0 }} // Adjusted y for subtle entry
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25, duration: parseFloat("var(--animation-duration-medium, 0.4s)") }} // GDS --animation-duration-medium
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
                  &times;
                </button>
              </div>
            )}
            <div className={styles.modalContent}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
```

---
**File Path:** `packages/client/src/components/common/Modal.module.css`
---
```css
/* Modal.module.css - Typography uses GDS vars */
.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: var(--space-md);
}
.modal {
  background-color: var(--ui-background-main);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  padding: var(--space-lg);
  display: flex; flex-direction: column;
  max-height: 90vh; overflow-y: auto;
}
.modal.small { width: 100%; max-width: 400px; }
.modal.medium { width: 100%; max-width: 550px; }
.modal.large { width: 100%; max-width: 700px; }

.modalHeader {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: var(--space-md); padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--ui-border-container-empty);
}
.modalTitle {
  font-size: var(--font-size-heading-h3-mobile);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading-h3);
  color: var(--ui-text-primary);
}
@media (min-width: 768px) {
  .modalTitle {
    font-size: var(--font-size-heading-h3-desktop);
  }
}

.closeButton {
  background: none; border: none;
  font-size: var(--font-size-heading-h2-mobile);
  font-weight: var(--font-weight-regular);
  line-height: 1;
  color: var(--ui-text-secondary);
  cursor: pointer; padding: 0 var(--space-xs);
}
.closeButton:hover { color: var(--ui-text-primary); }
.modalContent {}
```

---
**File Path:** `packages/client/src/components/common/ProtectedRoute.tsx`
---
```tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../contexts/store/useAuthStore';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

This markdown contains the requested common component files.
```
