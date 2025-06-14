import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import PrimaryButton from '../common/buttons/PrimaryButton';
import styles from './AuthModal.module.css'; // Reusing styles from AuthModal for consistency

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email) {
      setError('Email address is required.');
      return;
    }
    setIsLoading(true);
    console.log('Attempting to send password reset link for email:', email);
    // TODO: API call to send reset link: POST /auth/forgot-password { email }
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Example response handling:
    // Replace with actual API call and error/success handling
    const isSuccess = Math.random() > 0.3; // Simulate success/failure
    if (isSuccess) {
      setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
      setEmail(''); // Clear input on success
    } else {
      setError('Failed to send reset link. Please try again or contact support if the issue persists.');
    }
    setIsLoading(false);
  };

  const handleModalClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    setIsLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Reset Your Password">
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.instructionText}>
          Please enter the email address associated with your Inner DNA account.
          If an account exists, we'll send you a link to reset your password.
        </p>
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error && !email ? error : undefined} // Show general error if email is blank, else field specific
          disabled={isLoading}
        />
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && email && <p className={styles.serverError}>{error}</p>} {/* Show general error if email is filled */}

        <PrimaryButton type="submit" disabled={isLoading} fullWidth={true} size="medium">
          {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
        </PrimaryButton>
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;
