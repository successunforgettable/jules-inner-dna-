// TODO: TERMINOLOGY (Spec 1.5): Data from fetchPaletteDescriptionsForType() must be terminology compliant.
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
import TowerVisualizer, {
  FoundationStoneData,
  BuildingBlockData,
  ColorPaletteData as TowerColorPaletteData, // Alias to avoid naming conflict if any
  ColorDistribution as TowerColorDistribution
} from '../../components/common/TowerVisualizer';
import { TYPE_NAMES } from '../../lib/terminology'; // Import TYPE_NAMES
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender


const ColorPalettePage: React.FC = () => {
  const navigate = useNavigate();

  // State for fetched data, loading, and error
  const [basePalettesData, setBasePalettesData] = useState<PaletteInfo[] | null>(null);
  const [typeSpecificDescriptions, setTypeSpecificDescriptions] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryType = useAssessmentStore((state) => state.typeCalculation?.primaryType || null);
  const foundationSelections = useAssessmentStore((state) => state.foundationSelections);
  const blockSelectionsUserInput = useAssessmentStore((state) => state.blockSelectionsUserInput); // To know how many blocks to render

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
    // Not fetching allBlockPairData here, will use placeholders for building block properties other than count
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
    // This is the completion of the Color Palette phase
    sendGAEvent('Assessment', 'PhaseComplete', 'ColorPalette');
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

  // --- Data Preparation for TowerVisualizer ---
  const foundationStonesForViz = useMemo((): FoundationStoneData[] => {
    return foundationSelections
      .map((sel, index) => sel !== null ? ({ id: `fs_mock_${index}_sel_${sel}`, color: 'darkslategrey' }) : null) // Darker placeholder for foundation
      .filter(s => s !== null) as FoundationStoneData[];
  }, [foundationSelections]);

  const buildingBlocksForViz = useMemo((): BuildingBlockData[] => {
    // Simplified: create blocks based on selections count, as allBlockPairData is not readily available here.
    // Actual color/height will be overridden by palette or defaults in TowerVisualizer if not using palette.
    return blockSelectionsUserInput
      .filter(sel => sel !== null) // Only count actual selections
      .map((sel, index) => ({
        id: `bb_mock_colorpage_${index}_sel_${sel}`,
        color: 'lightgray', // This color will be overridden by palette gradient in TowerVisualizer
        height: 30 // Standard height
      }));
  }, [blockSelectionsUserInput]);

  const towerPalettesForViz = useMemo((): [TowerColorPaletteData | null, TowerColorPaletteData | null] | undefined => {
    if (!selectedPalettesFullInfoForSlider[0] || !selectedPalettesFullInfoForSlider[1]) {
      return undefined; // Or two nulls: [null, null] if TowerVisualizer expects that for no selection
    }
    return [
      selectedPalettesFullInfoForSlider[0] ? {
        id: selectedPalettesFullInfoForSlider[0].id.toString(),
        primaryColor: selectedPalettesFullInfoForSlider[0].primaryHighlightColor || selectedPalettesFullInfoForSlider[0].baseGradientStyle.split(', ')[1] || 'rgba(0,0,0,0.1)' // Heuristic
      } : null,
      selectedPalettesFullInfoForSlider[1] ? {
        id: selectedPalettesFullInfoForSlider[1].id.toString(),
        primaryColor: selectedPalettesFullInfoForSlider[1].primaryHighlightColor || selectedPalettesFullInfoForSlider[1].baseGradientStyle.split(', ')[1] || 'rgba(0,0,0,0.1)' // Heuristic
      } : null,
    ];
  }, [selectedPalettesFullInfoForSlider]);
  // --- End Data Preparation ---

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
          Your primary profile is: <strong>{primaryType ? TYPE_NAMES[primaryType.toString()] : "N/A"}</strong>.
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

        <TowerVisualizer
          foundationStones={foundationStonesForViz}
          buildingBlocks={buildingBlocksForViz}
          selectedPalettes={towerPalettesForViz}
          colorDistribution={colorPaletteDistribution as TowerColorDistribution | null | undefined} // Cast as it might be null from store
        />
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
