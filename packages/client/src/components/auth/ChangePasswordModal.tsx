import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import PrimaryButton from '../common/buttons/PrimaryButton';
import LinkButton from '../common/buttons/LinkButton'; // Or SecondaryButton
import styles from './AuthModal.module.css'; // Reusing styles

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState(''); // For errors from the (future) API call
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset form when modal is closed/opened
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrors({});
      setSuccessMessage('');
      setApiError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required.';
    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long.';
    }
    // TODO: Add more complex password strength validation (uppercase, number, special char) as per Spec 18

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'New passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setApiError('');
    if (!validate()) return;

    setIsLoading(true);
    console.log('Attempting to change password. Current:', currentPassword, 'New:', newPassword);
    // TODO: API call to change password: POST /auth/change-password { currentPassword, newPassword }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isSuccess = Math.random() > 0.3; // Simulate success/failure

    if (isSuccess) {
      setSuccessMessage('Your password has been successfully updated.');
      // Clear fields after successful update or on modal close
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Consider auto-closing modal after a delay or keep it open with success message
      // setTimeout(onClose, 2000);
    } else {
      setApiError('Failed to update password. The current password may be incorrect or an error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Your Password">
      <form onSubmit={handleSubmit} className={styles.form}>
        {apiError && <p className={styles.serverError}>{apiError}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
          disabled={isLoading}
          autoComplete="current-password"
        />
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
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={errors.confirmNewPassword}
          disabled={isLoading}
          autoComplete="new-password"
        />

        <div className={styles.buttonGroupModal}> {/* Using a potentially new class for modal button layout */}
          <LinkButton type="button" onClick={onClose} disabled={isLoading} className={styles.cancelButton}>
            Cancel
          </LinkButton>
          <PrimaryButton type="submit" disabled={isLoading} size="medium">
            {isLoading ? 'Updating...' : 'Update Password'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
