## Client-Side Authentication Components

This document contains the content of authentication components found in `packages/client/src/components/auth/`. These components now utilize common button and form elements.

---
**File Path:** `packages/client/src/components/auth/AuthModal.module.css`
---
```css
/* AuthModal.module.css - Shared styles for RegistrationModal and LoginModal */
/* Typography uses GDS vars. Button styles are now handled by common button components. */

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.modalBenefitsText {
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.serverError {
  background-color: var(--system-error-background);
  color: var(--system-error-primary);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  text-align: center;
  margin-bottom: var(--space-sm);
}

/* Styling for the main submit button if it's a direct child of the form */
.form > button[type="submit"] {
  margin-top: var(--space-sm); /* Ensures space above the primary action button */
}

.switchFormLink { /* The text part "Already have an account?" or "Don't have an account?" */
  text-align: center;
  margin-top: var(--space-sm);
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
}
/* The actual clickable part (e.g., "Login", "Create Account") within .switchFormLink
   will be a LinkButton component from common/buttons. */


.forgotPasswordLinkContainer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-xs);
  /* The clickable part within .forgotPasswordLinkContainer will be a LinkButton component. */
}

/* Responsive adjustments for text elements if needed */
@media (min-width: 768px) {
  .modalBenefitsText,
  .serverError,
  .switchFormLink {
    font-size: var(--font-size-body-small-desktop);
  }
}
```

---
**File Path:** `packages/client/src/components/auth/LoginModal.tsx`
---
```tsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import api from '../../services/api';
import styles from './AuthModal.module.css';
import PrimaryButton from '../common/buttons/PrimaryButton'; // Common Button
import LinkButton from '../common/buttons/LinkButton';     // Common Button
import useAuthStore, { UserProfile } from '../../contexts/store/useAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (data: { accessToken: string; user: UserProfile }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({}); // For client-side validation messages

  const isLoading = useAuthStore((state) => state.isLoading);
  const serverError = useAuthStore((state) => state.error); // Auth error from store
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous server errors from store
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post<{ accessToken: string; user: UserProfile; refreshToken: string; message: string }>('/auth/login', { email, password });
      // setLoading(false) will be called by onLoginSuccess via the store's loginSuccess action
      onLoginSuccess({accessToken: response.data.accessToken, user: response.data.user });
    } catch (err: any) {
      // setLoading(false) will be called by setError via the store's setError action
      let errorMessage = 'Login failed. Please check your credentials or try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
        if (err.response.data.errors) {
          const backendErrors:Record<string, string[]> = err.response.data.errors;
          const newClientErrors: Record<string, string> = {};
          for (const field in backendErrors) {
            if (backendErrors[field] && backendErrors[field].length > 0) {
              newClientErrors[field] = backendErrors[field][0]; // Show first error for the field
            }
          }
          setErrors(prevErrors => ({...prevErrors, ...newClientErrors}));
        }
      }
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  // Effect to clear form and errors when modal is closed/opened
  useEffect(() => {
    if (!isOpen) { // When closing
      setEmail('');
      setPassword('');
      setErrors({});
      // setError(null); // Clear server error from store only when opening a new modal instance (done in WelcomePage)
    } else { // When opening
       setError(null); // Clear any existing auth error from previous attempts
       setErrors({}); // Clear client-side errors
    }
  }, [isOpen, setError]); // setError is stable from Zustand

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login to Your Account">
      <form onSubmit={handleSubmit} className={styles.form}>
        {serverError && <p className={styles.serverError}>{serverError}</p>}
        <Input
          label="Email" type="email" name="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email} disabled={isLoading}
        />
        <Input
          label="Password" type="password" name="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password} disabled={isLoading}
        />
        <div className={styles.forgotPasswordLinkContainer}>
          <LinkButton type="button" onClick={() => console.log('Forgot password clicked')} disabled={isLoading} size="small">
            Forgot Password?
          </LinkButton>
        </div>
        <PrimaryButton type="submit" disabled={isLoading} fullWidth={true} size="large">
          {isLoading ? 'Logging In...' : 'Login'}
        </PrimaryButton>
        <div className={styles.switchFormLink}>
          Don't have an account?{' '}
          <LinkButton type="button" onClick={onSwitchToRegister} disabled={isLoading} size="medium">
            Create Account
          </LinkButton>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
```

---
**File Path:** `packages/client/src/components/auth/RegistrationModal.tsx`
---
```tsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import api from '../../services/api';
import styles from './AuthModal.module.css';
import PrimaryButton from '../common/buttons/PrimaryButton'; // Common Button
import LinkButton from '../common/buttons/LinkButton';     // Common Button
import useAuthStore from '../../contexts/store/useAuthStore';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegistrationSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLoading = useAuthStore((state) => state.isLoading);
  const serverError = useAuthStore((state) => state.error);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      // setLoading(false) will be called by onRegistrationSuccess (via store) or setError
      onRegistrationSuccess();
    } catch (err: any) {
      // setLoading(false) will be called by setError
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
        if (err.response.data.errors) {
          const backendErrors:Record<string, string[]> = err.response.data.errors;
          const newClientErrors: Record<string, string> = {};
          for (const field in backendErrors) {
            if (backendErrors[field] && backendErrors[field].length > 0) {
              newClientErrors[field] = backendErrors[field][0];
            }
          }
          setErrors(prevErrors => ({...prevErrors, ...newClientErrors}));
        }
      }
      setError(errorMessage);
      console.error('Registration error:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) { // When closing
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
      // setError(null); // Clear server error from store only when opening a new modal instance (done in WelcomePage)
    } else { // When opening
      setError(null); // Clear any existing auth error from previous attempts
      setErrors({});
    }
  }, [isOpen, setError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your Account">
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.modalBenefitsText}>
          Create an account to save your personality tower and track your insights over time.
        </p>
        {serverError && <p className={styles.serverError}>{serverError}</p>}
        <Input
          label="Email" type="email" name="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email} disabled={isLoading}
        />
        <Input
          label="Password" type="password" name="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password} disabled={isLoading}
        />
        <Input
          label="Confirm Password" type="password" name="confirmPassword" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword} disabled={isLoading}
        />
        <PrimaryButton type="submit" disabled={isLoading} fullWidth={true} size="large">
          {isLoading ? 'Registering...' : 'Create Account'}
        </PrimaryButton>
        <div className={styles.switchFormLink}>
          Already have an account?{' '}
          <LinkButton type="button" onClick={onSwitchToLogin} disabled={isLoading} size="medium">
            Login
          </LinkButton>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;
```

This markdown contains the requested client authentication component files.
```
