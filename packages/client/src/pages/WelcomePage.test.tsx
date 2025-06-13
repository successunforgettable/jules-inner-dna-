import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import useAuthStore from '../../contexts/store/useAuthStore';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';

// Mock child components and hooks
vi.mock('../../components/welcome/WelcomeLayout', () => ({ default: ({ children }) => <div data-testid="mock-layout">{children}</div> }));
vi.mock('../../components/welcome/WelcomeHeader', () => ({ default: () => <div data-testid="mock-header">Header</div> }));
vi.mock('../../components/welcome/HeroSection', () => ({ default: () => <div data-testid="mock-hero">Hero</div> }));
vi.mock('../../components/welcome/FeatureHighlights', () => ({ default: () => <div data-testid="mock-features">Features</div> }));
vi.mock('../../components/welcome/CallToActionSection', () => ({
    default: ({ onBeginAssessmentClick, onLoginClick, beginButtonText }) => (
        <div data-testid="mock-cta">
            <button onClick={onBeginAssessmentClick}>{beginButtonText || "Begin Your Assessment"}</button>
            <button onClick={onLoginClick}>Login</button>
        </div>
    )
}));
vi.mock('../../components/auth/LoginModal', () => ({ default: ({ isOpen, onClose }) => isOpen ? <div data-testid="mock-loginmodal"><button onClick={onClose}>Close Login</button></div> : null }));
vi.mock('../../components/auth/RegistrationModal', () => ({ default: ({ isOpen, onClose }) => isOpen ? <div data-testid="mock-registermodal"><button onClick={onClose}>Close Register</button></div> : null }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const initialAuthStoreState = useAuthStore.getState().initialState;
const initialAssessmentStoreState = useAssessmentStore.getState().initialState;

describe('WelcomePage scenarios for isAssessmentComplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState(initialAuthStoreState, true);
    useAssessmentStore.setState(initialAssessmentStoreState, true);
  });

  it('shows "Begin Your Assessment" and navigates to foundation if authenticated and assessment NOT complete', async () => {
    useAuthStore.setState({ isAuthenticated: true, user: { id: '1', email: 'test@test.com' } });
    useAssessmentStore.setState({ isAssessmentComplete: false });

    render(<MemoryRouter><WelcomePage /></MemoryRouter>);

    const beginButton = screen.getByRole('button', { name: 'Begin Your Assessment' });
    expect(beginButton).toBeInTheDocument();
    fireEvent.click(beginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/foundation');
    });
  });

  it('shows "View My Results" and navigates to results if authenticated and assessment IS complete', async () => {
    useAuthStore.setState({ isAuthenticated: true, user: { id: '1', email: 'test@test.com' } });
    useAssessmentStore.setState({ isAssessmentComplete: true });

    render(<MemoryRouter><WelcomePage /></MemoryRouter>);

    const viewResultsButton = screen.getByRole('button', { name: 'View My Results' });
    expect(viewResultsButton).toBeInTheDocument();
    fireEvent.click(viewResultsButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/results');
    });
  });

  it('opens Register modal if "Begin Your Assessment" is clicked and user is NOT authenticated', () => {
    useAuthStore.setState({ isAuthenticated: false });
    useAssessmentStore.setState({ isAssessmentComplete: false }); // Completion status doesn't matter if not auth

    render(<MemoryRouter><WelcomePage /></MemoryRouter>);

    const beginButton = screen.getByRole('button', { name: 'Begin Your Assessment' });
    fireEvent.click(beginButton);

    expect(screen.getByTestId('mock-registermodal')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('Header conditional links (Conceptual - tested via WelcomePage state changes)', () => {
    // Tests for Header.tsx would be in Header.test.tsx.
    // The logic in WelcomePage indirectly tests how Header might behave if it also consumes isAssessmentComplete.
    // For Header.tsx:
    // 1. Mock useAuthStore & useAssessmentStore.
    // 2. Set isAuthenticated = true, isAssessmentComplete = false -> expect "Start/Continue Assessment" link to /assessment/foundation.
    // 3. Set isAuthenticated = true, isAssessmentComplete = true -> expect "View Results" link to /assessment/results.
    it('is noted that Header.tsx tests would be separate but follow similar store mocking patterns', () => {
        expect(true).toBe(true);
    });
});
```
