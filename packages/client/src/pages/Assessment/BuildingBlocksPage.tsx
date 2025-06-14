// TODO: TERMINOLOGY (Spec 1.5): Data from fetchBuildingBlockPairs() (questionText, block content) MUST be terminology compliant:
// 1. Wing pair questions/content: Use "[Primary Type Name] [Influence Number]" format (e.g., "Reformer 9"), not "1w9" or "wing".
// 2. Arrow pair questions/content: Use mood-based descriptions ("good mood" / "bad mood"), not "integration/disintegration" or "arrows".
// 3. All content: Use "BASELINES", no "Enneagram", Type 6 = "Sentinel".
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
import TowerVisualizer from '../../components/common/TowerVisualizer';
import { TYPE_NAMES } from '../../lib/terminology'; // Import TYPE_NAMES
// Removed problematic type import, as types are defined locally for now or should be exported from TowerVisualizer

const BuildingBlocksPage: React.FC = () => {
  const navigate = useNavigate();

  const [allBlockPairData, setAllBlockPairData] = useState<BlockPairData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coreTypeCalculation = useAssessmentStore((state) => state.typeCalculation);
  const primaryType = coreTypeCalculation?.primaryType || null;

  // Access foundation selections from the store
  const foundationSelections = useAssessmentStore((state) => state.foundationSelections);

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

  // --- Data Preparation for TowerVisualizer ---
  // Define local types if not exported from TowerVisualizer (as per current TowerVisualizer.tsx)
  interface LocalFoundationStoneData { id: string; color: string; }
  interface LocalBuildingBlockData { id: string; color: string; height: number; }

  const foundationStonesForViz = useMemo(() => {
    return foundationSelections
      .map((sel, index) => sel !== null ? ({ id: `fs_mock_${index}_sel_${sel}`, color: 'darkgrey' }) : null) // Using 'darkgrey' as placeholder
      .filter(s => s !== null) as LocalFoundationStoneData[];
  }, [foundationSelections]);

  const buildingBlocksForViz = useMemo(() => {
    const blocks: LocalBuildingBlockData[] = [];
    if (allBlockPairData) {
      for (let i = 0; i < currentBlockPairIndex + (currentPairSelectionIndex !== null ? 1: 0) ; i++) { // Iterate up to current pair, include if selected
        const selectionIndex = blockSelectionsUserInput[i];
        if (selectionIndex !== null && allBlockPairData[i]) {
          const selectedBlockData = allBlockPairData[i].blocks[selectionIndex];
          blocks.push({
            id: selectedBlockData.id || selectedBlockData.blockId || `bb_mock_${i}_${selectionIndex}`,
            color: 'steelblue', // Placeholder color for building blocks
            height: 30 // Placeholder height
          });
        }
      }
    }
    return blocks;
  }, [allBlockPairData, blockSelectionsUserInput, currentBlockPairIndex, currentPairSelectionIndex]);
  // --- End Data Preparation ---


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
          Your Core Profile is: <strong>{primaryType ? TYPE_NAMES[primaryType.toString()] : 'N/A'}</strong>.
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
        <TowerVisualizer
          foundationStones={foundationStonesForViz}
          buildingBlocks={buildingBlocksForViz}
        />
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
