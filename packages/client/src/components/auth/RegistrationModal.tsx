import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import api from '../../services/api';
import styles from './AuthModal.module.css';
// Import common buttons
import PrimaryButton from '../common/buttons/PrimaryButton';
import LinkButton from '../common/buttons/LinkButton'; // Replaces SecondaryLinkButton
import useAuthStore from '../../contexts/store/useAuthStore';
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const RegistrationModalNew: React.FC<RegistrationModalProps> = ({
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
      sendGAEvent('User', 'RegistrationSuccess');
      // setLoading(false); // Handled by onRegistrationSuccess (via store) or setError
      onRegistrationSuccess();
    } catch (err: any) {
      // setLoading(false); // Handled by setError
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
    if (!isOpen) {
      setError(null); setErrors({}); setEmail(''); setPassword(''); setConfirmPassword('');
    }
  }, [isOpen, setError]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your Account">
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.modalBenefitsText}>
          Create an account to save your personality tower and track your insights over time.
        </p>
        <div className={styles.socialLoginContainer}>
            <button type="button" className={`${styles.socialLoginButton} ${styles.googleButton}`} onClick={() => console.log('Register with Google clicked')} disabled={isLoading}>
              Sign up with Google
            </button>
            <button type="button" className={`${styles.socialLoginButton} ${styles.appleButton}`} onClick={() => console.log('Register with Apple clicked')} disabled={isLoading}>
              Sign up with Apple
            </button>
        </div>
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
        <div className={styles.passwordStrengthMeter}>
          <div className={styles.strengthBarSegment}></div>
          <div className={styles.strengthBarSegment}></div>
          <div className={styles.strengthBarSegment}></div>
          <div className={styles.strengthBarSegment}></div>
        </div>
        <p className={styles.strengthTextPlaceholder}>Strength: [Text]</p>
        <Input
          label="Confirm Password" type="password" name="confirmPassword" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword} disabled={isLoading}
        />
        <PrimaryButton type="submit" disabled={isLoading} fullWidth={true}>
          {isLoading ? 'Registering...' : 'Create Account'}
        </PrimaryButton>
        <div className={styles.switchFormLink}>
          Already have an account?{' '}
          <LinkButton type="button" onClick={onSwitchToLogin} disabled={isLoading}>
            Login
          </LinkButton>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModalNew;
