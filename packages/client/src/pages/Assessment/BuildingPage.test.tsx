import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BuildingBlocksPage from './BuildingBlocksPage'; // The component to test
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import * as buildingBlockData from '../../lib/buildingBlockData'; // To mock getBlockPairsForType

// Mock child components
vi.mock('../../components/building/BlockPair', () => ({
  default: ({ pairData, onBlockSelect, selectedBlockIdInPair, isDisabled }) => (
    <div data-testid={`mock-blockpair-${pairData.pairId}`}>
      <p>{pairData.questionText}</p>
      {pairData.blocks.map((block, index) => (
        <button
          key={block.id}
          data-testid={`block-${block.id}`}
          onClick={() => onBlockSelect(pairData.pairId, block, index)} // Pass pairId, blockData, blockIndex
          data-selected={selectedBlockIdInPair === block.id}
          disabled={isDisabled || (selectedBlockIdInPair !== null && selectedBlockIdInPair !== block.id)}
        >
          {block.content}
        </button>
      ))}
    </div>
  ),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock the data fetching function
vi.mock('../../lib/buildingBlockData');

describe('BuildingBlocksPage Integration Tests', () => {
  const mockCoreType = "1";
  const mockBlockPairsData = [ // Simplified mock data for 4 pairs
    { pairId: "type1_wing_pair", questionText: "Wing Question?", pairType: 'wing', blocks: [{ id: 'w1', content: 'Wing A', associatedWingValue: 9 }, { id: 'w2', content: 'Wing B', associatedWingValue: 2 }] },
    { pairId: "type1_arrow_pair", questionText: "Arrow Question?", pairType: 'arrow', blocks: [{ id: 'a1', content: 'Arrow A (Int)' }, { id: 'a2', content: 'Arrow B (Dis)' }] },
    { pairId: "generic_growth_focus", questionText: "Growth Question?", pairType: 'growth_focus', blocks: [{ id: 'g1', content: 'Growth A' }, { id: 'g2', content: 'Growth B' }] },
    { pairId: "generic_response_pattern", questionText: "Response Question?", pairType: 'response_pattern', blocks: [{ id: 'r1', content: 'Response A' }, { id: 'r2', content: 'Response B' }] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store
    useAssessmentStore.setState({
      ...useAssessmentStore.getState().initialState, // Use actual initial state from store
      typeCalculation: { primaryType: mockCoreType, confidence: 0.8, alternatives: [], allScores: {}, rawScores: {} as any }, // Set primary type
      blockSelectionsUserInput: Array(4).fill(null), // Reset block selections
      currentBlockPairIndex: 0,
      wingCalculation: null,
      arrowCalculation: null,
    }, true);

    (buildingBlockData.getBlockPairsForType as vi.Mock).mockReturnValue(mockBlockPairsData);

    // Spy on store actions
    vi.spyOn(useAssessmentStore.getState(), 'setBlockSelection');
    vi.spyOn(useAssessmentStore.getState(), 'goToNextBlockPair');
    // Wing/Arrow calculations are triggered internally by setBlockSelection, so we'll check their results in the store
  });

  it('renders the first block pair and allows selection, updating the store', async () => {
    render(
      <MemoryRouter><BuildingBlocksPage /></MemoryRouter>
    );

    expect(screen.getByText(`Type ${mockCoreType}`)).toBeInTheDocument(); // Check core type display
    expect(screen.getByText(mockBlockPairsData[0].questionText)).toBeInTheDocument();

    // Select the first block of the first pair
    const firstBlockButton = screen.getByTestId(`block-${mockBlockPairsData[0].blocks[0].id}`);
    fireEvent.click(firstBlockButton);

    await waitFor(() => {
      expect(useAssessmentStore.getState().setBlockSelection).toHaveBeenCalledWith(0, 0); // pairIndex 0, blockChoiceIndex 0
    });
    expect(useAssessmentStore.getState().blockSelectionsUserInput[0]).toBe(0);
  });

  it('navigates through pairs and triggers calculations on completion', async () => {
    render(
      <MemoryRouter initialEntries={['/assessment/building-blocks']}>
        <Routes>
          <Route path="/assessment/building-blocks" element={<BuildingBlocksPage />} />
          <Route path="/assessment/color-palette" element={<div>Color Palette Mock Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate selecting one block for each of the 4 pairs
    for (let i = 0; i < mockBlockPairsData.length; i++) {
      // Ensure the correct pair is displayed (store's currentBlockPairIndex should update)
      await screen.findByText(mockBlockPairsData[i].questionText);

      const blockToSelect = screen.getByTestId(`block-${mockBlockPairsData[i].blocks[0].id}`);
      fireEvent.click(blockToSelect);

      await waitFor(() => {
        expect(useAssessmentStore.getState().setBlockSelection).toHaveBeenCalledWith(i, 0);
      });

      if (i < mockBlockPairsData.length - 1) {
        const nextButton = screen.getByRole('button', { name: /Next Pair/i });
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(useAssessmentStore.getState().goToNextBlockPair).toHaveBeenCalledTimes(i + 1);
        });
      }
    }

    // After the 4th selection, wing/arrow calculations should be in the store
    await waitFor(() => {
      expect(useAssessmentStore.getState().wingCalculation).not.toBeNull();
      expect(useAssessmentStore.getState().arrowCalculation).not.toBeNull();
    });

    // Click "Continue to Color Palette"
    const continueButton = screen.getByRole('button', { name: /Continue to Color Palette/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/color-palette');
    });
  });
});
