import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  const pageStyle: React.CSSProperties = { padding: 'var(--space-lg)', maxWidth: 'var(--max-width-stone-container)', margin: 'var(--space-xl) auto' };
  const headingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h1-desktop)', color: 'var(--ui-text-primary)', marginBottom: 'var(--space-md)' };
  const subHeadingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h2-desktop)', color: 'var(--ui-text-primary)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' };
  const paragraphStyle: React.CSSProperties = { fontSize: 'var(--font-size-body-main-desktop)', lineHeight: 'var(--line-height-body-main)', marginBottom: 'var(--space-sm)' };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Privacy Policy</h1>
      <p style={{...paragraphStyle, fontStyle: 'italic'}}><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      <br />
      <p style={paragraphStyle}>This is a placeholder for the Privacy Policy page. Information about how user data is collected, used, and protected will be detailed here.</p>

      <h2 style={subHeadingStyle}>1. Information We Collect</h2>
      <p style={paragraphStyle}>Details about data collected (e.g., email, assessment responses during your interaction with Inner DNA).</p> {/* UPDATED */}

      <h2 style={subHeadingStyle}>2. How We Use Your Information</h2>
      <p style={paragraphStyle}>Explanation of data usage (e.g., to provide personalized assessment results, save your progress, and improve our service).</p>

      <h2 style={subHeadingStyle}>3. Data Security</h2>
      <p style={paragraphStyle}>Information on security measures taken to protect user data (e.g., password hashing, secure connections).</p>

      <h2 style={subHeadingStyle}>4. Data Retention</h2>
      <p style={paragraphStyle}>Policy on how long user data is stored and criteria for deletion.</p>

      <h2 style={subHeadingStyle}>5. Your Rights</h2>
      <p style={paragraphStyle}>Information about user rights regarding their data (e.g., access, correction, deletion of your account and associated data).</p>

      <h2 style={subHeadingStyle}>6. Contact Us</h2>
      <p style={paragraphStyle}>How to contact for privacy-related inquiries.</p>
    </div>
  );
};

export default PrivacyPolicyPage;
