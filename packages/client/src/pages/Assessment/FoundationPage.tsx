// TODO: TERMINOLOGY (Spec 1.5): Ensure data from fetchFoundationStoneSets() provides stone content and instructions using "BASELINES" instead of "Values" and adheres to all other terminology rules.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FoundationPage.module.css';
import StoneSet, { StoneSetComponentProps } from '../../components/foundation/StoneSet';
import FoundationBase from '../../components/foundation/FoundationBase';
import { StoneProps as IndividualStoneProps } from '../../components/foundation/Stone';
// Removed import of static `allStoneData`. Import type `StoneSetData`.
import { StoneSetData } from '../../lib/personalityData';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
// Import the content fetching service
import { fetchFoundationStoneSets } from '../../services/contentService';

const FoundationPage: React.FC = () => {
  const navigate = useNavigate();

  // State for fetched data, loading, and error
  const [allStoneSetsData, setAllStoneSetsData] = useState<StoneSetData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const foundationSelections = useAssessmentStore((state) => state.foundationSelections);
  const currentStoneSetIndex = useAssessmentStore((state) => state.currentStoneSetIndex);
  const typeCalculation = useAssessmentStore((state) => state.typeCalculation);

  const setFoundationSelectionInStore = useAssessmentStore((state) => state.setFoundationSelection);
  const goToNextStoneSetInStore = useAssessmentStore((state) => state.goToNextStoneSet);
  const goToPreviousStoneSetInStore = useAssessmentStore((state) => state.goToPreviousStoneSet);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFoundationStoneSets();
        if (data && data.length > 0) {
          setAllStoneSetsData(data);
        } else {
          setError("No foundation stone sets were found.");
        }
      } catch (err) {
        setError("Failed to load foundation stone sets. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const currentStoneSetDataFromAPI: StoneSetData | undefined = allStoneSetsData?.[currentStoneSetIndex];

  const baseSelectedStonesForVisualization: (IndividualStoneProps | null)[] =
    allStoneSetsData?.map((set, index) => {
      const selectionIndex = foundationSelections[index];
      if (selectionIndex === null) return null;
      const stoneDataFromSet = set.stones[selectionIndex];
      if (!stoneDataFromSet) return null;
      return {
        id: stoneDataFromSet.id || stoneDataFromSet.stoneId!, // Use id or stoneId
        content: stoneDataFromSet.contentLines,
        gradientStyle: stoneDataFromSet.gradientStyle || '', // Provide default if undefined
        isSelected: true,
        onSelect: () => {},
        ariaLabel: stoneDataFromSet.ariaLabel || stoneDataFromSet.contentLines.join(' & '),
      };
    }) || Array(9).fill(null); // Default to array of nulls if data not loaded

  const handleStoneSelect = (
    _setId: string,
    stoneData: Omit<IndividualStoneProps, 'isSelected' | 'onSelect'>,
    stoneIndexInSet: number
  ) => {
    // Pass original index from the set (0,1,2) and currentStoneSetIndex (0-8) from store
    setFoundationSelectionInStore(currentStoneSetIndex, stoneIndexInSet);
  };

  const handleNext = () => {
    if (allStoneSetsData && currentStoneSetIndex < allStoneSetsData.length - 1) {
      goToNextStoneSetInStore();
    } else {
      console.log("Foundation phase complete. Selections:", foundationSelections);
      console.log("Type Calculation result from store:", typeCalculation);
      navigate('/assessment/building-blocks');
    }
  };

  const handlePrevious = () => {
    goToPreviousStoneSetInStore();
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
    return <div className={styles.loadingOrError}>Loading Foundation Stones...</div>;
  }
  if (error) {
    return <div className={styles.errorPage}>{error}</div>;
  }
  if (!allStoneSetsData || !currentStoneSetDataFromAPI) {
    return <div className={styles.errorPage}>No assessment data available.</div>;
  }

  const stoneSetPropsForComponent: StoneSetComponentProps['stoneSetData'] = {
    ...currentStoneSetDataFromAPI,
    stones: currentStoneSetDataFromAPI.stones.map(s => ({
        ...s,
        id: s.id || s.stoneId!, // Ensure 'id' is passed to Stone component
        content: s.contentLines, // Ensure 'content' (array) is passed
        ariaLabel: s.ariaLabel || s.contentLines.join(' & ')
    }))
  };

  const currentSetSelectionIndex = foundationSelections[currentStoneSetIndex];

  return (
    <div className={styles.foundationPage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Lay Your Foundation</h1>
        <div className={styles.progressIndicator}>
          <p>Step {currentStoneSetIndex + 1} of {allStoneSetsData.length}</p>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${((currentStoneSetIndex + 1) / allStoneSetsData.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <StoneSet
          stoneSetData={stoneSetPropsForComponent}
          selectedStoneIdInSet={currentSetSelectionIndex !== null ? currentStoneSetDataFromAPI.stones[currentSetSelectionIndex]?.id || currentStoneSetDataFromAPI.stones[currentSetSelectionIndex]?.stoneId : null}
          onStoneSelect={handleStoneSelect}
          sizeContext={sizeContext}
          isDisabled={currentSetSelectionIndex !== null}
        />
        <FoundationBase selectedStones={baseSelectedStonesForVisualization} sizeContext={sizeContext} />
      </div>

      <footer className={styles.navigationFooter}>
        <SecondaryButton onClick={handlePrevious} disabled={currentStoneSetIndex === 0} size="medium">
          Previous Step
        </SecondaryButton>
        <PrimaryButton onClick={handleNext} disabled={currentSetSelectionIndex === null} size="medium">
          {currentStoneSetIndex === allStoneSetsData.length - 1 ? 'Continue to Building' : 'Next Step'}
        </PrimaryButton>
      </footer>

      {typeCalculation && currentStoneSetIndex === allStoneSetsData.length - 1 && (
        <div className={styles.debugResults}>
          <h3>Type Calculation Results (Debug):</h3>
          <pre>{JSON.stringify(typeCalculation, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FoundationPage;
