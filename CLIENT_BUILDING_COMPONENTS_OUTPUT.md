## Client-Side Building Block Experience Components

This document contains the content of components related to the Building Block selection experience, found in `packages/client/src/components/building/`.

---
**File Path:** `packages/client/src/components/building/BuildingBlock.tsx`
---
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './BuildingBlock.module.css';
import clsx from 'clsx';

export interface BuildingBlockProps {
  id: string;
  content: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  textureVariation?: string;
  gradientStyle?: string;
  isDisabled?: boolean;
  ariaLabel?: string;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const BuildingBlock: React.FC<BuildingBlockProps> = ({
  id,
  content,
  isSelected,
  onSelect,
  textureVariation,
  gradientStyle,
  isDisabled = false,
  ariaLabel,
  sizeContext = 'desktop',
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(id);
    }
  };

  return (
    <motion.div
      className={clsx(
        styles.buildingBlock,
        styles[sizeContext],
        textureVariation && styles[textureVariation],
        isSelected && styles.selected,
        isDisabled && styles.disabled
      )}
      style={{ background: gradientStyle }}
      onClick={handleClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && !isDisabled && handleClick()}
      role="button"
      aria-pressed={isSelected}
      aria-label={ariaLabel || content}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      whileHover={!isDisabled ? {
        scale: 1.03,
        boxShadow: "var(--shadow-interactive-hover)"
      } : {}}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      <span className={styles.contentText}>{content}</span>
    </motion.div>
  );
};

export default BuildingBlock;
```

---
**File Path:** `packages/client/src/components/building/BuildingBlock.module.css`
---
```css
/* BuildingBlock.module.css - Typography uses GDS vars, texture comment added */
.buildingBlock {
  display: flex; align-items: center; justify-content: center; text-align: center;
  padding: var(--space-md);
  border: 2px solid var(--ui-border-interactive);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-block);
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.2s ease-out, box-shadow 0.2s ease-out;
  color: var(--ui-text-on-dark);
  background: linear-gradient(135deg, var(--ui-accent-secondary), var(--ui-accent-primary));
  font-size: var(--font-size-interactive-text-mobile);
  line-height: var(--line-height-interactive-text);
}

.desktop { width: 200px; height: 120px; }
.tablet {
  width: 180px; height: 110px;
  font-size: var(--font-size-interactive-text-mobile);
}
.mobile { width: 100%; max-width: 280px; height: 100px; }

@media (min-width: 768px) {
  .buildingBlock {
    font-size: var(--font-size-interactive-text-desktop);
  }
}

.contentText {
  font-weight: var(--font-weight-medium);
  z-index: 1;
}

/* Placeholder Texture Variations:
   These classes provide examples of how different textures could be applied
   on top of or blended with the base gradientStyle (which is applied via inline style).
   If specific, detailed textures become a design requirement, they should be
   formally defined within the Global Design System (GDS) with precise visual
   characteristics (e.g., SVG patterns, specific image assets, detailed CSS effects).
   The current implementations are for demonstration and basic differentiation.
   These background-images will layer ON TOP of the inline 'background' gradient if not transparent.
   Consider using multiple backgrounds or pseudo-elements for better layering if gradients + textures are complex.
*/
.texture-smooth { /* No additional texture, relies on gradient only */ }
.texture-lines {
  background-image: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.07),
    rgba(255, 255, 255, 0.07) 3px,
    transparent 3px,
    transparent 9px
  );
}
.texture-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1.2px);
  background-size: 10px 10px;
}
.texture-swirl {
  border-top-color: rgba(255,255,255,0.3);
  border-left-color: rgba(255,255,255,0.3);
}
.texture-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 15px 15px;
}
.texture-bubbles {
  background-image: radial-gradient(rgba(255,255,255,0.06) 2px, transparent 3px);
  background-size: 25px 25px;
}
.texture-diagonal {
  background-image: repeating-linear-gradient(
    -60deg,
    rgba(255,255,255,0.05),
    rgba(255,255,255,0.05) 4px,
    transparent 4px,
    transparent 12px
  );
}
.texture-sharp {
  position: relative;
}
.texture-sharp::before {
  content: '';
  position: absolute;
  top: 5px; right: 5px;
  width: 10px; height: 10px;
  background-color: rgba(255,255,255,0.15);
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
.texture-organic {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-block), 0 0 10px rgba(0,0,0,0.05) inset;
}

