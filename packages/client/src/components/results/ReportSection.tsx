import React from 'react';
import styles from './ReportSection.module.css';

export interface ReportSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string; // For additional styling from parent
}

const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  icon,
  children,
  className,
}) => {
  return (
    <section className={`${styles.reportSection} ${className || ''}`}>
      <div className={styles.header}>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
};

export default ReportSection;
