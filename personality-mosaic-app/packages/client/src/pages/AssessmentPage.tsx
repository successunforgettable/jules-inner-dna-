import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '../store/useAssessmentStore';
import './AssessmentPage.css';

// Import phase components
import WelcomeScreen from '../components/Welcome/WelcomeScreen';
import FoundationPhase from '../components/Foundation/FoundationPhase';
import BuildingPhase from '../components/Building/BuildingPhase';
import ColorPhase from '../components/Color/ColorPhase';
import DetailPhase from '../components/Detail/DetailPhase';
import ResultsPhase from '../components/Results/ResultsPhase';

// Import UI components
import ProgressIndicator from '../components/Common/ProgressIndicator';
import NavigationControls from '../components/Common/NavigationControls';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// Import utilities
import { 
  determinePersonalityType, 
  determineWing, 
  determineArrows,
  calculateStateImpact,
  determineSubtypeStack,
  generateCompleteProfile 
} from '../utils/personalityCalculations';
import { 
  saveAssessmentData, 
  generateAssessmentId,
  trackUserProgress,
  saveUserData 
} from '../utils/dataStorage';
import { validateAssessmentData } from '../utils/validation';
import { logAssessmentEvent } from '../utils/analytics';

// Types from the integrated spec
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  subscription?: 'free' | 'premium' | 'enterprise';
}

interface AssessmentData {
  id: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  currentPhase: PhaseType;
  
  // Foundation selections (9 sets)
  foundationSelections: number[];
  
  // Building selections (4 pairs)
  buildingSelections: number[];
  
  // Color selections (2 states + distribution)
  colorSelections: number[];
  colorDistribution: { primary: number; secondary: number };
  
  // Detail selections (token distribution)
  detailDistribution: { self: number; oneToOne: number; social: number };
  
  // Calculated results
  personalityType?: string;
  wingType?: string;
  arrowStates?: { integration: string; disintegration: string };
  operatingStates?: any;
  subtypeStack?: any;
  
  // Metadata
  version: string;
  duration?: number;
  confidence?: number;
}

type PhaseType = 'welcome' | 'foundation' | 'building' | 'color' | 'detail' | 'results';

