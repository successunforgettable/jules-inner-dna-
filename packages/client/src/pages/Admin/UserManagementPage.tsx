import React from 'react';
import styles from './UserManagementPage.module.css';

const UserManagementPage: React.FC = () => {
  return (
    <div className={styles.adminSection}>
      <h2 className={styles.sectionTitle}>User Management</h2>
      <input type="text" placeholder="Search users by email or name..." className={styles.searchInput} />

      <div className={styles.userTablePlaceholder}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Display Name</th>
              <th>Reg. Date</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>user_id_123</td>
              <td>user1@example.com</td>
              <td>Sample User One</td>
              <td>2023-01-15</td>
              <td>User</td>
              <td>Active</td>
              <td>
                <button className={styles.actionButton}>View</button>
                <button className={styles.actionButton}>Edit Role</button>
                <button className={styles.actionButtonWarning}>Suspend</button>
              </td>
            </tr>
            <tr>
              <td>user_id_456</td>
              <td>user2@example.com</td>
              <td>Another User</td>
              <td>2023-02-20</td>
              <td>Admin</td>
              <td>Suspended</td>
              <td>
                <button className={styles.actionButton}>View</button>
                <button className={styles.actionButton}>Edit Role</button>
                <button className={styles.actionButtonDestructive}>Delete</button>
              </td>
            </tr>
            {/* Add more sample rows or map actual data later */}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationPlaceholder}>[Pagination Controls Here]</div>
      {/* Placeholder for Add New User button or other actions */}
      {/* Example:
      <PrimaryButton onClick={() => console.log("Add new user clicked")}>
        Add New User
      </PrimaryButton>
      */}
    </div>
  );
};
export default UserManagementPage;
