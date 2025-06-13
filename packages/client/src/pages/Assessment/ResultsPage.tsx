import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResultsPage.module.css';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import FinalTowerDisplay from '../../components/results/FinalTowerDisplay';
import ReportSection from '../../components/results/ReportSection';
import ScoreBarDisplay from '../../components/results/ScoreBarDisplay';
import StateDistributionDisplay from '../../components/results/StateDistributionDisplay';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
// Types - Adjust path as necessary if your shared folder is different
import {
    IAssessmentProfile,
    IEnneagramTypeData,
    IWingData,
    IArrowData,
    IOperatingStateData,
    IInstinctualStackingData,
    IColorPaletteSelection
} from '../../../../shared/types/assessment.types';
import * as contentService from '../../services/contentService';

// Placeholder Icons
const IconPlaceholder: React.FC<{ name: string } & React.SVGProps<SVGSVGElement>> = ({ name, ...props }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props} aria-label={`${name} icon`}>
    <circle cx="12" cy="12" r="10" stroke="var(--ui-accent-primary)" strokeWidth="1.5" fill="none" />
    <text x="12" y="16" fontSize="10" textAnchor="middle" fill="var(--ui-accent-primary)">{name.substring(0,1)}</text>
  </svg>
);
const IconExecutiveSummary = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Summary" {...props} />;
const IconCoreType = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Core" {...props} />;
const IconWing = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Wing" {...props} />;
const IconArrows = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Arrows" {...props} />;
const IconStates = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="States" {...props} />;
const IconSubtype = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Subtype" {...props} />;
const IconGrowthPlan = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Growth" {...props} />;
const IconRelationships = (props: React.SVGProps<SVGSVGElement>) => <IconPlaceholder name="Relations" {...props} />;

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    isSubmittingProfile: isLoadingProfile,
    submissionError: profileError,
    fetchUserProfile,
    resetAssessment,
  } = useAssessmentStore((state) => ({
    userProfile: state.userProfile,
    isSubmittingProfile: state.isSubmittingProfile,
    submissionError: state.submissionError,
    fetchUserProfile: state.fetchUserProfile,
    resetAssessment: state.resetAssessment,
  }));

  const [coreTypeDetails, setCoreTypeDetails] = useState<IEnneagramTypeData | null>(null);
  const [wingDetails, setWingDetails] = useState<IWingData | null>(null);
  const [arrowDetails, setArrowDetails] = useState<IArrowData | null>(null);
  const [selectedOperatingStates, setSelectedOperatingStates] = useState<(IOperatingStateData | null)[]>([null, null]);
  const [instinctualStackingDetails, setInstinctualStackingDetails] = useState<IInstinctualStackingData | null>(null);

  const [isFetchingContent, setIsFetchingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile();
    }
  }, [userProfile, fetchUserProfile]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userProfile || !userProfile.isComplete) return;

      setIsFetchingContent(true);
      setContentError(null);
      try {
        let coreTypeNum: number | undefined = undefined;
        if (userProfile.determinedCoreType) {
          if (typeof userProfile.determinedCoreType === 'object' && '_id' in userProfile.determinedCoreType) {
            coreTypeNum = (userProfile.determinedCoreType as IEnneagramTypeData).number;
            setCoreTypeDetails(userProfile.determinedCoreType as IEnneagramTypeData);
          } else { // Assuming it's an ObjectId string or number if not populated
            const typeIdOrNum = userProfile.determinedCoreType as string | number;
            const typeData = typeof typeIdOrNum === 'number'
                ? await contentService.getEnneagramTypeByNumber(typeIdOrNum)
                : await contentService.getEnneagramTypeById(typeIdOrNum); // Assumes getEnneagramTypeById exists
            setCoreTypeDetails(typeData as IEnneagramTypeData);
            coreTypeNum = typeData?.number;
          }
        }

        if (coreTypeNum) {
          const arrowData = await contentService.getArrowsForType(coreTypeNum);
          setArrowDetails(arrowData as IArrowData);

          if (userProfile.determinedWing) {
             if (typeof userProfile.determinedWing === 'object' && '_id' in userProfile.determinedWing) {
                setWingDetails(userProfile.determinedWing as IWingData);
             } else {
                // If determinedWing is an ObjectId string, need a contentService.getWingById(id)
                // or adjust backend to populate it more deeply.
                // For now, if not object, we can't easily fetch without more info or service functions
                console.warn("Wing details might not be fully populated.");
             }
          }
        }

        if (userProfile.colorPaletteSelections && userProfile.colorPaletteSelections.length === 2) {
          const allStates = await contentService.getAllOperatingStates();
          const selStates: (IOperatingStateData | null)[] = [null, null];
          userProfile.colorPaletteSelections.forEach(sel => {
            const foundState = allStates.find(s => s._id === sel.paletteId || s.name === sel.paletteId); // Allow matching by ID or name
            if(foundState){
                if(sel.choice === 'primary') selStates[0] = foundState as IOperatingStateData;
                else if(sel.choice === 'secondary') selStates[1] = foundState as IOperatingStateData;
            }
          });
          setSelectedOperatingStates(selStates);
        }

        if (userProfile.determinedInstinctualStacking) {
          if (typeof userProfile.determinedInstinctualStacking === 'object' && '_id' in userProfile.determinedInstinctualStacking) {
            setInstinctualStackingDetails(userProfile.determinedInstinctualStacking as IInstinctualStackingData);
          } else {
            // Need contentService.getInstinctualStackingById(id)
            console.warn("Instinctual stacking details might not be fully populated if not an object.");
          }
        }

      } catch (err: any) {
        setContentError(err.message || "Failed to load detailed content for your results.");
        console.error(err);
      } finally {
        setIsFetchingContent(false);
      }
    };

    fetchDetails();
  }, [userProfile]);

  if (isLoadingProfile) return <div className={styles.resultsPage}><div className={styles.loadingOrError}>Loading your profile...</div></div>;
  if (profileError) return <div className={styles.resultsPage}><div className={styles.loadingOrError}><h2>Error Loading Profile</h2><p>{profileError}</p><PrimaryButton onClick={() => fetchUserProfile()}>Try Again</PrimaryButton></div></div>;
  if (!userProfile || !userProfile.isComplete) return <div className={styles.resultsPage}><div className={styles.loadingOrError}><h2>Assessment Incomplete</h2><p>Please complete the assessment to view your results.</p><PrimaryButton onClick={() => navigate('/assessment/foundation')}>Start Assessment</PrimaryButton></div></div>;

  const displayCoreType = coreTypeDetails;
  const displayWing = wingDetails;
  const displayArrow = arrowDetails;
  const displayPrimaryState = selectedOperatingStates[0];
  const displaySecondaryState = selectedOperatingStates[1];
  const displayInstinctualStacking = instinctualStackingDetails;

  const handleDownloadReport = () => console.log("Download Report Triggered. Profile Data:", JSON.stringify(userProfile, null, 2)) || alert("Report data logged. Download not implemented.");
  const handleStartNewAssessment = () => resetAssessment() || navigate('/assessment/foundation');

  const getNarrative = (sectionKey: string, fallbackText: string): string => {
    if (isFetchingContent && sectionKey !== 'executiveSummary') return "Loading content..."; // Allow exec summary to show basic info
    if (contentError && sectionKey !== 'executiveSummary') return "Error loading section content.";
    const coreTypeNumStr = displayCoreType?.number?.toString();

    switch(sectionKey) {
        case 'executiveSummary':
            return `This is your Inner DNA executive summary. Your core type is ${displayCoreType?.name || 'N/A'}${displayWing ? ` with a ${displayWing.name}` : ''}. Your primary operating state tends to be influenced by feelings of "${displayPrimaryState?.name || 'N/A'}" and your instinctual focus is often on ${displayInstinctualStacking?.primaryInstinct || 'N/A'}.`;
        case 'coreTypeAnalysis': return displayCoreType?.description || fallbackText;
        case 'coreFear': return displayCoreType?.coreFear || fallbackText;
        case 'coreDesire': return displayCoreType?.coreDesire || fallbackText;
        case 'keyMotivations': return displayCoreType?.keyMotivations || fallbackText;
        case 'wingInfluence': return displayWing?.description || fallbackText;
        case 'arrowDynamics': return `When moving towards growth (integrating to Type ${displayArrow?.growthTypeNumber}), you may experience: ${displayArrow?.growthDescription}. Under stress (disintegrating to Type ${displayArrow?.stressTypeNumber}), you might find: ${displayArrow?.stressDescription}` || fallbackText;
        case 'operatingStatePrimary': return displayPrimaryState?.typeSpecificDescriptions?.find(d => d.typeNumber === displayCoreType?.number)?.description || displayPrimaryState?.description || fallbackText;
        case 'operatingStateSecondary': return displaySecondaryState?.typeSpecificDescriptions?.find(d => d.typeNumber === displayCoreType?.number)?.description || displaySecondaryState?.description || fallbackText;
        case 'instinctualStack': return displayInstinctualStacking?.typeSpecificDescriptions?.find(d => d.typeNumber === displayCoreType?.number)?.description || displayInstinctualStacking?.generalDescription || fallbackText;
        default: return fallbackText;
    }
  };

  const resolvedPaletteColors = useMemo(() => {
    if (displayPrimaryState && displaySecondaryState) {
      return {
        primary: displayPrimaryState.colors[0] || '#cccccc', // Default to first color or gray
        secondary: displaySecondaryState.colors[0] || '#dddddd',
      };
    }
    return null;
  }, [displayPrimaryState, displaySecondaryState]);

  return (
    <div className={styles.resultsPage}>
      <header className={styles.pageHeader}><h1>Your Inner DNA Results</h1><p>A detailed visual and written exploration of your unique self.</p></header>
      {isFetchingContent && <div className={styles.loadingOrError}>Loading detailed report content...</div>}
      {contentError && <div className={styles.loadingOrError}>{contentError}</div>}
      <div className={styles.mainLayout}>
        <aside className={styles.towerDisplayColumn}>
          <FinalTowerDisplay
            coreTypeNumber={displayCoreType?.number}
            coreTypeColor={displayCoreType?.colorHex}
            wingNumber={(displayWing?.wingType as IEnneagramTypeData)?.number}
            foundationSelections={userProfile.foundationStoneSelections}
            buildingBlockSelections={userProfile.buildingBlockSelections}
            resolvedPaletteColors={resolvedPaletteColors}
            distributionData={userProfile.colorPaletteDistribution}
            tokenData={userProfile.detailElementTokenDistribution}
            blendedStateDescription={userProfile.determinedOperatingStateFocus} // Or generate a more detailed one
          />
        </aside>
        <main className={styles.reportColumn}>
          <ReportSection title="Executive Summary" icon={<IconExecutiveSummary />}><p dangerouslySetInnerHTML={{ __html: getNarrative('executiveSummary', "Generating your summary...").replace(/\n/g, '<br />') }} /></ReportSection>
          {displayCoreType && (
            <ReportSection title={`Core Type: ${displayCoreType.name} (${displayCoreType.nickname})`} icon={<IconCoreType />}>
              <p dangerouslySetInnerHTML={{ __html: getNarrative('coreTypeAnalysis', `...`).replace(/\n/g, '<br />') }} />
              <p><strong>Core Fear:</strong> {getNarrative('coreFear', '...')}</p>
              <p><strong>Core Desire:</strong> {getNarrative('coreDesire', '...')}</p>
              <p><strong>Key Motivations:</strong> {getNarrative('keyMotivations', '...')}</p>
              {/* ScoreBarDisplay might need different data source now, e.g. userProfile.typeCalculation.allScores if that's how it's stored from assessment flow */}
            </ReportSection>
          )}
          {displayWing && <ReportSection title={`Wing: ${displayWing.name}`} icon={<IconWing />}><p dangerouslySetInnerHTML={{ __html: getNarrative('wingInfluence', `...`).replace(/\n/g, '<br />') }} /></ReportSection>}
          {displayArrow && <ReportSection title="Arrows: Integration & Disintegration" icon={<IconArrows />}><p dangerouslySetInnerHTML={{ __html: getNarrative('arrowDynamics', `...`).replace(/\n/g, '<br />') }} /></ReportSection>}

          {displayPrimaryState && displaySecondaryState && userProfile.colorPaletteDistribution && (
            <ReportSection title="Operating States & Activation" icon={<IconStates />}>
              <StateDistributionDisplay
                distribution={{
                  primaryStateName: displayPrimaryState.name,
                  primaryPercentage: userProfile.colorPaletteDistribution.primaryPercentage || 50,
                  secondaryStateName: displaySecondaryState.name,
                  secondaryPercentage: userProfile.colorPaletteDistribution.secondaryPercentage || 50,
                }}
                paletteColors={{ primary: displayPrimaryState.colors[0], secondary: displaySecondaryState.colors[0] }}
                title="Your State Distribution"
              />
              <p className={styles.reportParagraphTitle}>Focus on {displayPrimaryState.name}:</p>
              <p dangerouslySetInnerHTML={{ __html: getNarrative('operatingStatePrimary', '...').replace(/\n/g, '<br />') }}/>
              <p className={styles.reportParagraphTitle}>Focus on {displaySecondaryState.name}:</p>
              <p dangerouslySetInnerHTML={{ __html: getNarrative('operatingStateSecondary', '...').replace(/\n/g, '<br />') }}/>
              {/* Add overall activation and insights from userProfile.stateAnalysisResult if available */}
            </ReportSection>
          )}

          {displayInstinctualStacking && (
             <ReportSection title={`Instinctual Stack: ${displayInstinctualStacking.stack} (${displayInstinctualStacking.primaryInstinct} Dominant)`} icon={<IconSubtype />}>
                <p dangerouslySetInnerHTML={{ __html: getNarrative('instinctualStack', `...`).replace(/\n/g, '<br />') }} />
            </ReportSection>
          )}
          <ReportSection title="Personalized Growth Plan" icon={<IconGrowthPlan />}><p>Personalized growth recommendations...</p></ReportSection>
          <ReportSection title="Relationship Insights" icon={<IconRelationships />}><p>Understanding your patterns in relationships...</p></ReportSection>
          <div className={styles.actionButtons}><PrimaryButton onClick={handleDownloadReport} size="large">Download Report (PDF)</PrimaryButton><SecondaryButton onClick={handleStartNewAssessment} size="large">Start New Assessment</SecondaryButton></div>
        </main>
      </div>
    </div>
  );
};
export default ResultsPage;
