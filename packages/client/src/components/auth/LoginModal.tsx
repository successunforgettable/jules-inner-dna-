import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import api from '../../services/api';
import styles from './AuthModal.module.css';
// Import common buttons
import PrimaryButton from '../common/buttons/PrimaryButton';
import LinkButton from '../common/buttons/LinkButton';
import useAuthStore, { UserProfile } from '../../contexts/store/useAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (data: { accessToken: string; user: UserProfile }) => void;
}

const LoginModalNew: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post<{ accessToken: string; user: UserProfile; refreshToken: string; message: string }>('/auth/login', { email, password });
      onLoginSuccess({accessToken: response.data.accessToken, user: response.data.user });
    } catch (err: any) {
      let errorMessage = 'Login failed. Please check your credentials or try again.';
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
      console.error('Login error:', err);
    } finally {
      // setLoading(false) is called by onLoginSuccess (via store's loginSuccess) or setError
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setError(null); setErrors({}); setEmail(''); setPassword('');
    }
  }, [isOpen, setError]);

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
          <LinkButton type="button" onClick={() => console.log('Forgot password clicked')} disabled={isLoading}>
            Forgot Password?
          </LinkButton>
        </div>
        <PrimaryButton type="submit" disabled={isLoading} fullWidth={true}>
          {isLoading ? 'Logging In...' : 'Login'}
        </PrimaryButton>
        <div className={styles.switchFormLink}>
          Don't have an account?{' '}
          <LinkButton type="button" onClick={onSwitchToRegister} disabled={isLoading}>
            Create Account
          </LinkButton>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModalNew;
