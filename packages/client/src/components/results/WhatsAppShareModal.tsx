import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/forms/Input';
import PrimaryButton from '../common/buttons/PrimaryButton';
import LinkButton from '../common/buttons/LinkButton'; // Or SecondaryButton
import styles from './WhatsAppShareModal.module.css';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId: string | null; // Or the relevant identifier for the report
}

const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  assessmentId
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [saveNumber, setSaveNumber] = useState(false); // For the checkbox

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset form when modal is closed/opened
    if (!isOpen) {
      setWhatsappNumber('');
      setSaveNumber(false);
      setErrors({});
      setSuccessMessage('');
      setApiError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const validatePhoneNumber = (number: string): boolean => {
    // Basic validation: starts with '+', contains digits, reasonable length
    // Example: +11234567890 (12 chars), +441234567890 (13 chars)
    const phoneRegex = /^\+[1-9]\d{1,14}$/; // Simple E.164 like regex
    if (!number) {
      setErrors({ whatsappNumber: 'Phone number is required.' });
      return false;
    }
    if (!phoneRegex.test(number)) {
      setErrors({ whatsappNumber: 'Please enter a valid phone number with country code (e.g., +11234567890).' });
      return false;
    }
    if (number.length < 8 || number.length > 16) { // General length check
        setErrors({ whatsappNumber: 'Phone number length seems incorrect.'});
        return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setApiError('');
    setErrors({});

    if (!validatePhoneNumber(whatsappNumber)) return;
    if (!assessmentId) {
        setApiError("Cannot share report: Assessment ID is missing.");
        return;
    }

    setIsLoading(true);
    console.log('Attempting to share report for assessment ID:', assessmentId, 'to WhatsApp number:', whatsappNumber, 'Save number:', saveNumber);
    // TODO: API call: POST /api/share/whatsapp { assessmentId, whatsappNumber, saveNumber }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isSuccess = Math.random() > 0.3; // Simulate success/failure

    if (isSuccess) {
      setSuccessMessage(`Report successfully sent to ${whatsappNumber}.`);
      // Optionally clear number if not saved, or always clear for privacy
      // setWhatsappNumber('');
    } else {
      setApiError('Failed to send report via WhatsApp. Please check the number or try again.');
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Report via WhatsApp">
      <form onSubmit={handleSubmit} className={styles.form}>
        {apiError && <p className={`${styles.message} ${styles.errorMessage}`}>{apiError}</p>}
        {successMessage && <p className={`${styles.message} ${styles.successMessage}`}>{successMessage}</p>}

        {!successMessage && ( // Hide form fields after success message
          <>
            <p className={styles.instructionText}>
              Enter your WhatsApp phone number including country code (e.g., +11234567890).
            </p>
            <Input
              label="WhatsApp Phone Number"
              type="tel"
              name="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              error={errors.whatsappNumber}
              disabled={isLoading}
              placeholder="+11234567890"
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="saveNumber"
                name="saveNumber"
                checked={saveNumber}
                onChange={(e) => setSaveNumber(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="saveNumber">Save this number to my profile for future use.</label>
            </div>
            <div className={styles.buttonGroupModal}>
              <LinkButton type="button" onClick={onClose} disabled={isLoading} className={styles.cancelButton}>
                Cancel
              </LinkButton>
              <PrimaryButton type="submit" disabled={isLoading} size="medium">
                {isLoading ? 'Sending...' : 'Send Report'}
              </PrimaryButton>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default WhatsAppShareModal;
