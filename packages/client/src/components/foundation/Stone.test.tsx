import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Stone, { StoneProps } from './Stone';

// Mock CheckmarkIcon to simplify Stone tests
vi.mock('../../assets/icons/CheckmarkIcon', () => ({
  default: () => <div data-testid="mock-checkmark-icon" />,
}));

// Mock framer-motion as per setupTests.ts or here if specific overrides needed for Stone
// Assuming global mock from test-setup.ts handles basic motion.div rendering

describe('Stone Component', () => {
  const mockOnSelect = vi.fn();
  const defaultProps: StoneProps = {
    id: 's1',
    content: ['Test', 'Stone'],
    isSelected: false,
    onSelect: mockOnSelect,
    gradientStyle: 'linear-gradient(to right, red, blue)',
    sizeContext: 'desktop',
    ariaLabel: 'Test Stone Aria Label',
    isDisabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders basic content and applies gradient style', () => {
    render(<Stone {...defaultProps} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Stone')).toBeInTheDocument();
    const stoneElement = screen.getByRole('button');
    expect(stoneElement).toHaveStyle({ background: defaultProps.gradientStyle });
  });

  it('applies selected styles and shows checkmark when isSelected is true', () => {
    render(<Stone {...defaultProps} isSelected={true} />);
    expect(screen.getByRole('button')).toHaveClass('selected');
    expect(screen.getByTestId('mock-checkmark-icon')).toBeInTheDocument();
  });

  it('does not show checkmark when isSelected is false', () => {
    render(<Stone {...defaultProps} isSelected={false} />);
    expect(screen.queryByTestId('mock-checkmark-icon')).not.toBeInTheDocument();
  });

  it('applies disabled styles and prevents onSelect when isDisabled is true', () => {
    render(<Stone {...defaultProps} isDisabled={true} />);
    const stoneElement = screen.getByRole('button');
    expect(stoneElement).toHaveClass('disabled');
    expect(stoneElement).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(stoneElement);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect with its id on click when not disabled', () => {
    render(<Stone {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.id);
  });

  it('applies correct sizeContext class', () => {
    render(<Stone {...defaultProps} sizeContext="mobile" />);
    expect(screen.getByRole('button')).toHaveClass('mobile');
  });

  it('sets ARIA attributes correctly', () => {
    render(<Stone {...defaultProps} isSelected={true} />);
    const stoneElement = screen.getByRole('button');
    expect(stoneElement).toHaveAttribute('aria-pressed', 'true');
    expect(stoneElement).toHaveAttribute('aria-label', defaultProps.ariaLabel);
  });
});
