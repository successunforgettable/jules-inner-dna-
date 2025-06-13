import React from 'react';
import Stone, { StoneProps as IndividualStoneProps } from './Stone';
import styles from './StoneSet.module.css';
import clsx from 'clsx';

export interface StoneSetComponentProps {
  stoneSetData: {
    stones: Omit<IndividualStoneProps, 'isSelected' | 'onSelect'>[];
    instruction: string;
    setId: string;
  };
  selectedStoneIdInSet: string | null;
  // Update onStoneSelect to pass the index of the stone within the set (0, 1, or 2)
  onStoneSelect: (setId: string, stoneData: Omit<IndividualStoneProps, 'isSelected' | 'onSelect'>, stoneIndexInSet: number) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
  isDisabled?: boolean;
}

const StoneSet: React.FC<StoneSetComponentProps> = ({
  stoneSetData,
  selectedStoneIdInSet,
  onStoneSelect,
  sizeContext = 'desktop',
  isDisabled = false,
}) => {
  const { setId, stones, instruction } = stoneSetData;

  if (!stones || stones.length === 0) {
    console.error("StoneSet expects at least 1 stone in stoneSetData.stones array.", stones);
    return <div className={styles.error}>Error loading stone set. Please try again.</div>;
  }

  return (
    <div className={clsx(styles.stoneSetContainer, styles[sizeContext])}>
      <div className={styles.instructionPanel}>
        <p className={styles.instructionText}>{instruction}</p>
      </div>
      <div className={clsx(styles.stonesDisplay, styles[sizeContext], stones.length === 2 && styles.twoStones)}>
        {stones.map((stoneData, index) => ( // Added index here
          <Stone
            key={stoneData.id}
            {...stoneData}
            isSelected={selectedStoneIdInSet === stoneData.id}
            // Pass the stone's index within its set (0, 1, or 2)
            onSelect={() => onStoneSelect(setId, stoneData, index)}
            sizeContext={sizeContext}
            ariaLabel={stoneData.ariaLabel || stoneData.content.join(' & ')}
            // A stone is disabled if the set is generally disabled, OR if another stone in this set is already selected.
            isDisabled={isDisabled || (selectedStoneIdInSet !== null && selectedStoneIdInSet !== stoneData.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoneSet;
