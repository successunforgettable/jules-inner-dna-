import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ColorPaletteCard, { ColorPaletteCardProps } from './ColorPaletteCard';

// Mock CheckmarkIcon
vi.mock('../../assets/icons/CheckmarkIcon', () => ({
  default: () => <div data-testid="mock-checkmark-icon" />,
}));

// Assuming global mock from test-setup.ts handles basic motion.div rendering for framer-motion

describe('ColorPaletteCard Component', () => {
  const mockOnSelect = vi.fn();
  const defaultProps: ColorPaletteCardProps = {
    id: 'palette1',
    stateName: 'Peak Performance',
    description: 'Operating at your best.',
    gradientStyle: 'linear-gradient(to right, #10b981, #a7f3d0)',
    isSelected: false,
    onSelect: mockOnSelect,
    isDisabled: false,
    sizeContext: 'desktop',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders state name, description, and applies gradient style', () => {
    render(<ColorPaletteCard {...defaultProps} />);
    expect(screen.getByText('Peak Performance')).toBeInTheDocument();
    expect(screen.getByText('Operating at your best.')).toBeInTheDocument();
    const cardElement = screen.getByRole('button');
    expect(cardElement).toHaveStyle({ background: defaultProps.gradientStyle });
  });

  it('applies selected styles and shows checkmark when isSelected is true', () => {
    render(<ColorPaletteCard {...defaultProps} isSelected={true} />);
    expect(screen.getByRole('button')).toHaveClass('selected');
    expect(screen.getByTestId('mock-checkmark-icon')).toBeInTheDocument();
  });

  it('applies disabled styles and prevents onSelect when isDisabled is true', () => {
    render(<ColorPaletteCard {...defaultProps} isDisabled={true} />);
    const cardElement = screen.getByRole('button');
    expect(cardElement).toHaveClass('disabled');
    expect(cardElement).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(cardElement);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect with its id on click when not disabled', () => {
    render(<ColorPaletteCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.id);
  });
});
