import React, { useState } from 'react'; // Imported useState
import { Link } from 'react-router-dom'; // Import Link
import useAuthStore, { UserProfile } from '../../contexts/store/useAuthStore';
import styles from './ProfilePage.module.css';
import PrimaryButton from '../components/common/buttons/PrimaryButton';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import ChangePasswordModal from '../components/auth/ChangePasswordModal'; // Import modal

const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Placeholder for edit mode and form fields if implementing edit functionality
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [name, setName] = useState(user?.name || ''); // Example

  if (!user) {
    // Attempt to get user again in case store initializes after initial render
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      return (
        <div className={styles.profilePage}>
          <h1 className={styles.pageTitle}>User Profile</h1>
          <p className={styles.infoValue}>Loading user data or you are not logged in. Please try logging in if this issue persists.</p>
          {/* Optionally, redirect or show login prompt if not logged in after a delay */}
        </div>
      );
    }
    // If user becomes available, component will re-render due to store subscription
  }

  // Ensure user is definitely available for the main render logic, or show loading/error again
  // This double check handles cases where the store might not be immediately populated
  const finalUser = user || useAuthStore.getState().user;

  if (!finalUser) {
      return (
        <div className={styles.profilePage}>
          <h1 className={styles.pageTitle}>User Profile</h1>
          <p className={styles.infoValue}>User information is not available. Please ensure you are logged in.</p>
        </div>
      );
  }


  const registrationDate = finalUser.createdAt
    ? new Date(finalUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not available';

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.pageTitle}>My Profile</h1>

      <div className={styles.profileContentLayout}>
        {/* Main Info Column */}
        <div className={styles.mainInfoColumn}>
          {/* Personal Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.avatarPlaceholder}>[Avatar]</div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{finalUser.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.infoValue}>{finalUser.name || 'Not Set'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Joined:</span>
              <span className={styles.infoValue}>{registrationDate}</span>
            </div>
            <div className={styles.buttonGroup}>
              <PrimaryButton onClick={() => console.log('Edit Profile clicked')} size="medium" disabled={isLoading}>
                Edit Profile
              </PrimaryButton>
            </div>
          </section>

          {/* Security Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Security</h2>
            <div className={styles.buttonGroup}>
              <SecondaryButton onClick={() => setIsChangePasswordModalOpen(true)} size="medium" disabled={isLoading}>
                Change Password
              </SecondaryButton>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sidebarColumn}>
          {/* Assessment History Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Assessment History</h2>
            {finalUser.subscriptionPlan === 'free' || !finalUser.subscriptionPlan ? (
              <p className={styles.infoValue}> {/* Use infoValue for consistent styling or a dedicated placeholderText style */}
                Upgrade to Premium to save and view your full assessment history.
                <Link to="/subscribe" className={styles.actionLink}>Upgrade Now</Link>
              </p>
            ) : (
              <p className={styles.infoValue}>[List of completed assessments will appear here. Each item could link to its detailed report.]</p>
            )}
            {/* TODO: Implement list of assessments */}
          </section>

          {/* Subscription Status Section (Placeholder) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Subscription</h2>
            <p className={styles.infoValue}>
              Current Plan: <span className={styles.currentPlanText}>{finalUser.subscriptionPlan ? (finalUser.subscriptionPlan.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())) : 'Free Tier'}</span>
              <Link to="/subscribe" className={styles.actionLink}>
                {finalUser.subscriptionPlan === 'free' || !finalUser.subscriptionPlan ? 'Upgrade to Premium' : 'Manage Subscription'}
              </Link>
            </p>
            {/* TODO: Implement subscription display based on Spec 23 */}
          </section>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
