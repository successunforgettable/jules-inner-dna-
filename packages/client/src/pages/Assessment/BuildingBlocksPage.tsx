import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BuildingPage.module.css';
import BlockPair, { BlockPairComponentProps } from '../../components/building/BlockPair';
import { BuildingBlockDataItem } from '../../components/building/BuildingBlock';
// Removed import of static `getBlockPairsForType`. Import type `BlockPairData`.
import { BlockPairData } from '../../lib/buildingBlockData';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
// Import the content fetching service
import { fetchBuildingBlockPairs } from '../../services/contentService';

const BuildingBlocksPage: React.FC = () => {
  const navigate = useNavigate();

  const [allBlockPairData, setAllBlockPairData] = useState<BlockPairData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coreTypeCalculation = useAssessmentStore((state) => state.typeCalculation);
  const primaryType = coreTypeCalculation?.primaryType || null;

  const blockSelectionsUserInput = useAssessmentStore((state) => state.blockSelectionsUserInput);
  const currentBlockPairIndex = useAssessmentStore((state) => state.currentBlockPairIndex);
  const wingCalculation = useAssessmentStore((state) => state.wingCalculation);
  const arrowCalculation = useAssessmentStore((state) => state.arrowCalculation);

  const setBlockSelectionInStore = useAssessmentStore((state) => state.setBlockSelection);
  const goToNextBlockPairInStore = useAssessmentStore((state) => state.goToNextBlockPair);
  const goToPreviousBlockPairInStore = useAssessmentStore((state) => state.goToPreviousBlockPair);

  useEffect(() => {
    if (primaryType) {
      const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchBuildingBlockPairs(primaryType);
          if (data && data.length > 0) {
            setAllBlockPairData(data);
          } else {
            setError(`No building block pairs found for Type ${primaryType}.`);
          }
        } catch (err) {
          setError("Failed to load building block pairs. Please try again later.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    } else {
      // Handle case where primaryType is not yet available (e.g., redirect or show message)
      setError("Core personality type not determined. Please complete the Foundation phase.");
      setIsLoading(false);
    }
  }, [primaryType]);

  const currentPairDataFromAPI = allBlockPairData?.[currentBlockPairIndex];

  const handleBlockSelect = (
    _pairId: string,
    _blockData: Omit<BuildingBlockDataItem, 'isSelected' | 'onSelect'>,
    blockChoiceIndex: number
  ) => {
    setBlockSelectionInStore(currentBlockPairIndex, blockChoiceIndex);
  };

  const handleNext = () => {
    if (allBlockPairData && currentBlockPairIndex < allBlockPairData.length - 1) {
      goToNextBlockPairInStore();
    } else {
      console.log("Building Blocks phase complete.");
      navigate('/assessment/color-palette');
    }
  };

  const handlePrevious = () => {
    goToPreviousBlockPairInStore();
  };

  const [sizeContext, setSizeContext] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) setSizeContext('mobile');
      else if (window.innerWidth < 1024) setSizeContext('tablet');
      else setSizeContext('desktop');
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (isLoading) {
    return <div className={styles.loadingOrError}>Loading Building Blocks...</div>;
  }
  if (error) {
    return <div className={styles.loadingOrError}>{error}</div>;
  }
  if (!allBlockPairData || !currentPairDataFromAPI) {
    return <div className={styles.loadingOrError}>No building block data available.</div>;
  }

  const currentPairSelectionIndex = blockSelectionsUserInput[currentBlockPairIndex];
  const selectedBlockId = currentPairSelectionIndex !== null ? currentPairDataFromAPI.blocks[currentPairSelectionIndex]?.id : null;

  const blockPairPropsForComponent: BlockPairComponentProps['pairData'] = {
    ...currentPairDataFromAPI,
    blocks: [ // Ensure blocks are correctly typed and have ariaLabel
        {...currentPairDataFromAPI.blocks[0], id: currentPairDataFromAPI.blocks[0].id || currentPairDataFromAPI.blocks[0].blockId!, ariaLabel: currentPairDataFromAPI.blocks[0].content},
        {...currentPairDataFromAPI.blocks[1], id: currentPairDataFromAPI.blocks[1].id || currentPairDataFromAPI.blocks[1].blockId!, ariaLabel: currentPairDataFromAPI.blocks[1].content}
    ]
  };

  return (
    <div className={styles.buildingPage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Construct Your Tower</h1>
        <p className={styles.instructionText}>
          Your Core Type is: <strong>Type {primaryType}</strong>.
          Now, choose the blocks that best represent your typical behaviors and tendencies for each scenario.
        </p>
        <div className={styles.progressIndicator}>
          <p>Step {currentBlockPairIndex + 1} of {allBlockPairData.length}</p>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${((currentBlockPairIndex + 1) / allBlockPairData.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <BlockPair
          pairData={blockPairPropsForComponent}
          selectedBlockIdInPair={selectedBlockId}
          onBlockSelect={handleBlockSelect}
          sizeContext={sizeContext}
          isDisabled={selectedBlockId !== null}
        />
        <div className={styles.towerVizPlaceholder}>
          <p>(Conceptual Tower Visualization Area)</p>
          {wingCalculation && <p>Wing: {wingCalculation.primaryWing} ({wingCalculation.wingStrength})</p>}
          {arrowCalculation && (
            <div>
              <p>Integration to {arrowCalculation.integrationType} ({arrowCalculation.integrationStrength})</p>
              <p>Disintegration to {arrowCalculation.disintegrationType} ({arrowCalculation.disintegrationStrength})</p>
            </div>
          )}
        </div>
      </div>

      <footer className={styles.navigationFooter}>
        <SecondaryButton onClick={handlePrevious} disabled={currentBlockPairIndex === 0} size="medium">
          Previous Pair
        </SecondaryButton>
        <PrimaryButton onClick={handleNext} disabled={currentPairSelectionIndex === null} size="medium">
          {currentBlockPairIndex === allBlockPairData.length - 1 ? 'Continue to Color Palette' : 'Next Pair'}
        </PrimaryButton>
      </footer>

      {(wingCalculation || arrowCalculation) && currentBlockPairIndex === allBlockPairData.length - 1 && (
         <div className={styles.debugResults}>
          <h3>Building Block Calculations (Debug):</h3>
          {wingCalculation && <pre>Wing: {JSON.stringify(wingCalculation, null, 2)}</pre>}
          {arrowCalculation && <pre>Arrows: {JSON.stringify(arrowCalculation, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
};

export default BuildingBlocksPage;
