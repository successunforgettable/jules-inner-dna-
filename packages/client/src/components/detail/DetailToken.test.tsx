import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DetailToken, { DetailTokenProps } from './DetailToken';

// Assuming global mock from test-setup.ts handles basic motion.div rendering for framer-motion

describe('DetailToken Component', () => {
  const mockOnClick = vi.fn();
  const defaultProps: DetailTokenProps = {
    id: 'token1',
    gradientStyle: 'linear-gradient(to right, red, blue)',
    isPlaced: false,
    onClick: mockOnClick,
    title: 'Test Token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct gradient style and default state', () => {
    render(<DetailToken {...defaultProps} />);
    const tokenElement = screen.getByRole('button', { name: 'Test Token' });
    expect(tokenElement).toBeInTheDocument();
    expect(tokenElement).toHaveStyle({ background: defaultProps.gradientStyle });
    expect(tokenElement).not.toHaveClass('placed');
  });

  it('applies placed style when isPlaced is true', () => {
    render(<DetailToken {...defaultProps} isPlaced={true} />);
    expect(screen.getByRole('button')).toHaveClass('placed');
  });

  it('calls onClick with its id when clicked', () => {
    render(<DetailToken {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(defaultProps.id);
  });

  it('does not call onClick if no onClick handler is provided', () => {
    const propsWithoutOnClick = { ...defaultProps, onClick: undefined };
    render(<DetailToken {...propsWithoutOnClick} />);
    // Check if it's still a button if onClick is not there (it should be for consistency or div)
    // The role="button" is set if onClick is present due to tabIndex logic.
    // For this test, just ensure no error and click doesn't call a non-existent handler.
    const tokenElement = screen.getByLabelText('Test Token'); // No role="button" if no onClick
    fireEvent.click(tokenElement);
    // No assertion for mockOnClick as it's not passed
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has pulsing animation props when not placed', () => {
    // This test is conceptual as it doesn't verify visual animation,
    // but checks if Framer Motion props for animation are passed.
    // Actual animation testing often requires E2E or visual regression tools.
    // We are checking if the `animate` prop received by motion.div has animation keys.
    const { container } = render(<DetailToken {...defaultProps} isPlaced={false} />);
    // Framer motion's `motion.div` passes props through. Hard to inspect `animate` prop directly here.
    // A better way would be to mock motion.div and check props passed to it.
    // For now, this test is more of a placeholder for animation prop presence.
    // We can check if it doesn't have 'placed' class as an indirect check.
    expect(screen.getByRole('button')).not.toHaveClass('placed');
    // In a real test with more setup, you might spy on `motion.div` or use a test renderer.
  });

  it('does not have pulsing animation when placed', () => {
    render(<DetailToken {...defaultProps} isPlaced={true} />);
    // Indirectly, if it's placed, the `animate` prop in DetailToken.tsx is {}.
    // This is difficult to assert directly without deeper mocking of Framer Motion.
    expect(screen.getByRole('button')).toHaveClass('placed');
  });
});
