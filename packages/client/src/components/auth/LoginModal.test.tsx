import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoginModal from './LoginModal';
import useAuthStore from '../../contexts/store/useAuthStore'; // We'll spy on its actions
import api from '../../services/api'; // To mock axios post calls

// Mock the api service (axios instance)
vi.mock('../../services/api');

// Mock child components if they are complex or not relevant to this specific test
vi.mock('../common/Modal', () => ({
  default: ({ isOpen, onClose, title, children }) =>
    isOpen ? (
      <div data-testid="mock-modal" aria-label={title}>
        <button onClick={onClose} data-testid="mock-modal-close">Close</button>
        {children}
      </div>
    ) : null,
}));

vi.mock('../common/forms/Input', () => ({
  // Simplified mock for Input
  default: ({ label, value, onChange, error, name, type, disabled }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} disabled={disabled} />
      {error && <p role="alert">{error}</p>}
    </div>
  ),
}));


describe('LoginModal Integration Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnSwitchToRegister = vi.fn();
  const mockOnLoginSuccess = vi.fn(); // This prop is called from WelcomePage

  // Get original store actions to spy on them or call them if needed
  const originalLoginSuccess = useAuthStore.getState().loginSuccess;
  const originalSetLoading = useAuthStore.getState().setLoading;
  const originalSetError = useAuthStore.getState().setError;

  beforeEach(() => {
    // Reset mocks and store state before each test
    vi.clearAllMocks();
    // Reset Zustand store to initial state or a predefined test state
    useAuthStore.setState(useAuthStore.getState().initialState || {
      isAuthenticated: false, user: null, accessToken: null, error: null, isLoading: false
    });
    // Spy on store actions
    vi.spyOn(useAuthStore.getState(), 'loginSuccess');
    vi.spyOn(useAuthStore.getState(), 'setLoading');
    vi.spyOn(useAuthStore.getState(), 'setError');

    // Mock the prop that WelcomePage passes, which internally calls useAuthStore.loginSuccess
    mockOnLoginSuccess.mockImplementation(originalLoginSuccess);
  });

  afterEach(() => {
    // Restore original store methods if they were fully replaced, though spying is usually enough
    // For this example, we are spying on the original methods obtained via getState()
  });

  it('renders correctly when open', () => {
    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );
    expect(screen.getByLabelText('Login to Your Account')).toBeInTheDocument(); // Modal title
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockUserData = { id: '1', email: 'test@example.com', createdAt: new Date().toISOString() };
    const mockTokenData = { accessToken: 'fakeAccessToken', user: mockUserData };

    (api.post as vi.Mock).mockResolvedValueOnce({ data: mockTokenData });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess} // This will call the store's loginSuccess
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(useAuthStore.getState().setLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      // onLoginSuccess (prop) is called, which then calls the store's loginSuccess
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockTokenData);
      // Due to mockOnLoginSuccess calling originalLoginSuccess, the store state should update
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.email).toBe('test@example.com');
      expect(useAuthStore.getState().accessToken).toBe('fakeAccessToken');
      expect(useAuthStore.getState().isLoading).toBe(false); // Assuming loginSuccess sets loading to false
    });
  });

  it('displays client-side validation errors', async () => {
    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
    expect(useAuthStore.getState().setLoading).not.toHaveBeenCalledWith(true); // Should not proceed to loading
  });

  it('displays server error message on failed login', async () => {
    (api.post as vi.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSwitchToRegister={mockOnSwitchToRegister}
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(useAuthStore.getState().setLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(useAuthStore.getState().setError).toHaveBeenCalledWith('Invalid credentials');
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument(); // Error from store displayed
      expect(useAuthStore.getState().isLoading).toBe(false); // setLoading(false) called by setError
    });
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });
});
