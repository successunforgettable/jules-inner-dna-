import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ColorPalettePage.module.css';
import PaletteSelector from '../../components/color/PaletteSelector';
import DistributionSlider from '../../components/color/DistributionSlider';
// Import types. Static data and getTypeSpecificPaletteData (that uses static data) removed.
import { PaletteInfo, PaletteInfoForDisplay } from '../../lib/colorPaletteData';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import { DistributionObject } from '../../lib/utils/personalityCalculations';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import SecondaryButton from '../../components/common/buttons/SecondaryButton';
// Import content fetching services
import { fetchColorPalettes, fetchPaletteDescriptionsForType } from '../../services/contentService';

const ColorPalettePage: React.FC = () => {
  const navigate = useNavigate();

  // State for fetched data, loading, and error
  const [basePalettesData, setBasePalettesData] = useState<PaletteInfo[] | null>(null);
  const [typeSpecificDescriptions, setTypeSpecificDescriptions] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryType = useAssessmentStore((state) => state.typeCalculation?.primaryType || null);

  const {
    colorPaletteSelections,
    colorPaletteDistribution,
    stateAnalysisResult,
    togglePaletteSelection,
    setColorPaletteDistribution,
  } = useAssessmentStore((state) => ({
    colorPaletteSelections: state.colorPaletteSelections,
    colorPaletteDistribution: state.colorPaletteDistribution,
    stateAnalysisResult: state.stateAnalysisResult,
    togglePaletteSelection: state.togglePaletteSelection,
    setColorPaletteDistribution: state.setColorPaletteDistribution,
  }));

  // Fetch base palettes and type-specific descriptions
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [basePalettes, descriptions] = await Promise.all([
          fetchColorPalettes(),
          fetchPaletteDescriptionsForType(primaryType)
        ]);

        if (basePalettes && basePalettes.length > 0) {
          setBasePalettesData(basePalettes);
        } else {
          setError("No color palettes were found.");
        }
        setTypeSpecificDescriptions(descriptions); // Can be empty if no specific texts found, handled by getTypeSpecificPaletteData
      } catch (err) {
        setError("Failed to load color palette data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [primaryType]);

  const palettesForDisplay: PaletteInfoForDisplay[] = useMemo(() => {
    if (!basePalettesData) return [];
    return basePalettesData.map((basePalette, index) => {
      const specificDescription = typeSpecificDescriptions?.[basePalette.id] || basePalette.genericDescription;
      // The client-side generateModifiedGradient can still be used if desired,
      // or gradient modification logic can be moved entirely to backend / CMS.
      // For now, assuming getTypeSpecificPaletteData from colorPaletteData.ts is updated to handle this.
      // Or, we simplify and just use baseGradientStyle if it's already type-specific from backend.
      // Let's use a refined getTypeSpecificPaletteData that now takes fetched specificDescription.
      const { getTypeSpecificPaletteData } = require('../../lib/colorPaletteData'); // Dynamic import for example

      return {
        ...getTypeSpecificPaletteData(basePalette, primaryType, specificDescription),
        originalIndex: index,
        id: basePalette.id // ensure id is present from basePalette
      };
    });
  }, [primaryType, basePalettesData, typeSpecificDescriptions]);


  const handlePaletteSelect = (paletteId: string | number) => {
    const selectedPaletteOriginal = basePalettesData?.find(p => p.id === paletteId);
    if (selectedPaletteOriginal && basePalettesData) {
      const originalIndex = basePalettesData.indexOf(selectedPaletteOriginal);
      togglePaletteSelection(paletteId, originalIndex);
    } else {
      console.error("Selected palette ID not found in availablePalettesData:", paletteId);
    }
  };

  const handleDistributionChange = (newPrimaryPercentage: number) => {
    const newDistribution: DistributionObject = {
      primaryPercentage: newPrimaryPercentage,
      secondaryPercentage: 100 - newPrimaryPercentage,
    };
    setColorPaletteDistribution(newDistribution);
  };

  const selectedPalettesFullInfoForSlider = useMemo((): [PaletteInfoForDisplay | null, PaletteInfoForDisplay | null] => {
    const selected: [PaletteInfoForDisplay | null, PaletteInfoForDisplay | null] = [null, null];
    if (colorPaletteSelections.ids.length > 0) {
      selected[0] = palettesForDisplay.find(p => p.id === colorPaletteSelections.ids[0]) || null;
    }
    if (colorPaletteSelections.ids.length > 1) {
      selected[1] = palettesForDisplay.find(p => p.id === colorPaletteSelections.ids[1]) || null;
    }
    return selected;
  }, [colorPaletteSelections.ids, palettesForDisplay]);


  const handleNext = () => {
    console.log("Color Palette phase complete.");
    navigate('/assessment/detail-elements');
  };

  const handlePrevious = () => {
    navigate('/assessment/building-blocks');
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

  const canProceed = colorPaletteSelections.ids.length === 2 && colorPaletteDistribution !== null && stateAnalysisResult !== null;

  if (isLoading) {
    return <div className={styles.loadingOrError}>Loading Color Palettes...</div>;
  }
  if (error) {
    return <div className={styles.loadingOrError}>{error}</div>;
  }
  if (!basePalettesData || palettesForDisplay.length === 0) {
     return <div className={styles.loadingOrError}>No color palette data available.</div>;
  }
  if (!primaryType && process.env.NODE_ENV !== 'development') {
     return <div className={styles.loadingOrError}>Primary type not determined. Please complete previous phases.</div>;
  }

  return (
    <div className={styles.colorPalettePage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Color Your States</h1>
        <p className={styles.instructionText}>
          Your primary type is: <strong>Type {primaryType || "N/A"}</strong>.
          Select two color palettes that best represent your common psychological states.
          Then, define their typical balance in your personality. The descriptions are tailored to your type.
        </p>
      </header>

      <div className={styles.mainContent}>
        <PaletteSelector
          palettesData={palettesForDisplay}
          selectedPaletteIds={colorPaletteSelections.ids}
          onPaletteSelect={handlePaletteSelect}
          sizeContext={sizeContext}
        />

        {colorPaletteSelections.ids.length === 2 && selectedPalettesFullInfoForSlider[0] && selectedPalettesFullInfoForSlider[1] && (
          <DistributionSlider
            selectedPalettes={selectedPalettesFullInfoForSlider as [PaletteInfoForDisplay, PaletteInfoForDisplay]}
            distribution={colorPaletteDistribution?.primaryPercentage ?? 50}
            onDistributionChange={handleDistributionChange}
            sizeContext={sizeContext}
          />
        )}

        <div className={styles.towerVizPlaceholder}>
          <p>(Conceptual Tower Visualization Area)</p>
          {selectedPalettesFullInfoForSlider[0] && colorPaletteDistribution && <p>Palette 1: {selectedPalettesFullInfoForSlider[0].stateName} ({colorPaletteDistribution.primaryPercentage}%)</p>}
          {selectedPalettesFullInfoForSlider[1] && colorPaletteDistribution && <p>Palette 2: {selectedPalettesFullInfoForSlider[1].stateName} ({colorPaletteDistribution.secondaryPercentage}%)</p>}
        </div>
      </div>

      <footer className={styles.navigationFooter}>
        <SecondaryButton onClick={handlePrevious} size="medium">
          Previous Phase
        </SecondaryButton>
        <PrimaryButton onClick={handleNext} disabled={!canProceed} size="medium">
          Continue to Detail Elements
        </PrimaryButton>
      </footer>

      {stateAnalysisResult && (
         <div className={styles.debugResults}>
          <h3>State Analysis Results (Debug):</h3>
          <pre>{JSON.stringify(stateAnalysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ColorPalettePage;
