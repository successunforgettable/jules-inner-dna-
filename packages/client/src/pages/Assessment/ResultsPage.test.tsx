import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResultsPage from './ResultsPage';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import { // Import necessary types for mock state
  PersonalityTypeCalculation, WingCalculation, ArrowCalculation,
  StateAnalysis, SubtypeStack, TokenDistribution, FoundationSelectionsState,
  BlockSelectionsUserInputState, ColorPaletteSelectionsState, DistributionObject
} from '../../contexts/store/useAssessmentStore';
import * as colorPaletteData from '../../lib/colorPaletteData'; // To get actual palette data

// Mock child components that are complex or heavily reliant on props
vi.mock('../../components/results/FinalTowerDisplay', () => ({
  default: () => <div data-testid="mock-finaltowerdisplay">Final Tower</div>,
}));
vi.mock('../../components/results/ScoreBarDisplay', () => ({
  default: ({ scores, primaryType }) => (
    <div data-testid="mock-scorebardisplay">
      Primary: {primaryType}, Score Count: {Object.keys(scores).length}
    </div>
  ),
}));
vi.mock('../../components/results/StateDistributionDisplay', () => ({
  default: ({ distribution }) => (
    <div data-testid="mock-statedistributiondisplay">
      {distribution.primaryStateName}: {distribution.primaryPercentage}%
    </div>
  ),
}));

// Mock placeholder icons (as done in ResultsPage.tsx itself for simplicity)
const IconPlaceholder: React.FC<{ name: string }> = ({ name }) => <div data-testid={`icon-${name.toLowerCase()}`}>{name} Icon</div>;
vi.mock('../../assets/icons/report/IconExecutiveSummary', () => ({ default: () => <IconPlaceholder name="Summary"/> }));
vi.mock('../../assets/icons/report/IconCoreType', () => ({ default: () => <IconPlaceholder name="Core"/> }));
vi.mock('../../assets/icons/report/IconWing', () => ({ default: () => <IconPlaceholder name="Wing"/> }));
vi.mock('../../assets/icons/report/IconArrows', () => ({ default: () => <IconPlaceholder name="Arrows"/> }));
vi.mock('../../assets/icons/report/IconStates', () => ({ default: () => <IconPlaceholder name="States"/> }));
vi.mock('../../assets/icons/report/IconSubtype', () => ({ default: () => <IconPlaceholder name="Subtype"/> }));
vi.mock('../../assets/icons/report/IconGrowthPlan', () => ({ default: () => <IconPlaceholder name="Growth"/> }));
vi.mock('../../assets/icons/report/IconRelationships', () => ({ default: () => <IconPlaceholder name="Relations"/> }));


// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockInitialState = useAssessmentStore.getState().initialState;
const mockFullStoreState = {
  ...mockInitialState,
  typeCalculation: { primaryType: "1", confidence: 0.8, alternatives: ["2","9"], allScores: {"1":0.5, "2":0.2, "9":0.15}, rawScores: {type1:10} } as PersonalityTypeCalculation,
  wingCalculation: { primaryWing: "1w9", wingStrength: 'strong', confidence: 0.9 } as WingCalculation,
  arrowCalculation: { integrationType: "7", disintegrationType: "4", integrationStrength: 'conscious', disintegrationStrength: 'developing', confidence: 0.85 } as ArrowCalculation,
  colorPaletteSelections: { ids: ["state_good", "state_average"], indices: [1,2] } as ColorPaletteSelectionsState,
  colorPaletteDistribution: { primaryPercentage: 60, secondaryPercentage: 40 } as DistributionObject,
  stateAnalysisResult: {
      primaryState: "Good (Engaged)", secondaryState: "Average (Partially Activated)",
      distribution: { primaryPercentage: 60, secondaryPercentage: 40 },
      blendedDescription: "A dynamic mix of engaged focus and balanced reflection.",
      overallActivation: 62, // (70*0.6) + (50*0.4) = 42 + 20 = 62
      insights: ["Insight A", "Insight B"], recommendations: ["Recommendation X", "Recommendation Y"]
  } as StateAnalysis,
  subtypeStackResult: {
      primary: 'self', secondary: 'oneToOne', tertiary: 'social',
      dominance: { self: 50, oneToOne: 30, social: 20 },
      stackType: 'dominant', stackDescription: "Primary focus on self-preservation.", confidence: 0.75,
      rawDistribution: { self: 5, oneToOne: 3, social: 2 }
  } as SubtypeStack,
  isAssessmentComplete: true, // Important for this page
};

describe('ResultsPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssessmentStore.setState(mockFullStoreState, true);
    vi.spyOn(useAssessmentStore.getState(), 'resetAssessment');
    vi.spyOn(console, 'log'); // Spy on console.log for download button
  });

  it('renders all report sections with data from the store', () => {
    render(<MemoryRouter><ResultsPage /></MemoryRouter>);

    expect(screen.getByTestId('mock-finaltowerdisplay')).toBeInTheDocument();

    // Check for section titles
    expect(screen.getByText('Executive Summary')).toBeInTheDocument();
    expect(screen.getByText('Core Type: Enneagram 1')).toBeInTheDocument();
    expect(screen.getByText('Wing: 1w9')).toBeInTheDocument();
    expect(screen.getByText('Arrows: Integration & Disintegration')).toBeInTheDocument();
    expect(screen.getByText('Operating States & Activation')).toBeInTheDocument();
    expect(screen.getByText('Instinctual Variant Stack')).toBeInTheDocument();
    expect(screen.getByText('Personalized Growth Plan')).toBeInTheDocument();
    expect(screen.getByText('Relationship Insights')).toBeInTheDocument();

    // Check some dynamic data points
    expect(screen.getByText(/core personality type is identified as Type 1/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-scorebardisplay')).toHaveTextContent('Primary: 1');
    expect(screen.getByTestId('mock-statedistributiondisplay')).toHaveTextContent('Good (Engaged): 60%');
    expect(screen.getByText(/Primary: self \(50%\)/i)).toBeInTheDocument();
  });

  it('handles "Download Report" button click', () => {
    render(<MemoryRouter><ResultsPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Download Report/i }));
    expect(console.log).toHaveBeenCalledWith("Download Report Triggered. Profile Data:", expect.any(String));
  });

  it('handles "Start New Assessment" button click', async () => {
    render(<MemoryRouter><ResultsPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Start New Assessment/i }));

    await waitFor(() => {
      expect(useAssessmentStore.getState().resetAssessment).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/foundation');
    });
  });

  it('displays "Assessment Data Incomplete" if essential data is missing', () => {
    useAssessmentStore.setState({ ...mockInitialState, typeCalculation: null }, true); // Missing core type
    render(<MemoryRouter><ResultsPage /></MemoryRouter>);
    expect(screen.getByText('Assessment Data Incomplete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Assessment Start/i })).toBeInTheDocument();
  });
});
```
