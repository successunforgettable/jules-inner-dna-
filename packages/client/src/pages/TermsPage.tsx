import React from 'react';

const TermsPage: React.FC = () => {
  const pageStyle: React.CSSProperties = { padding: 'var(--space-lg)', maxWidth: 'var(--max-width-stone-container)', margin: 'var(--space-xl) auto' };
  const headingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h1-desktop)', color: 'var(--ui-text-primary)', marginBottom: 'var(--space-md)' };
  const subHeadingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h2-desktop)', color: 'var(--ui-text-primary)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' };
  const paragraphStyle: React.CSSProperties = { fontSize: 'var(--font-size-body-main-desktop)', lineHeight: 'var(--line-height-body-main)', marginBottom: 'var(--space-sm)' };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Terms of Service</h1>
      <p style={{...paragraphStyle, fontStyle: 'italic'}}><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      <br />
      <p style={paragraphStyle}>This is a placeholder for the Terms of Service page. Users will need to agree to these terms to use the Inner DNA service.</p> {/* UPDATED */}

      <h2 style={subHeadingStyle}>1. Acceptance of Terms</h2>
      <p style={paragraphStyle}>By accessing or using our Inner DNA service, you agree to be bound by these terms and our Privacy Policy.</p> {/* UPDATED */}

      <h2 style={subHeadingStyle}>2. Use of Service</h2>
      <p style={paragraphStyle}>Details on permitted and prohibited uses of the service. You agree not to misuse the service or help anyone else to do so.</p>

      <h2 style={subHeadingStyle}>3. User Accounts</h2>
      <p style={paragraphStyle}>Responsibilities regarding account creation (if applicable), security, and termination.</p>

      <h2 style={subHeadingStyle}>4. Intellectual Property</h2>
      <p style={paragraphStyle}>The service and its original content, features, and functionality are and will remain the exclusive property of Inner DNA and its licensors.</p> {/* UPDATED */}

      <h2 style={subHeadingStyle}>5. Disclaimers and Limitation of Liability</h2>
      <p style={paragraphStyle}>The service is provided on an "AS IS" and "AS AVAILABLE" basis. Our liability is limited to the maximum extent permitted by law.</p>

      <h2 style={subHeadingStyle}>6. Governing Law</h2>
      <p style={paragraphStyle}>These Terms shall be governed by the laws of the jurisdiction in which the service provider is based, without regard to its conflict of law provisions.</p>

      <h2 style={subHeadingStyle}>7. Changes to Terms</h2>
      <p style={paragraphStyle}>We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>

      <h2 style={subHeadingStyle}>8. Contact Us</h2>
      <p style={paragraphStyle}>If you have any questions about these Terms, please contact us.</p>
    </div>
  );
};

export default TermsPage;
