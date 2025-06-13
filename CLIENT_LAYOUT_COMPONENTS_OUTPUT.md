## Client-Side Layout Components

This document contains the content of layout components found in `packages/client/src/components/layout/`.

---
**File Path:** `packages/client/src/components/layout/Layout.tsx`
---
```tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutWrapper}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
```

---
**File Path:** `packages/client/src/components/layout/Layout.module.css`
---
```css
/* Layout.module.css */
.layoutWrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the wrapper takes at least the full viewport height */
  background-color: var(--ui-background-main);
}

.mainContent {
  flex-grow: 1; /* Allows this area to expand and push the footer down */
  width: 100%;
  /* Padding for the main content is typically applied within individual page components
     or a page layout wrapper to allow for full-width sections if needed.
     Example if global padding was desired here:
     padding: var(--space-lg) var(--space-md);
  */
}
```

---
**File Path:** `packages/client/src/components/layout/Header.tsx`
---
```tsx
// Header.tsx - Updated with Link components and useNavigate
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import useAuthStore from '../../contexts/store/useAuthStore';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import LinkButton from '../common/buttons/LinkButton';

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutUser = useAuthStore((state) => state.logout);
  const isAssessmentComplete = useAssessmentStore((state) => state.isAssessmentComplete);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // This also calls useAssessmentStore.getState().resetAssessment() internally
    navigate('/');
  };

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logoTitle}>Personality Mosaic</Link>

        <nav className={styles.navigation}>
          {isAuthenticated ? (
            <>
              {isAssessmentComplete ? (
                <Link to="/assessment/results" className={styles.navLink}>View Results</Link>
              ) : (
                <Link to="/assessment/foundation" className={styles.navLink}>Start/Continue Assessment</Link>
              )}
              <Link to="/profile" className={styles.navLink}>My Profile</Link>
              <LinkButton onClick={handleLogout} className={styles.navLink}>
                Logout
              </LinkButton>
            </>
          ) : (
            <>
              {/* Simplified: direct user to WelcomePage where they can choose to login/register via modals. */}
              <Link to="/" className={styles.navLink}>Login / Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

---
**File Path:** `packages/client/src/components/layout/Header.module.css`
---
```css
/* Header.module.css - Typography uses GDS vars */
.appHeader {
  background-color: var(--ui-background-main);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--ui-border-container-empty);
  box-shadow: var(--shadow-dropdown);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.headerContainer {
  width: 100%;
  max-width: var(--max-width-welcome);
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logoTitle { /* This is like an H3 */
  font-size: var(--font-size-heading-h3-mobile);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-bold);
  color: var(--ui-accent-primary);
  text-decoration: none;
}
.logoTitle:hover { color: var(--ui-accent-secondary); }

.navigation { display: flex; align-items: center; gap: var(--space-sm); } /* Align items for LinkButton */

.navLink { /* Styling for actual <Link> and <LinkButton> used as nav items */
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  font-weight: var(--font-weight-medium);
  color: var(--ui-text-secondary);
  text-decoration: none;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: color var(--animation-duration-micro) ease-in-out, background-color var(--animation-duration-short) ease-in-out;
}
.navLink:hover {
  color: var(--ui-accent-primary);
  background-color: var(--ui-background-welcome-gradient-end); /* Subtle hover background */
}
/* Specific styling for LinkButton when used as a navLink, if different from its own module */
.navigation > .navLink.linkButton { /* Target LinkButton specifically if needed */
  padding: var(--space-xs) var(--space-sm); /* Ensure padding matches other links */
  text-decoration: none; /* Override LinkButton's default underline if not desired in header */
}
.navigation > .navLink.linkButton:hover {
  text-decoration: underline; /* Add underline on hover for consistency with other links */
  background-color: var(--ui-background-welcome-gradient-end);
}


@media (min-width: 768px) {
  .headerContainer { padding: 0 var(--space-lg); }
  .logoTitle {
    font-size: var(--font-size-heading-h3-desktop);
  }
  .navLink {
    font-size: var(--font-size-body-main-desktop);
  }
  .navigation { gap: var(--space-md); }
}
```

---
**File Path:** `packages/client/src/components/layout/Footer.tsx`
---
```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContainer}>
        <p className={styles.copyrightText}>
          &copy; {currentYear} Personality Mosaic. All rights reserved.
        </p>
        <div className={styles.footerLinks}>
          <Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---
**File Path:** `packages/client/src/components/layout/Footer.module.css`
---
```css
/* Footer.module.css - Typography uses GDS vars */
.appFooter {
  background-color: var(--ui-text-primary);
  color: var(--ui-background-main);
  padding: var(--space-lg) 0;
  width: 100%;
  margin-top: auto; /* Pushes footer to bottom if Layout uses flex column */
}
.footerContainer {
  width: 100%;
  max-width: var(--max-width-welcome);
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
}
.copyrightText {
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-regular);
}
.footerLinks { display: flex; gap: var(--space-sm); flex-wrap: wrap; justify-content: center; }
.footerLink {
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-medium);
  color: var(--ui-background-main);
  text-decoration: none;
  transition: color var(--animation-duration-micro) ease-in-out;
}
.footerLink:hover { color: var(--ui-accent-secondary); text-decoration: underline; }

@media (min-width: 768px) {
  .footerContainer { padding: 0 var(--space-lg); flex-direction: row; justify-content: space-between; text-align: left; }
  .copyrightText {
    font-size: var(--font-size-body-small-desktop);
    line-height: var(--line-height-body-small);
  }
  .footerLink {
    font-size: var(--font-size-body-small-desktop);
    line-height: var(--line-height-body-small);
  }
  .footerLinks { gap: var(--space-md); }
}
```

This markdown contains the requested client layout component files.
```
