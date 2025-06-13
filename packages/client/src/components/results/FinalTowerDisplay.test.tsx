import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FinalTowerDisplay from './FinalTowerDisplay';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import { // Import necessary types for mock state
  PersonalityTypeCalculation, WingCalculation, ArrowCalculation,
  StateAnalysis, SubtypeStack, TokenDistribution, FoundationSelectionsState,
  BlockSelectionsUserInputState, ColorPaletteSelectionsState, DistributionObject
} from '../../contexts/store/useAssessmentStore'; // Path might be direct to types if they were separated

// Mock data functions that FinalTowerDisplay might internally use if it re-fetches or processes
vi.mock('../../lib/personalityData', () => ({ allStoneData: Array(9).fill({ stones: [{gradientStyle: 'grey'},{gradientStyle: 'grey'},{gradientStyle: 'grey'}]}) }));
vi.mock('../../lib/buildingBlockData', () => ({ getBlockPairsForType: () => Array(4).fill({blocks: [{textureVariation: 'none'},{textureVariation: 'none'}]}) }));
vi.mock('../../lib/colorPaletteData', () => ({ availablePalettesData: Array(5).fill({id: 's0', primaryColor: 'grey'}) }));
vi.mock('../../lib/detailElementData', () => ({ getTokenGradientForType: () => 'grey' }));


const mockInitialState = useAssessmentStore.getState().initialState;

describe('FinalTowerDisplay Component', () => {
  const mockFullStoreState = {
    ...mockInitialState,
    typeCalculation: { primaryType: "1", confidence: 0.8, alternatives: ["2","9"], allScores: {"1":0.5}, rawScores: {type1:10} } as PersonalityTypeCalculation,
    wingCalculation: { primaryWing: "1w9", wingStrength: 'strong', confidence: 0.9 } as WingCalculation,
    arrowCalculation: { integrationType: "7", disintegrationType: "4", integrationStrength: 'conscious', disintegrationStrength: 'developing', confidence: 0.85 } as ArrowCalculation,
    colorPaletteSelections: { ids: ["state_good", "state_average"], indices: [1,2] } as ColorPaletteSelectionsState,
    colorPaletteDistribution: { primaryPercentage: 60, secondaryPercentage: 40 } as DistributionObject,
    stateAnalysisResult: {
        primaryState: "Good (Engaged)", secondaryState: "Average (Partially Activated)",
        distribution: { primaryPercentage: 60, secondaryPercentage: 40 },
        blendedDescription: "A mix of good and average states.",
        overallActivation: 65, insights: ["Insight 1"], recommendations: ["Rec 1"]
    } as StateAnalysis,
    tokenDistribution: { self: 5, oneToOne: 3, social: 2 } as TokenDistribution,
    subtypeStackResult: {
        primary: 'self', secondary: 'oneToOne', tertiary: 'social',
        dominance: { self: 50, oneToOne: 30, social: 20 },
        stackType: 'dominant', stackDescription: "Self dominant stack.", confidence: 0.75,
        rawDistribution: { self: 5, oneToOne: 3, social: 2 }
    } as SubtypeStack,
    foundationSelections: [0,0,0,0,0,0,0,0,0] as FoundationSelectionsState,
    blockSelectionsUserInput: [0,0,0,0] as BlockSelectionsUserInputState,
  };

  beforeEach(() => {
    useAssessmentStore.setState(mockFullStoreState, true);
  });

  it('renders an SVG element', () => {
    render(<FinalTowerDisplay />);
    const svgElement = screen.getByLabelText('Your Personality Tower').closest('svg'); // Title is inside SVG
    expect(svgElement).toBeInTheDocument();
  });

  it('renders foundation, building blocks, and details layers (conceptual check)', () => {
    render(<FinalTowerDisplay />);
    // These are conceptual checks; actual SVG structure might be more complex.
    // We check for the group IDs.
    const svgElement = screen.getByLabelText('Your Personality Tower').closest('svg');
    expect(svgElement?.querySelector('#foundation-layer')).toBeInTheDocument();
    expect(svgElement?.querySelector('#building-blocks-layer')).toBeInTheDocument();
    expect(svgElement?.querySelector('#details-layer')).toBeInTheDocument();
  });

  it('displays the blended state description from stateAnalysisResult', () => {
    render(<FinalTowerDisplay />);
    expect(screen.getByText("Your Tower's Essence")).toBeInTheDocument();
    expect(screen.getByText(mockFullStoreState.stateAnalysisResult.blendedDescription)).toBeInTheDocument();
  });

  it('renders correct number of foundation stone segments (9)', () => {
    render(<FinalTowerDisplay />);
    const foundationLayer = screen.getByLabelText('Your Personality Tower').closest('svg')?.querySelector('#foundation-layer');
    // Each segment is a path, plus one circle for the base
    expect(foundationLayer?.querySelectorAll('path').length).toBe(9);
  });

  it('renders correct number of building block rectangles (4)', () => {
    render(<FinalTowerDisplay />);
    const blocksLayer = screen.getByLabelText('Your Personality Tower').closest('svg')?.querySelector('#building-blocks-layer');
    // Each block is a rect, plus one for texture overlay
    expect(blocksLayer?.querySelectorAll('rect').length).toBe(8); // 4 blocks + 4 texture overlays
  });

  it('renders detail accents based on subtype stack (conceptual count)', () => {
    // Primary (3) + Secondary (2) + Tertiary (1) = 6 accents
    render(<FinalTowerDisplay />);
    const detailsLayer = screen.getByLabelText('Your Personality Tower').closest('svg')?.querySelector('#details-layer');
    expect(detailsLayer?.querySelectorAll('circle').length).toBe(3 + 2 + 1);
  });

});
