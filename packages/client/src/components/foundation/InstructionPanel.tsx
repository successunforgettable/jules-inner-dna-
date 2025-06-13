import React from 'react';
import styles from './InstructionPanel.module.css';

interface InstructionPanelProps {
  text: string;
  currentSetNumber?: number;
  totalSets?: number;
}

const InstructionPanel: React.FC<InstructionPanelProps> = ({ text, currentSetNumber, totalSets }) => {
  return (
    <div className={styles.instructionPanel}>
      {currentSetNumber && totalSets && (
        <p className={styles.setCounter}>
          Set {currentSetNumber} of {totalSets}
        </p>
      )}
      <p className={styles.instructionText}>{text}</p>
    </div>
  );
};

export default InstructionPanel;
