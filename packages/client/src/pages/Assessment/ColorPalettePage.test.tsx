import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ColorPalettePage from './ColorPalettePage';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import * as colorPaletteData from '../../lib/colorPaletteData'; // To mock and spy

// Mock child components
vi.mock('../../components/color/PaletteSelector', () => ({
  default: ({ palettesData, onPaletteSelect, selectedPaletteIds }) => (
    <div data-testid="mock-paletteselector">
      {palettesData.map((palette, index) => (
        <button
          key={palette.id}
          data-testid={`palette-card-${palette.id}`}
          onClick={() => onPaletteSelect(palette.id)} // Assumes onPaletteSelect now takes id only
          data-selected={selectedPaletteIds.includes(palette.id)}
        >
          {palette.stateName}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/color/DistributionSlider', () => ({
  default: ({ onDistributionChange, distribution }) => (
    <div data-testid="mock-distributionslider">
      <input
        type="range"
        value={distribution}
        onChange={(e) => onDistributionChange(parseInt(e.target.value))}
        data-testid="distribution-slider-input"
      />
    </div>
  ),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Spy on getTypeSpecificPaletteData to ensure it's called, but use actual data for simplicity
// or provide a more controlled mock if its behavior is complex.
// For this test, we mostly care that the page uses it.
vi.spyOn(colorPaletteData, 'getTypeSpecificPaletteData');


describe('ColorPalettePage Integration Tests', () => {
  const mockPrimaryType = "1";

  beforeEach(() => {
    vi.clearAllMocks();
    useAssessmentStore.setState({
      ...useAssessmentStore.getState().initialState,
      typeCalculation: { primaryType: mockPrimaryType, confidence: 0.8, alternatives:[], allScores:{}, rawScores:{} as any },
      colorPaletteSelections: { ids: [], indices: [null, null] },
      colorPaletteDistribution: { primaryPercentage: 50, secondaryPercentage: 50 },
      stateAnalysisResult: null,
    }, true);

    // Spy on store actions
    vi.spyOn(useAssessmentStore.getState(), 'togglePaletteSelection');
    vi.spyOn(useAssessmentStore.getState(), 'setColorPaletteDistribution');
    // stateAnalysisResult is set internally by the store actions
  });

  it('renders palettes and allows selection of two palettes, updating the store', async () => {
    render(
      <MemoryRouter><ColorPalettePage /></MemoryRouter>
    );

    expect(screen.getByText(`Type ${mockPrimaryType}`)).toBeInTheDocument();
    expect(colorPaletteData.getTypeSpecificPaletteData).toHaveBeenCalled();

    const firstPaletteButton = screen.getByTestId(`palette-card-${colorPaletteData.availablePalettesData[0].id}`);
    const secondPaletteButton = screen.getByTestId(`palette-card-${colorPaletteData.availablePalettesData[1].id}`);

    fireEvent.click(firstPaletteButton);
    await waitFor(() => {
      expect(useAssessmentStore.getState().togglePaletteSelection).toHaveBeenCalledWith(
        colorPaletteData.availablePalettesData[0].id,
        0 // originalIndex
      );
    });
    expect(useAssessmentStore.getState().colorPaletteSelections.ids).toContain(colorPaletteData.availablePalettesData[0].id);

    fireEvent.click(secondPaletteButton);
    await waitFor(() => {
      expect(useAssessmentStore.getState().togglePaletteSelection).toHaveBeenCalledWith(
        colorPaletteData.availablePalettesData[1].id,
        1 // originalIndex
      );
    });
    expect(useAssessmentStore.getState().colorPaletteSelections.ids.length).toBe(2);
    expect(useAssessmentStore.getState().colorPaletteSelections.ids).toEqual([
      colorPaletteData.availablePalettesData[0].id,
      colorPaletteData.availablePalettesData[1].id,
    ]);
  });

  it('shows DistributionSlider when two palettes are selected and updates distribution in store', async () => {
    // Pre-select two palettes in the store
    useAssessmentStore.setState({
      colorPaletteSelections: {
        ids: [colorPaletteData.availablePalettesData[0].id, colorPaletteData.availablePalettesData[1].id],
        indices: [0, 1],
      }
    });

    render(
      <MemoryRouter><ColorPalettePage /></MemoryRouter>
    );

    const sliderInput = screen.getByTestId('distribution-slider-input');
    expect(sliderInput).toBeInTheDocument();

    fireEvent.change(sliderInput, { target: { value: '70' } });

    await waitFor(() => {
      expect(useAssessmentStore.getState().setColorPaletteDistribution).toHaveBeenCalledWith({
        primaryPercentage: 70,
        secondaryPercentage: 30,
      });
    });
    expect(useAssessmentStore.getState().colorPaletteDistribution?.primaryPercentage).toBe(70);
  });

  it('triggers stateAnalysisResult calculation and enables Continue button', async () => {
    render(
      <MemoryRouter initialEntries={['/assessment/color-palette']}>
        <Routes>
          <Route path="/assessment/color-palette" element={<ColorPalettePage />} />
          <Route path="/assessment/detail-elements" element={<div>Detail Elements Mock Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate selecting two palettes
    fireEvent.click(screen.getByTestId(`palette-card-${colorPaletteData.availablePalettesData[0].id}`));
    fireEvent.click(screen.getByTestId(`palette-card-${colorPaletteData.availablePalettesData[1].id}`));

    // Distribution slider appears, simulate changing it (which also triggers calculation)
    await screen.findByTestId('distribution-slider-input'); // Wait for slider
    const sliderInput = screen.getByTestId('distribution-slider-input');
    fireEvent.change(sliderInput, { target: { value: '60' } });

    // Check if stateAnalysisResult is populated in the store
    await waitFor(() => {
      expect(useAssessmentStore.getState().stateAnalysisResult).not.toBeNull();
    });
    expect(useAssessmentStore.getState().stateAnalysisResult?.overallActivation).toBeGreaterThan(0); // Basic check

    // Check if Continue button is enabled and navigates
    const continueButton = screen.getByRole('button', { name: /Continue to Detail Elements/i });
    expect(continueButton).not.toBeDisabled();
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/detail-elements');
    });
  });
});
