import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import api from '../../services/api'; // Axios instance
import styles from './AuthModal.module.css';
import { PrimaryButton, SecondaryLinkButton } from './AuthButtons';
import useAuthStore, { UserProfile } from '../../contexts/store/useAuthStore'; // Import auth store

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
  onLoginSuccess // Callback from WelcomePage to update global state
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors from store
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post<{ accessToken: string; user: UserProfile; refreshToken: string; message: string }>('/auth/login', { email, password });
      setLoading(false);

      // Call the success handler passed from WelcomePage (which then calls store.loginSuccess)
      onLoginSuccess({accessToken: response.data.accessToken, user: response.data.user });
      // Note: refreshToken is also available in response.data.refreshToken.
      // Handling of this (e.g. if it were to be stored by client, though HttpOnly is server's job) is not done here.

    } catch (err: any) {
      setLoading(false);
      let errorMessage = 'Login failed. Please check your credentials or try again.';
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
      console.error('Login error:', err);
    }
  };

  // Clear errors when modal is closed or inputs change
  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setErrors({});
      setEmail('');
      setPassword('');
    }
  }, [isOpen, setError]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login to Your Account">
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <div className={styles.forgotPasswordLinkContainer}>
          <SecondaryLinkButton type="button" onClick={() => console.log('Forgot password clicked')} disabled={isLoading}>
            Forgot Password?
          </SecondaryLinkButton>
        </div>
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </PrimaryButton>
        <div className={styles.switchFormLink}>
          Don't have an account?{' '}
          <SecondaryLinkButton type="button" onClick={onSwitchToRegister} disabled={isLoading}>
            Create Account
          </SecondaryLinkButton>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
