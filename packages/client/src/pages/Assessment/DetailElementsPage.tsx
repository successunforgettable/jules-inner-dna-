// TODO: TERMINOLOGY (Spec 1.5): Data from fetchSubtypeContainerDescriptionsForType() must be terminology compliant.
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DetailElementsPage.module.css';
import SubtypeContainer, { SubtypeContainerId, SubtypeContainerProps } from '../../components/detail/SubtypeContainer';
import TokenPool from '../../components/detail/TokenPool';
// Import types and base data. Type-specific descriptions and token gradient are fetched/derived.
import {
  subtypeContainersBaseData,
  SubtypeContainerInfo,
  // getTypeSpecificContainerData, // Logic will be combined with fetched descriptions
  getTokenGradientForType,      // This can remain client-side or be fetched if complex
} from '../../lib/detailElementData';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
import clsx from 'clsx';
// Import content fetching service
import { fetchSubtypeContainerDescriptionsForType } from '../../services/contentService';
import { TYPE_NAMES } from '../../lib/terminology'; // Import TYPE_NAMES


const TOTAL_TOKENS = 10;

const DetailElementsPage: React.FC = () => {
  const navigate = useNavigate();

  const [typeSpecificDescriptions, setTypeSpecificDescriptions] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryType = useAssessmentStore((state) => state.typeCalculation?.primaryType || null);

  const {
    tokenDistribution,
    placedTokensCount,
    subtypeStackResult,
    setTokenInContainer,
    setAssessmentComplete,
    // New store properties and actions for API submission
    submitFullAssessment,
    isSubmittingProfile,
    submissionError,
  } = useAssessmentStore((state) => ({
    tokenDistribution: state.tokenDistribution,
    placedTokensCount: state.placedTokensCount,
    subtypeStackResult: state.subtypeStackResult,
    setTokenInContainer: state.setTokenInContainer,
    setAssessmentComplete: state.setAssessmentComplete,
    // New
    submitFullAssessment: state.submitFullAssessment,
    isSubmittingProfile: state.isSubmittingProfile,
    submissionError: state.submissionError,
  }));

  useEffect(() => {
    if (primaryType) {
      const loadDescriptions = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const descriptions = await fetchSubtypeContainerDescriptionsForType(primaryType);
          setTypeSpecificDescriptions(descriptions);
        } catch (err) {
          setError("Failed to load content for detail elements. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadDescriptions();
    } else if (process.env.NODE_ENV !== 'development') { // Allow dev if primaryType is missing for easier testing
        setError("Primary type not determined. Please complete previous phases.");
        setIsLoading(false);
    } else { // In dev, if no primary type, allow to proceed with generic descriptions
        setIsLoading(false);
    }
  }, [primaryType]);


  const availableTokenCount = TOTAL_TOKENS - placedTokensCount;
  const tokenGradient = useMemo(() => getTokenGradientForType(primaryType), [primaryType]);

  const handleContainerClick = (containerId: SubtypeContainerId) => {
    if (availableTokenCount > 0) {
      setTokenInContainer(containerId, 'add');
    }
  };

  const handleTokenClickInContainer = (containerId: SubtypeContainerId, _tokenIndex: number) => {
    setTokenInContainer(containerId, 'remove');
  };

  const typeSpecificContainers: SubtypeContainerProps[] = useMemo(() => {
    return subtypeContainersBaseData.map(baseInfo => {
      const description = typeSpecificDescriptions?.[baseInfo.id] || baseInfo.genericDescription;
      return {
        ...baseInfo,
        description: description,
        placedTokensCount: tokenDistribution[baseInfo.id] || 0,
        maxTokensForVisualDisplay: 7,
        totalTokensAllowed: TOTAL_TOKENS,
        onContainerClick: handleContainerClick,
        onTokenClickInContainer: handleTokenClickInContainer,
        tokenGradient: tokenGradient,
        isActive: false,
      };
    });
  }, [primaryType, tokenDistribution, tokenGradient, typeSpecificDescriptions]); // Removed handleContainerClick etc. if stable


  const handleNext = async () => {
    if (placedTokensCount === TOTAL_TOKENS && subtypeStackResult) {
      console.log("Detail Elements phase complete, attempting to submit full assessment.");
      // No need to call setAssessmentComplete(true) here, as submitFullAssessment will handle it
      // by updating userProfile which implies completion or by setting isAssessmentComplete directly.
      const profile = await submitFullAssessment();
      if (profile) {
        console.log("Assessment submitted successfully, navigating to results.");
        navigate('/assessment/results');
      } else {
        // Error is handled by submissionError state, displayed below
        console.error("Assessment submission failed.");
      }
    } else {
      console.warn("Attempted to proceed without all tokens placed or calculations complete.");
      // Optionally, set a local error state here if not relying on global submissionError for this check
    }
  };

  const handlePrevious = () => {
    navigate('/assessment/color-palette');
  };

  const [sizeContext, setSizeContext] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
   useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) setSizeContext('mobile');
      else if (window.innerWidth < 1024) setSizeContext('tablet');
      else setSizeContext('desktop');
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (isLoading) {
    return <div className={styles.loadingOrError}>Loading Detail Element content...</div>;
  }
  if (error) {
     return <div className={styles.loadingOrError}>{error}</div>;
  }
  // Allow proceeding in dev mode even if primaryType is null for easier testing of this page isolated
  if (!primaryType && process.env.NODE_ENV !== 'development') {
     return <div className={styles.loadingOrError}>Primary type not determined. Please complete previous phases.</div>;
  }


  return (
    <div className={styles.detailElementsPage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add Your Details</h1>
        <div className={styles.instructionPanel}>
          <h2 className={styles.instructionTitle}>Distribute Your Instinctual Energy</h2>
          <p className={styles.instructionText}>
            Your primary profile is: <strong>{primaryType ? TYPE_NAMES[primaryType.toString()] : "N/A"}</strong>.
            You have <strong>{TOTAL_TOKENS}</strong> detail tokens representing your core instinctual energy.
            Click on a focus area below to allocate a token. Click a token within an area to return it to the pool.
            Distribute all tokens to reflect how your energy is typically prioritized.
          </p>
          <p className={styles.progressText}>
            {placedTokensCount} of {TOTAL_TOKENS} tokens placed.
            ({availableTokenCount} remaining in pool)
          </p>
        </div>
      </header>

      <TokenPool
        availableTokenCount={availableTokenCount}
        totalTokens={TOTAL_TOKENS}
        tokenGradient={tokenGradient}
      />

      <div className={clsx(styles.containersLayout, styles[sizeContext])}>
        {typeSpecificContainers.map(containerProps => (
          <SubtypeContainer key={containerProps.id} {...containerProps} sizeContext={sizeContext} />
        ))}
      </div>

      <footer className={styles.navigationFooter}>
        <SecondaryButton onClick={handlePrevious} disabled={isSubmittingProfile} size="medium">
          Previous Phase
        </SecondaryButton>
        <PrimaryButton
          onClick={handleNext}
          disabled={placedTokensCount !== TOTAL_TOKENS || !subtypeStackResult || isSubmittingProfile}
          size="medium"
        >
          {isSubmittingProfile ? 'Submitting...' : 'Complete & View Results'}
        </PrimaryButton>
      </footer>

      {submissionError && (
        <div className={styles.submissionErrorText}>
          Error submitting assessment: {submissionError}
        </div>
      )}

      {subtypeStackResult && placedTokensCount === TOTAL_TOKENS && (
         <div className={styles.debugResults}>
          <h3>Subtype Stack Results (Debug):</h3>
          <pre>{JSON.stringify(subtypeStackResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DetailElementsPage;
