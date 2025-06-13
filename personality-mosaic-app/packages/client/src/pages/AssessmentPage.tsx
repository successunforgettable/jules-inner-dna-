import React from 'react';

const AssessmentPage: React.FC = () => {
  return (
    <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
      <h1>Assessment Page</h1>
      <p>This is protected content, visible only to authenticated users.</p>
      <p>The personality assessment process will begin here.</p>
      {/* Placeholder for assessment phase components */}
    </div>
  );
};

export default AssessmentPage;