.selected {
  border-color: var(--ui-accent-primary);
  box-shadow: 0 0 12px 3px var(--ui-accent-primary), var(--shadow-block);
  transform: scale(1.02);
}
.selected:hover { transform: scale(1.05); }
.disabled { opacity: 0.5; cursor: not-allowed; background: var(--ui-border-container-empty); color: var(--ui-text-secondary); border-color: var(--ui-text-secondary); box-shadow: none; }
```

---
**File Path:** `packages/client/src/components/building/BlockPair.tsx`
---
```tsx
import React from 'react';
import BuildingBlock, { BuildingBlockProps as IndividualBlockProps } from './BuildingBlock';
import styles from './BlockPair.module.css';
import clsx from 'clsx';

export interface BlockPairComponentProps {
  pairData: {
    pairId: string;
    questionText: string;
    // Expects Omit<IndividualBlockProps, 'isSelected' | 'onSelect'> for the blocks in pairData
    blocks: [Omit<IndividualBlockProps, 'isSelected' | 'onSelect' | 'onSelect'>, Omit<IndividualBlockProps, 'isSelected' | 'onSelect'>];
  };
  selectedBlockIdInPair: string | null;
  onBlockSelect: (pairId: string, blockData: Omit<IndividualBlockProps, 'isSelected' | 'onSelect'>, blockIndexInPair: number) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
  isDisabled?: boolean;
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
      <div className={clsx(styles.blocksDisplay, styles[sizeContext], blocks.length === 2 && styles.twoBlocks /* Retained for clarity, though always 2 */ )}>
        {blocks.map((blockData, index) => (
          <BuildingBlock
            key={blockData.id}
            {...blockData}
            isSelected={selectedBlockIdInPair === blockData.id}
            onSelect={() => onBlockSelect(pairId, blockData, index)}
            sizeContext={sizeContext}
            ariaLabel={blockData.ariaLabel || blockData.content}
            isDisabled={isDisabled || (selectedBlockIdInPair !== null && selectedBlockIdInPair !== blockData.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BlockPair;
```

---
**File Path:** `packages/client/src/components/building/BlockPair.module.css`
---
```css
/* BlockPair.module.css - Typography uses GDS vars */
.blockPairContainer {
  display: flex; flex-direction: column; align-items: center;
  padding: var(--space-md); width: 100%;
  max-width: var(--max-width-block-container);
  margin: var(--space-lg) auto;
}
.questionText { /* Body Large (semibold) */
  font-size: var(--font-size-body-large-mobile);
  line-height: var(--line-height-body-large);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  text-align: center; margin-bottom: var(--space-lg);
}
.blocksDisplay {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: var(--space-lg); width: 100%;
}
/* .twoBlocks class is always applied since BlockPair expects 2 blocks.
   It can be merged with .blocksDisplay if no other counts are ever supported.
*/
.twoBlocks {}


@media (min-width: 768px) {
  .questionText {
    font-size: var(--font-size-body-large-desktop);
  }
  .blocksDisplay { flex-direction: row; justify-content: center; gap: var(--space-xxl); }
  /* .tablet .blocksDisplay might have smaller gap: var(--space-xl) */
}
.error {
  color: var(--system-error-primary); padding: var(--space-lg);
  text-align: center; background-color: var(--system-error-background);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  font-weight: var(--font-weight-regular);
}
@media (min-width: 768px) {
  .error { font-size: var(--font-size-body-main-desktop); }
}
```

This markdown contains the requested Building Block component files.
```
