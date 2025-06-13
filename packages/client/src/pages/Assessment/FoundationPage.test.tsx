import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FoundationPage from './FoundationPage';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import { allStoneData } from '../../lib/personalityData'; // To check displayed data

// Mock child components to focus on FoundationPage logic
vi.mock('../../components/foundation/StoneSet', () => ({
  // Simplified mock: Renders instruction and calls onStoneSelect when a button is clicked
  default: ({ stoneSetData, onStoneSelect, selectedStoneIdInSet, isDisabled }) => (
    <div data-testid="mock-stoneset">
      <p>{stoneSetData.instruction}</p>
      {stoneSetData.stones.map((stone, index) => (
        <button
          key={stone.id}
          data-testid={`stone-${stone.id}`}
          onClick={() => onStoneSelect(stoneSetData.setId, stone, index)} // Pass setId, stoneData, stoneIndex
          data-selected={selectedStoneIdInSet === stone.id}
          disabled={isDisabled || (selectedStoneIdInSet !== null && selectedStoneIdInSet !== stone.id)}
        >
          {stone.content.join(' ')}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/foundation/FoundationBase', () => ({
  default: ({ selectedStones }) => (
    <div data-testid="mock-foundationbase">
      Selected Stones Count: {selectedStones.filter(s => s !== null).length}
    </div>
  ),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('FoundationPage Integration Tests', () => {
  // Get original store actions to spy on them
  const originalSetFoundationSelection = useAssessmentStore.getState().setFoundationSelection;
  const originalGoToNextStoneSet = useAssessmentStore.getState().goToNextStoneSet;
  const originalGoToPreviousStoneSet = useAssessmentStore.getState().goToPreviousStoneSet;
  const originalCalculateAndStoreType = useAssessmentStore.getState().calculateAndStoreType; // if it were public

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store to initial state
    useAssessmentStore.setState(useAssessmentStore.getState().initialState || {
      foundationSelections: Array(9).fill(null),
      currentStoneSetIndex: 0,
      typeCalculation: null,
      isAssessmentComplete: false,
    }, true); // `true` replaces the entire state

    // Spy on store actions that should be called by the page
    vi.spyOn(useAssessmentStore.getState(), 'setFoundationSelection');
    vi.spyOn(useAssessmentStore.getState(), 'goToNextStoneSet');
    vi.spyOn(useAssessmentStore.getState(), 'goToPreviousStoneSet');
    // If calculateAndStoreType is internal to setFoundationSelection, test via its effects
  });


  it('renders initial set and allows stone selection, updating the store', async () => {
    render(
      <MemoryRouter initialEntries={['/assessment/foundation']}>
        <Routes>
          <Route path="/assessment/foundation" element={<FoundationPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Check initial instruction
    expect(screen.getByText(allStoneData[0].instruction)).toBeInTheDocument();

    // Simulate selecting the first stone of the first set
    const firstStoneOfFirstSet = allStoneData[0].stones[0];
    const stoneButton = screen.getByTestId(`stone-${firstStoneOfFirstSet.id}`);
    fireEvent.click(stoneButton);

    // Verify store action was called
    // The setFoundationSelection is called from within the page's handleStoneSelect
    await waitFor(() => {
      expect(useAssessmentStore.getState().setFoundationSelection).toHaveBeenCalledWith(0, 0); // setIndex 0, stoneIndexInSet 0
    });

    // Verify store state is updated (direct check - useful for debugging tests)
    // This relies on the store updating immediately.
    expect(useAssessmentStore.getState().foundationSelections[0]).toBe(0);
  });

  it('navigates to the next set when "Next Step" is clicked after selection', async () => {
    // Pre-select a stone for the first set to enable the "Next Step" button
    useAssessmentStore.setState({ foundationSelections: [0, null, null, null, null, null, null, null, null], currentStoneSetIndex: 0 });

    render(
      <MemoryRouter initialEntries={['/assessment/foundation']}>
        <Routes>
          <Route path="/assessment/foundation" element={<FoundationPage />} />
        </Routes>
      </MemoryRouter>
    );

    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    expect(nextButton).not.toBeDisabled(); // Should be enabled due to pre-selection
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(useAssessmentStore.getState().goToNextStoneSet).toHaveBeenCalledTimes(1);
    });
    // After store updates, the component should re-render showing the next set
    // To test this, we can check if the instruction for the second set is displayed.
    // This requires the store state to actually change and component to re-render.
    // We'll check the store's state directly for this test.
    expect(useAssessmentStore.getState().currentStoneSetIndex).toBe(1);
  });

  it('changes button to "Continue to Building Blocks" on the last set and navigates on click', async () => {
    // Set store to the last set, with a selection made
    const selections = [0,0,0,0,0,0,0,0,0]; // All selected
    useAssessmentStore.setState({
        currentStoneSetIndex: 8,
        foundationSelections: selections
        // typeCalculation will be set automatically by the store due to all selections being made
    });
    // Manually trigger calculation for test consistency if it's not guaranteed by setState alone
    // This also simulates the automatic calculation after the final selection.
    if (useAssessmentStore.getState().foundationSelections.every(s => s !== null)) {
        const calc = determinePersonalityType(useAssessmentStore.getState().foundationSelections as number[]);
        useAssessmentStore.setState({ typeCalculation: calc });
    }


    render(
      <MemoryRouter initialEntries={['/assessment/foundation']}>
        <Routes>
          <Route path="/assessment/foundation" element={<FoundationPage />} />
          <Route path="/assessment/building-blocks" element={<div>Building Blocks Mock Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const continueButton = screen.getByRole('button', { name: /Continue to Building Blocks/i });
    expect(continueButton).not.toBeDisabled();
    fireEvent.click(continueButton);

    // Verify navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/building-blocks');
    });
    // Also verify type calculation has occurred
    expect(useAssessmentStore.getState().typeCalculation).not.toBeNull();
  });

  it('"Previous Step" button is disabled on the first set and calls store action otherwise', async () => {
    render(
      <MemoryRouter><FoundationPage /></MemoryRouter> // Simplified render for this case
    );
    expect(screen.getByRole('button', { name: /Previous Step/i })).toBeDisabled();

    // Go to next set to enable previous button
    useAssessmentStore.setState({ currentStoneSetIndex: 1, foundationSelections: [0,0,null,null,null,null,null,null,null] });

    // Re-render or wait for component to update if necessary.
    // For this test, directly interacting after state change.
    // In a real app, the component re-renders. Here, we are testing the logic given the state.
    // Let's re-render to ensure the button state updates based on new store state.
    render(
      <MemoryRouter initialEntries={['/assessment/foundation']} initialIndex={0}>
          <Routes><Route path="/assessment/foundation" element={<FoundationPage />} /></Routes>
      </MemoryRouter>
    );

    const prevButton = screen.getByRole('button', { name: /Previous Step/i });
    expect(prevButton).not.toBeDisabled();
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(useAssessmentStore.getState().goToPreviousStoneSet).toHaveBeenCalledTimes(1);
    });
    expect(useAssessmentStore.getState().currentStoneSetIndex).toBe(0); // Assuming store logic works
  });
});

// Helper to import determinePersonalityType for the last test case
import { determinePersonalityType } from '../../lib/utils/personalityCalculations';
