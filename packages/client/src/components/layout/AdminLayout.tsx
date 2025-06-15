import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import styles from './AdminLayout.module.css';
import clsx from 'clsx'; // For conditional class names (active link)

const AdminLayout: React.FC = () => {
  const location = useLocation(); // For active link styling

  // Helper to determine if a link is active
  const isActive = (path: string) => location.pathname === path || (path !== "/admin/dashboard" && location.pathname.startsWith(path));


  return (
    <div className={styles.adminLayoutContainer}>
      <nav className={styles.adminNav}>
        <h3 className={styles.adminNavTitle}>Admin Menu</h3>
        <ul>
          <li>
            <Link
              to="/admin/dashboard"
              className={clsx(styles.adminNavLink, isActive('/admin/dashboard') && styles.activeAdminNavLink)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={clsx(styles.adminNavLink, isActive('/admin/users') && styles.activeAdminNavLink)}
            >
              User Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/content-management"
              className={clsx(styles.adminNavLink, isActive('/admin/content-management') && styles.activeAdminNavLink)}
            >
              Content Management
            </Link>
          </li>
          {/* Add other admin links here, e.g.:
          <li>
            <Link
              to="/admin/settings"
              className={clsx(styles.adminNavLink, isActive('/admin/settings') && styles.activeAdminNavLink)}
            >
              Settings
            </Link>
          </li>
          */}
        </ul>
      </nav>
      <main className={styles.adminMainContent}>
        <Outlet /> {/* Nested admin routes will render here */}
      </main>
    </div>
  );
};
export default AdminLayout;
