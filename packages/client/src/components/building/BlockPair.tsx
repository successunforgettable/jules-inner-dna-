import React from 'react';
import BuildingBlock, { BuildingBlockProps as IndividualBlockProps } from './BuildingBlock';
import styles from './BlockPair.module.css';
import clsx from 'clsx';

export interface BlockPairComponentProps {
  pairData: {
    pairId: string;
    questionText: string;
    blocks: [Omit<IndividualBlockProps, 'isSelected' | 'onSelect'>, Omit<IndividualBlockProps, 'isSelected' | 'onSelect'>]; // Expects exactly two blocks
  };
  selectedBlockIdInPair: string | null;
  onBlockSelect: (pairId: string, blockId: string) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
  isDisabled?: boolean; // If the whole pair should be disabled (e.g., after selection)
}

const BlockPair: React.FC<BlockPairComponentProps> = ({
  pairData,
  selectedBlockIdInPair,
  onBlockSelect,
  sizeContext = 'desktop',
  isDisabled = false,
}) => {
  const { pairId, questionText, blocks } = pairData;

  if (!blocks || blocks.length !== 2) {
    console.error("BlockPair expects exactly 2 blocks in pairData.blocks array.", blocks);
    return <div className={styles.error}>Error loading block pair. Please try again.</div>;
  }

  return (
    <div className={clsx(styles.blockPairContainer, styles[sizeContext])}>
      <h3 className={styles.questionText}>{questionText}</h3>
      <div className={styles.blocksDisplay}>
        {blocks.map((blockData) => (
          <BuildingBlock
            key={blockData.id}
            {...blockData}
            isSelected={selectedBlockIdInPair === blockData.id}
            onSelect={() => onBlockSelect(pairId, blockData.id)}
            sizeContext={sizeContext}
            // A block is disabled if the pair is disabled OR if another block in this pair is already selected
            isDisabled={isDisabled || (selectedBlockIdInPair !== null && selectedBlockIdInPair !== blockData.id)}
            ariaLabel={blockData.ariaLabel || blockData.content}
          />
        ))}
      </div>
    </div>
  );
};

export default BlockPair;