interface AssessmentPageProps {
  user?: UserProfile;
  onComplete?: (results: any) => void;
  initialPhase?: PhaseType;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ 
  user, 
  onComplete, 
  initialPhase = 'welcome' 
}) => {
  // Zustand store state
  const {
    currentPhase,
    isComplete,
    startTime,
    foundationSelections,
    blockSelections,
    stateSelections,
    stateDistribution,
    subtypeDistribution,
    typeCalculation,
    wingCalculation,
    arrowCalculation,
    stateAnalysis,
    subtypeStack,
    completeProfile,
    
    // Actions
    startAssessment,
    setFoundationSelection,
    completeFoundationPhase,
    setBlockSelection,
    completeBuildingPhase,
    setStateSelections,
    setStateDistribution,
    completeColorPhase,
    setSubtypeDistribution,
    completeDetailPhase,
    generateCompleteProfile,
    goToPhase,
    goToNextPhase,
    goToPreviousPhase,
    resetAssessment
  } = useAssessmentStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(user || null);
  const [assessmentId] = useState(() => generateAssessmentId());
  const [saveProgress, setSaveProgress] = useState(true);

  // Initialize assessment
  useEffect(() => {
    if (initialPhase !== 'welcome' && !startTime) {
      startAssessment();
    }
    
    // Track page load
    logAssessmentEvent('assessment_page_loaded', {
      userId: userProfile?.id,
      initialPhase
    });
  }, [initialPhase, startTime, startAssessment, userProfile?.id]);

  // Auto-save progress
  useEffect(() => {
    if (saveProgress && userProfile && startTime) {
      const assessmentData: Partial<AssessmentData> = {
        id: assessmentId,
        userId: userProfile.id,
        startedAt: startTime,
        currentPhase,
        foundationSelections,
        buildingSelections: blockSelections,
        colorSelections: stateSelections,
        colorDistribution: stateDistribution,
        detailDistribution: subtypeDistribution,
        personalityType: typeCalculation?.primaryType,
        wingType: wingCalculation?.primaryWing,
        version: 'v19.0'
      };

      // Debounced save
      const timeoutId = setTimeout(() => {
        saveAssessmentData(assessmentData);
        trackUserProgress(userProfile.id, currentPhase);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    saveProgress, userProfile, assessmentId, currentPhase, startTime,
    foundationSelections, blockSelections, stateSelections, 
    stateDistribution, subtypeDistribution, typeCalculation, wingCalculation
  ]);

  // Handle user registration/login
  const handleUserData = useCallback(async (userData: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      const savedUser = await saveUserData({
        ...userData,
        id: userData.id || generateAssessmentId(),
        createdAt: userData.createdAt || new Date().toISOString(),
        subscription: userData.subscription || 'free'
      });
      
      setUserProfile(savedUser);
      
      logAssessmentEvent('user_registered', {
        userId: savedUser.id,
        email: savedUser.email
      });
      
    } catch (err) {
      setError('Failed to save user data. Please try again.');
      console.error('User data save error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle phase completion
  const handlePhaseComplete = useCallback(async (phase: PhaseType, data?: any) => {
    try {
      setError(null);
      
      // Validate phase data
      const isValid = validateAssessmentData(phase, data);
      if (!isValid) {
        throw new Error(`Invalid data for ${phase} phase`);
      }
      
      // Track phase completion
      logAssessmentEvent('phase_completed', {
        userId: userProfile?.id,
        phase,
        data: data ? Object.keys(data) : undefined
      });
      
      // Phase-specific handling
      switch (phase) {
        case 'foundation':
          if (foundationSelections.length === 9) {
            completeFoundationPhase();
          }
          break;
          
        case 'building':
          if (blockSelections.length === 4) {
            completeBuildingPhase();
          }
          break;
          
        case 'color':
          if (stateSelections.length === 2 && stateDistribution) {
            completeColorPhase();
          }
          break;
          
        case 'detail':
          const total = subtypeDistribution.self + subtypeDistribution.oneToOne + subtypeDistribution.social;
          if (total === 10) {
            completeDetailPhase();
          }
          break;
          
        case 'results':
          if (completeProfile) {
            // Save final results
            const finalData: AssessmentData = {
              id: assessmentId,
              userId: userProfile?.id || 'anonymous',
              startedAt: startTime || new Date().toISOString(),
              completedAt: new Date().toISOString(),
              currentPhase: 'results',
              foundationSelections,
              buildingSelections: blockSelections,
              colorSelections: stateSelections,
              colorDistribution: stateDistribution || { primary: 0, secondary: 0 },
              detailDistribution: subtypeDistribution,
              personalityType: completeProfile.primaryType,
              wingType: completeProfile.wing,
              arrowStates: {
                integration: completeProfile.integration,
                disintegration: completeProfile.disintegration
              },
              operatingStates: completeProfile.operatingStates,
              subtypeStack: completeProfile.instinctualStack,
              version: 'v19.0',
              duration: startTime ? Math.round((new Date().getTime() - new Date(startTime).getTime()) / 1000) : undefined,
              confidence: completeProfile.typeConfidence
            };
            
            await saveAssessmentData(finalData);
            
            // Call completion callback
            onComplete?.(completeProfile);
            
            logAssessmentEvent('assessment_completed', {
              userId: userProfile?.id,
              assessmentId,
              personalityType: completeProfile.primaryType,
              confidence: completeProfile.typeConfidence,
              duration: finalData.duration
            });
          }
          break;
      }
      
    } catch (err) {
      setError(`Error completing ${phase}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error(`Phase completion error (${phase}):`, err);
    }
  }, [
    userProfile?.id, assessmentId, startTime, foundationSelections, blockSelections,
    stateSelections, stateDistribution, subtypeDistribution, completeProfile,
    completeFoundationPhase, completeBuildingPhase, completeColorPhase, 
    completeDetailPhase, onComplete
  ]);

  // Handle navigation
  const handleNavigation = useCallback((direction: 'next' | 'previous' | PhaseType) => {
    try {
      if (typeof direction === 'string' && direction !== 'next' && direction !== 'previous') {
        goToPhase(direction);
      } else if (direction === 'next') {
        goToNextPhase();
      } else if (direction === 'previous') {
        goToPreviousPhase();
      }
      
      logAssessmentEvent('navigation', {
        userId: userProfile?.id,
        from: currentPhase,
        direction
      });
      
    } catch (err) {
      setError('Navigation error occurred');
      console.error('Navigation error:', err);
    }
  }, [currentPhase, userProfile?.id, goToPhase, goToNextPhase, goToPreviousPhase]);

  // Handle assessment reset
  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to restart the assessment? All progress will be lost.')) {
      resetAssessment();
      logAssessmentEvent('assessment_reset', {
        userId: userProfile?.id
      });
    }
  }, [resetAssessment, userProfile?.id]);

  // Calculate progress percentage
  const getProgressPercentage = useCallback((): number => {
    switch (currentPhase) {
      case 'welcome': return 0;
      case 'foundation': return Math.min((foundationSelections.length / 9) * 30, 30);
      case 'building': return 30 + Math.min((blockSelections.length / 4) * 20, 20);
      case 'color': return 50 + (stateSelections.length === 2 && stateDistribution ? 20 : 0);
      case 'detail': 
        const total = subtypeDistribution.self + subtypeDistribution.oneToOne + subtypeDistribution.social;
        return 70 + Math.min((total / 10) * 20, 20);
      case 'results': return 100;
      default: return 0;
    }
  }, [currentPhase, foundationSelections.length, blockSelections.length, stateSelections.length, stateDistribution, subtypeDistribution]);

  // Render current phase
  const renderCurrentPhase = () => {
    const commonProps = {
      onComplete: (data?: any) => handlePhaseComplete(currentPhase, data),
      onNext: () => handleNavigation('next'),
      onPrevious: () => handleNavigation('previous'),
      isLoading,
      error
    };

    switch (currentPhase) {
      case 'welcome':
        return (
          <WelcomeScreen
            {...commonProps}
            onUserData={handleUserData}
            onStart={() => {
              startAssessment();
              handleNavigation('foundation');
            }}
          />
        );
        
      case 'foundation':
        return (
          <FoundationPhase
            {...commonProps}
            selections={foundationSelections}
            onSelectionChange={setFoundationSelection}
            typeCalculation={typeCalculation}
          />
        );
        
      case 'building':
        return (
          <BuildingPhase
            {...commonProps}
            selections={blockSelections}
            onSelectionChange={setBlockSelection}
            primaryType={typeCalculation?.primaryType}
            wingCalculation={wingCalculation}
            arrowCalculation={arrowCalculation}
          />
        );
        
      case 'color':
        return (
          <ColorPhase
            {...commonProps}
            stateSelections={stateSelections}
            stateDistribution={stateDistribution}
            onStateSelections={setStateSelections}
            onStateDistribution={setStateDistribution}
            stateAnalysis={stateAnalysis}
          />
        );
        
      case 'detail':
        return (
          <DetailPhase
            {...commonProps}
            distribution={subtypeDistribution}
            onDistributionChange={setSubtypeDistribution}
            subtypeStack={subtypeStack}
          />
        );
        
      case 'results':
        return (
          <ResultsPhase
            {...commonProps}
            profile={completeProfile}
            userProfile={userProfile}
            assessmentId={assessmentId}
            onRestart={handleReset}
          />
        );
        
      default:
        return (
          <div className="error-state">
            <h2>Unknown Phase</h2>
            <p>Something went wrong. Please restart the assessment.</p>
            <button onClick={handleReset} className="btn btn-primary">
              Restart Assessment
            </button>
          </div>
        );
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  };

  return (
    <ErrorBoundary>
      <div className="assessment-page">
        {/* Progress indicator - hidden on welcome and results */}
        {currentPhase !== 'welcome' && currentPhase !== 'results' && (
          <ProgressIndicator 
            currentPhase={currentPhase}
            progress={getProgressPercentage()}
            className="assessment-progress"
          />
        )}
        
        {/* Main content area */}
        <main className="assessment-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              className="phase-container"
            >
              {isLoading ? (
                <LoadingSpinner message="Saving your progress..." />
              ) : (
                renderCurrentPhase()
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Navigation controls - shown for most phases */}
        {currentPhase !== 'welcome' && currentPhase !== 'results' && (
          <NavigationControls
            currentPhase={currentPhase}
            canGoBack={currentPhase !== 'foundation'}
            canGoNext={
              (currentPhase === 'foundation' && foundationSelections.length === 9) ||
              (currentPhase === 'building' && blockSelections.length === 4) ||
              (currentPhase === 'color' && stateSelections.length === 2 && stateDistribution) ||
              (currentPhase === 'detail' && subtypeDistribution.self + subtypeDistribution.oneToOne + subtypeDistribution.social === 10)
            }
            onPrevious={() => handleNavigation('previous')}
            onNext={() => handleNavigation('next')}
            onReset={handleReset}
            className="assessment-navigation"
          />
        )}
        
        {/* Global error display */}
        {error && (
          <motion.div 
            className="error-banner"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="error-content">
              <span className="error-message">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="error-dismiss"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <details>
              <summary>Debug Info</summary>
              <pre>{JSON.stringify({
                currentPhase,
                progress: getProgressPercentage(),
                foundationCount: foundationSelections.length,
                buildingCount: blockSelections.length,
                stateCount: stateSelections.length,
                subtypeTotal: subtypeDistribution.self + subtypeDistribution.oneToOne + subtypeDistribution.social,
                hasTypeCalc: !!typeCalculation,
                hasWingCalc: !!wingCalculation,
                hasProfile: !!completeProfile
              }, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AssessmentPage;
