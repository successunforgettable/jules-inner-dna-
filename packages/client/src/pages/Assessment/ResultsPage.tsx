import React, { useEffect, useState, useMemo, useRef } from 'react'; // Added useRef
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
import { TYPE_NAMES, TYPE_NICKNAMES } from '../../lib/terminology'; // Import centralized maps
import WhatsAppShareModal from '../../components/results/WhatsAppShareModal'; // Import the new modal
import { Link } from 'react-router-dom'; // Ensure Link is imported
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender

// Placeholder Icons (assuming these are fine for now)
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
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const gaResultsEventSent = useRef(false); // Ref to track if GA event was sent

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

  useEffect(() => {
    if (userProfile && userProfile.isComplete && !isFetchingContent && !gaResultsEventSent.current) {
      const coreTypeNum = typeof userProfile.determinedCoreType === 'object'
        ? (userProfile.determinedCoreType as IEnneagramTypeData)?.number
        : (coreTypeDetails?.number); // Fallback to details if populated by ID

      const coreTypeName = TYPE_NAMES[coreTypeNum?.toString() || ''] || 'UnknownType';
      const duration = userProfile.assessmentDuration || 0;
      sendGAEvent('Assessment', 'Complete', coreTypeName, duration);
      gaResultsEventSent.current = true;
    }
  }, [userProfile, coreTypeDetails, isFetchingContent]);

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

  // Terminology compliant narrative helper
  const applyTerminology = (text: string | undefined): string => {
    if (!text) return "";
    return text
      .replace(/Enneagram/gi, "Inner DNA system") // Updated replacement
      .replace(/Loyalist/gi, "Sentinel")
      .replace(/Values/gi, "BASELINES");
      // Add other global replacements as needed
  };

  const getNarrative = (sectionKey: string, fallbackText: string): string => {
    if (isFetchingContent && sectionKey !== 'executiveSummary') return "Loading content...";
    if (contentError && sectionKey !== 'executiveSummary') return "Error loading section content.";

    const coreTypeNumber = displayCoreType?.number;
    const coreTypeName = coreTypeNumber ? TYPE_NAMES[coreTypeNumber.toString()] || displayCoreType?.name : displayCoreType?.name;

    switch(sectionKey) {
      case 'executiveSummary':
        const coreTypeNameExec = coreTypeNumber ? TYPE_NAMES[coreTypeNumber.toString()] || displayCoreType?.name : 'N/A';
        const wingNumberExec = (displayWing?.wingType as IEnneagramTypeData)?.number;
        const wingInfluenceTextExec = wingNumberExec && coreTypeNameExec !== 'N/A'
          ? ` You are often influenced by the characteristics of the ${coreTypeNameExec} ${wingNumberExec}.`
          : (displayWing ? ` You also show an influence from ${applyTerminology(displayWing.name)} characteristics.` : '');
        const primaryStateNameExec = displayPrimaryState?.name ? applyTerminology(displayPrimaryState.name) : 'N/A';
        const instinctualFocusExec = displayInstinctualStacking?.primaryInstinct ? applyTerminology(displayInstinctualStacking.primaryInstinct) : 'N/A';
        return `Your Inner DNA profile indicates your core type is the **${coreTypeNameExec}**.${wingInfluenceTextExec} Your primary operating state tends to be influenced by feelings of "${primaryStateNameExec}", and your instinctual focus is often on ${instinctualFocusExec}.`;

      case 'coreTypeAnalysis': return applyTerminology(displayCoreType?.description) || fallbackText; // Placeholder: "[Detailed narrative for Core Type Analysis...]"
      case 'coreFear': return applyTerminology(displayCoreType?.coreFear) || fallbackText;
      case 'coreDesire': return applyTerminology(displayCoreType?.coreDesire) || fallbackText;
      case 'keyMotivations': return applyTerminology(displayCoreType?.keyMotivations) || fallbackText;

      case 'wingInfluence':
        const wingInfluenceNumber = (displayWing?.wingType as IEnneagramTypeData)?.number;
        const wingDesc = applyTerminology(displayWing?.description);
        // return `The ${coreTypeName} ${wingInfluenceNumber} influence means... ${wingDesc || '[Detailed narrative for Wing Influence...]'}`;
        return `${wingDesc || `[Detailed narrative for the ${coreTypeName} ${wingInfluenceNumber} influence as per Spec 7.3, ensuring approved terminology...]`}`;


      case 'arrowDynamics':
        // const growthTypeName = displayArrow?.growthTypeNumber ? TYPE_NAMES[displayArrow.growthTypeNumber.toString()] : 'your Growth Pathway';
        // const stressTypeName = displayArrow?.stressTypeNumber ? TYPE_NAMES[displayArrow.stressTypeNumber.toString()] : 'your Stress Pathway';
        const growthDescContent = applyTerminology(displayArrow?.growthDescription) || "[Description of positive state characteristics, focusing on behaviors and tendencies, avoiding direct type naming, as per Spec 7.3 sample content]";
        const stressDescContent = applyTerminology(displayArrow?.stressDescription) || "[Description of stress state characteristics, focusing on behaviors and tendencies, avoiding direct type naming, as per Spec 7.3 sample content]";
        return `When you're in a good mood (accessing your Growth Pathway), you may find you exhibit traits such as: ${growthDescContent}. When you're in a bad mood (accessing your Stress Pathway), you may find you exhibit traits such as: ${stressDescContent}.`;

      case 'operatingStatePrimary': return applyTerminology(displayPrimaryState?.typeSpecificDescriptions?.find(d => d.typeNumber === coreTypeNumber)?.description || displayPrimaryState?.description) || fallbackText;
      case 'operatingStateSecondary': return applyTerminology(displaySecondaryState?.typeSpecificDescriptions?.find(d => d.typeNumber === coreTypeNumber)?.description || displaySecondaryState?.description) || fallbackText;
      case 'instinctualStack': return applyTerminology(displayInstinctualStacking?.typeSpecificDescriptions?.find(d => d.typeNumber === coreTypeNumber)?.description || displayInstinctualStacking?.generalDescription) || `[Detailed narrative for your Instinctual Prioritization: ${applyTerminology(displayInstinctualStacking?.stack)} as per Spec 7.3...]`;
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
            wingNumber={(displayWing?.wingType as IEnneagramTypeData)?.number} // This structure might need adjustment for "Reformer 9" style
            foundationSelections={userProfile.foundationStoneSelections}
            buildingBlockSelections={userProfile.buildingBlockSelections}
            resolvedPaletteColors={resolvedPaletteColors}
            distributionData={userProfile.colorPaletteDistribution}
            tokenData={userProfile.detailElementTokenDistribution}
            blendedStateDescription={applyTerminology(userProfile.determinedOperatingStateFocus)}
          />
        </aside>
        <main className={styles.reportColumn}>
          {userProfile?.subscriptionPlan === 'free' && (
            <div className={styles.upgradeBanner}>
              <p>You are viewing a basic report summary. <Link to="/subscribe" className={styles.upgradeLink}>Upgrade to Premium</Link> for your full, detailed Inner DNA report and insights!</p>
            </div>
          )}
          <ReportSection title="Executive Summary" icon={<IconExecutiveSummary />}><p dangerouslySetInnerHTML={{ __html: getNarrative('executiveSummary', "Generating your summary...").replace(/\n/g, '<br />') }} /></ReportSection>

          {displayCoreType && (
            <ReportSection
              title={`Your Core Profile: ${TYPE_NAMES[displayCoreType.number.toString()] || displayCoreType.name} (${TYPE_NICKNAMES[displayCoreType.number.toString()] || applyTerminology(displayCoreType.nickname) || ''})`}
              icon={<IconCoreType />}
            >
              <p dangerouslySetInnerHTML={{ __html: getNarrative('coreTypeAnalysis', `[Detailed narrative for Core Profile as per Spec 7.3, using approved terminology, to be inserted here]`).replace(/\n/g, '<br />') }} />
              <p><strong>Core Fear:</strong> {getNarrative('coreFear', '...')}</p>
              <p><strong>Core Desire:</strong> {getNarrative('coreDesire', '...')}</p>
              <p><strong>Key BASELINES:</strong> {getNarrative('keyMotivations', '...')}</p> {/* Title updated here */}
            </ReportSection>
          )}

          {displayWing && displayCoreType && (
            <ReportSection
              title={`Your Unique Influence: ${TYPE_NAMES[displayCoreType.number.toString()] || displayCoreType.name} ${(displayWing.wingType as IEnneagramTypeData)?.number}`}
              icon={<IconWing />}
            >
              <p dangerouslySetInnerHTML={{ __html: getNarrative('wingInfluence', `[Detailed narrative for Your Unique Influence: ${TYPE_NAMES[displayCoreType.number.toString()] || displayCoreType.name} ${(displayWing.wingType as IEnneagramTypeData)?.number} as per Spec 7.3, using approved terminology...]`).replace(/\n/g, '<br />') }} />
            </ReportSection>
          )}

          {displayArrow && <ReportSection title="Your Dynamic Pathways (Mood States)" icon={<IconArrows />}><p dangerouslySetInnerHTML={{ __html: getNarrative('arrowDynamics', `[Detailed narrative for Your Dynamic Pathways (Mood States) as per Spec 7.3, using approved terminology...]`).replace(/\n/g, '<br />') }} /></ReportSection>}

          {displayPrimaryState && displaySecondaryState && userProfile.colorPaletteDistribution && (
            <ReportSection title="Your Operating State Focus" icon={<IconStates />}>
              <StateDistributionDisplay
                distribution={{
                  primaryStateName: applyTerminology(displayPrimaryState.name),
                  primaryPercentage: userProfile.colorPaletteDistribution.primaryPercentage || 50,
                  secondaryStateName: applyTerminology(displaySecondaryState.name),
                  secondaryPercentage: userProfile.colorPaletteDistribution.secondaryPercentage || 50,
                }}
                paletteColors={{ primary: displayPrimaryState.colors[0], secondary: displaySecondaryState.colors[0] }}
                title="Your State Distribution"
              />
              <p className={styles.reportParagraphTitle}>Focus on {applyTerminology(displayPrimaryState.name)}:</p>
              <p dangerouslySetInnerHTML={{ __html: getNarrative('operatingStatePrimary', `[Detailed narrative for Primary Operating State: ${applyTerminology(displayPrimaryState.name)} as per Spec 7.3...]`).replace(/\n/g, '<br />') }}/>
              <p className={styles.reportParagraphTitle}>Focus on {applyTerminology(displaySecondaryState.name)}:</p>
              <p dangerouslySetInnerHTML={{ __html: getNarrative('operatingStateSecondary', `[Detailed narrative for Secondary Operating State: ${applyTerminology(displaySecondaryState.name)} as per Spec 7.3...]`).replace(/\n/g, '<br />') }}/>
            </ReportSection>
          )}

          {displayInstinctualStacking && (
             <ReportSection title={`Your Instinctual Prioritization`} icon={<IconSubtype />}>
                <p dangerouslySetInnerHTML={{ __html: getNarrative('instinctualStack', `[Detailed narrative for Your Instinctual Prioritization: ${applyTerminology(displayInstinctualStacking.primaryInstinct)} leading, then ${applyTerminology(displayInstinctualStacking.secondaryInstinct)}, and ${applyTerminology(displayInstinctualStacking.tertiaryInstinct)} as per Spec 7.3...]`).replace(/\n/g, '<br />') }} />
            </ReportSection>
          )}
          <ReportSection title="Personalized Growth Opportunities" icon={<IconGrowthPlan />}><p>[Content for Personalized Growth Opportunities as per Spec 7.2/7.3, using approved terminology, to be inserted here]</p></ReportSection>
          <ReportSection title="Insights for Relationships" icon={<IconRelationships />}><p>[Content for Insights for Relationships as per Spec 7.2/7.3, using approved terminology, to be inserted here]</p></ReportSection>

          <div className={styles.actionButtons}>
            <PrimaryButton onClick={handleDownloadReport} size="large">Download Report (PDF)</PrimaryButton>
            <SecondaryButton
              onClick={() => setIsWhatsAppModalOpen(true)}
              size="large"
            >
              Share via WhatsApp
            </SecondaryButton>
            <SecondaryButton onClick={handleStartNewAssessment} size="large">Start New Assessment</SecondaryButton>
          </div>
        </main>
      </div>
      {userProfile?._id && ( // Ensure there's an ID to pass; use appropriate assessment ID from profile if different
        <WhatsAppShareModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          assessmentId={userProfile._id} // Assuming userProfile._id can serve as or contains the assessmentId
        />
      )}
    </div>
  );
};
export default ResultsPage;
