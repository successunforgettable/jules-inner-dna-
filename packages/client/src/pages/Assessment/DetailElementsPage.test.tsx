import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetailElementsPage from './DetailElementsPage';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import * as detailElementData from '../../lib/detailElementData'; // To mock

// Mock child components
vi.mock('../../components/detail/TokenPool', () => ({
  default: ({ availableTokenCount, totalTokens }) => (
    <div data-testid="mock-tokenpool">
      Available: {availableTokenCount}/{totalTokens}
    </div>
  ),
}));

vi.mock('../../components/detail/SubtypeContainer', () => ({
  default: ({ id, title, placedTokensCount, onContainerClick, onTokenClickInContainer }) => (
    <div data-testid={`mock-subtypecontainer-${id}`}>
      <h3>{title}</h3>
      <p>Placed: {placedTokensCount}</p>
      <button data-testid={`add-to-${id}`} onClick={() => onContainerClick && onContainerClick(id as any)}>Add</button>
      {/* Simulate one token that can be clicked to remove */}
      {placedTokensCount > 0 && (
        <button data-testid={`remove-from-${id}`} onClick={() => onTokenClickInContainer && onTokenClickInContainer(id as any, 0)}>Remove Visual Token</button>
      )}
    </div>
  ),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock data functions
vi.spyOn(detailElementData, 'getTypeSpecificContainerData').mockImplementation((baseInfo, _) => ({
  ...baseInfo, // Use generic description from baseInfo for tests
  description: baseInfo.genericDescription,
}));
vi.spyOn(detailElementData, 'getTokenGradientForType').mockReturnValue('linear-gradient(to right, purple, pink)');


describe('DetailElementsPage Integration Tests', () => {
  const mockPrimaryType = "1";

  beforeEach(() => {
    vi.clearAllMocks();
    useAssessmentStore.setState({
      ...useAssessmentStore.getState().initialState,
      typeCalculation: { primaryType: mockPrimaryType, confidence: 0.8, alternatives: [], allScores: {}, rawScores: {} as any },
      tokenDistribution: { self: 0, oneToOne: 0, social: 0 },
      placedTokensCount: 0,
      subtypeStackResult: null,
    }, true);

    vi.spyOn(useAssessmentStore.getState(), 'setTokenInContainer');
    // subtypeStackResult is set internally by the store
  });

  it('renders initial state with 0 tokens placed', () => {
    render(<MemoryRouter><DetailElementsPage /></MemoryRouter>);
    expect(screen.getByText(/Distribute Your Instinctual Energy/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-tokenpool')).toHaveTextContent('Available: 10/10');
    expect(screen.getByTestId('mock-subtypecontainer-self')).toHaveTextContent('Placed: 0');
  });

  it('allows adding a token to a container, updating store and UI', async () => {
    render(<MemoryRouter><DetailElementsPage /></MemoryRouter>);

    fireEvent.click(screen.getByTestId('add-to-self'));

    await waitFor(() => {
      expect(useAssessmentStore.getState().setTokenInContainer).toHaveBeenCalledWith('self', 'add');
    });
    // Simulate store update that would trigger re-render
    useAssessmentStore.setState({ tokenDistribution: { self: 1, oneToOne: 0, social: 0 }, placedTokensCount: 1 });

    render(<MemoryRouter><DetailElementsPage /></MemoryRouter>); // Re-render to reflect store change
    expect(screen.getByTestId('mock-tokenpool')).toHaveTextContent('Available: 9/10');
    expect(screen.getByTestId('mock-subtypecontainer-self')).toHaveTextContent('Placed: 1');
  });

  it('allows removing a token from a container, updating store and UI', async () => {
    // Pre-fill a token
    useAssessmentStore.setState({ tokenDistribution: { self: 1, oneToOne: 0, social: 0 }, placedTokensCount: 1 });
    render(<MemoryRouter><DetailElementsPage /></MemoryRouter>);

    expect(screen.getByTestId('mock-subtypecontainer-self')).toHaveTextContent('Placed: 1');
    fireEvent.click(screen.getByTestId('remove-from-self'));

    await waitFor(() => {
      expect(useAssessmentStore.getState().setTokenInContainer).toHaveBeenCalledWith('self', 'remove');
    });
    // Simulate store update
    useAssessmentStore.setState({ tokenDistribution: { self: 0, oneToOne: 0, social: 0 }, placedTokensCount: 0 });

    render(<MemoryRouter><DetailElementsPage /></MemoryRouter>); // Re-render
    expect(screen.getByTestId('mock-tokenpool')).toHaveTextContent('Available: 10/10');
    expect(screen.getByTestId('mock-subtypecontainer-self')).toHaveTextContent('Placed: 0');
  });

  it('triggers subtypeStackResult calculation and enables Continue button when 10 tokens are placed', async () => {
    render(
      <MemoryRouter initialEntries={['/assessment/detail-elements']}>
        <Routes>
          <Route path="/assessment/detail-elements" element={<DetailElementsPage />} />
          <Route path="/assessment/results" element={<div>Results Mock Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate distributing 10 tokens (e.g., 4,3,3) by calling the store action directly for simplicity
    // This bypasses multiple click events for the test but tests the consequence.
    act(() => {
      useAssessmentStore.getState().setTokenInContainer('self', 'add'); // 1
      useAssessmentStore.getState().setTokenInContainer('self', 'add'); // 2
      useAssessmentStore.getState().setTokenInContainer('self', 'add'); // 3
      useAssessmentStore.getState().setTokenInContainer('self', 'add'); // 4
      useAssessmentStore.getState().setTokenInContainer('oneToOne', 'add'); // 1
      useAssessmentStore.getState().setTokenInContainer('oneToOne', 'add'); // 2
      useAssessmentStore.getState().setTokenInContainer('oneToOne', 'add'); // 3
      useAssessmentStore.getState().setTokenInContainer('social', 'add');   // 1
      useAssessmentStore.getState().setTokenInContainer('social', 'add');   // 2
      useAssessmentStore.getState().setTokenInContainer('social', 'add');   // 3 -> total 10
    });

    // Check if subtypeStackResult is populated in the store
    await waitFor(() => {
      expect(useAssessmentStore.getState().subtypeStackResult).not.toBeNull();
    });
    expect(useAssessmentStore.getState().subtypeStackResult?.stackType).toBeDefined();

    // Check if Continue button is enabled and navigates
    const continueButton = screen.getByRole('button', { name: /View Your Results/i });
    expect(continueButton).not.toBeDisabled();
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/results');
    });
  });
});

// Helper for act if not globally available with @testing-library/react >=13
// For Vitest, you might not need 'act' explicitly as much as with Jest for store updates if rendering is simple.
// However, for complex state changes leading to UI updates, 'act' can be important.
// For this example, we'll assume RTL's auto-wrapping or direct store state checks are sufficient.
// If not, import { act } from 'react'; or from '@testing-library/react';
import { act } from '@testing-library/react'; // Added for direct store manipulation in test
```
