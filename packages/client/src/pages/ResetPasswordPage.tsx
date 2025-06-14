import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './ResetPasswordPage.module.css';
import Input from '../components/common/forms/Input';
import PrimaryButton from '../components/common/buttons/PrimaryButton';
// import api from '../services/api'; // Uncomment when API call is implemented

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      // TODO: Optionally, could make an API call here to validate the token immediately
      // For now, we'll assume it's validated on form submission.
    } else {
      setErrorMessage("No reset token provided or token is invalid. Please request a new password reset link.");
      // Consider redirecting after a delay if no token
      // setTimeout(() => navigate('/'), 5000);
    }
  }, [searchParams, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!newPassword) newErrors.newPassword = 'New password is required.';
    else if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters long.';
    // TODO: Add more password strength validation (uppercase, lowercase, number, special char)

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your new password.';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    if (!token) {
      setErrorMessage("Password reset token is missing. Please try the reset link again.");
      return;
    }
    if (!validate()) return;

    setIsLoading(true);
    console.log('Attempting to reset password with token:', token, 'and new password:', newPassword);
    // TODO: API call: POST /auth/reset-password { token, newPassword }
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Example response handling
    const isSuccess = Math.random() > 0.3; // Simulate success/failure
    if (isSuccess) {
      setMessage('Your password has been successfully reset! You can now log in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
      // Consider redirecting to login page after a delay
      // setTimeout(() => navigate('/login'), 3000); // Or prompt user to click a link
    } else {
      setErrorMessage('Failed to reset password. The link may have expired or an error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  if (!token && !errorMessage) {
    // Still checking token or about to show error from useEffect
    return <div className={styles.resetPasswordPage}><p>Validating reset link...</p></div>;
  }

  return (
    <div className={styles.resetPasswordPage}>
      <h1 className={styles.pageTitle}>Create Your New Password</h1>
      {errorMessage && <p className={`${styles.message} ${styles.errorMessage}`}>{errorMessage}</p>}
      {message && <p className={`${styles.message} ${styles.successMessage}`}>{message}</p>}

      {!message && token && ( // Only show form if no success message and token exists
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <div className={styles.passwordStrengthMeter}>
            <div className={styles.strengthBarSegment}></div>
            <div className={styles.strengthBarSegment}></div>
            <div className={styles.strengthBarSegment}></div>
            <div className={styles.strengthBarSegment}></div>
          </div>
          <p className={styles.strengthTextPlaceholder}>Strength: [Text]</p>
          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <PrimaryButton type="submit" disabled={isLoading || !token} fullWidth={true} size="medium">
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </PrimaryButton>
        </form>
      )}
      {message && !errorMessage && ( // If success message, offer to go to login
         <PrimaryButton onClick={()=> navigate('/')} size="medium" style={{marginTop: 'var(--space-4)'}}>
            Return to Login
        </PrimaryButton>
      )}
    </div>
  );
};

export default ResetPasswordPage;
