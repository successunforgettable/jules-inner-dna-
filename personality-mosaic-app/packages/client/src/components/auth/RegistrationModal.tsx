import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import api from '../../services/api';
import styles from './AuthModal.module.css';
import { PrimaryButton, SecondaryLinkButton } from './AuthButtons';
import useAuthStore from '../../contexts/store/useAuthStore'; // Import auth store

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void; // Callback from WelcomePage
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegistrationSuccess // Callback from WelcomePage
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use Zustand store for loading and error states
  const isLoading = useAuthStore((state) => state.isLoading);
  const serverError = useAuthStore((state) => state.error); // Displaying auth-specific error from store
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
    setError(null); // Clear previous errors from store
    if (!validate()) return;

    setLoading(true);
    try {
      // Assuming backend returns: { message: string, user: { id: string, email: string, createdAt: Date } }
      await api.post('/auth/register', { email, password });
      setLoading(false);

      // Call the success handler passed from WelcomePage (which then calls store.registerSuccess)
      onRegistrationSuccess();

    } catch (err: any) {
      setLoading(false);
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
         if (err.response.data.errors) { // Field-specific errors from backend Zod validation
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
      setError(errorMessage); // Set error in Zustand store
      console.error('Registration error:', err);
    }
  };

  // Clear errors when modal is closed or inputs change
  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setErrors({});
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={isLoading}
        />
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Create Account'}
        </PrimaryButton>
        <div className={styles.switchFormLink}>
          Already have an account?{' '}
          <SecondaryLinkButton type="button" onClick={onSwitchToLogin} disabled={isLoading}>
            Login
          </SecondaryLinkButton>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;
