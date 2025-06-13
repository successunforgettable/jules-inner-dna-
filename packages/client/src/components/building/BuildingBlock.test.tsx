import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BuildingBlock, { BuildingBlockProps } from './BuildingBlock';

// Mock framer-motion as per setupTests.ts or here if specific overrides needed
// Assuming global mock from test-setup.ts handles basic motion.div rendering

describe('BuildingBlock Component', () => {
  const mockOnSelect = vi.fn();
  const defaultProps: BuildingBlockProps = {
    id: 'bb1',
    content: 'Test Block Content',
    isSelected: false,
    onSelect: mockOnSelect,
    gradientStyle: 'linear-gradient(to right, green, yellow)',
    textureVariation: 'texture-lines',
    sizeContext: 'desktop',
    ariaLabel: 'Test Block Aria Label',
    isDisabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders content, applies gradient, and texture class', () => {
    render(<BuildingBlock {...defaultProps} />);
    expect(screen.getByText('Test Block Content')).toBeInTheDocument();
    const blockElement = screen.getByRole('button');
    expect(blockElement).toHaveStyle({ background: defaultProps.gradientStyle });
    expect(blockElement).toHaveClass(defaultProps.textureVariation!);
  });

  it('applies selected styles when isSelected is true', () => {
    render(<BuildingBlock {...defaultProps} isSelected={true} />);
    expect(screen.getByRole('button')).toHaveClass('selected');
    // Add more specific assertions for "glow" or "color intensification" if they result in specific CSS changes
  });

  it('applies disabled styles and prevents onSelect when isDisabled is true', () => {
    render(<BuildingBlock {...defaultProps} isDisabled={true} />);
    const blockElement = screen.getByRole('button');
    expect(blockElement).toHaveClass('disabled');
    expect(blockElement).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(blockElement);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect with its id on click when not disabled', () => {
    render(<BuildingBlock {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.id);
  });

  it('sets ARIA attributes correctly', () => {
    render(<BuildingBlock {...defaultProps} isSelected={true} />);
    const blockElement = screen.getByRole('button');
    expect(blockElement).toHaveAttribute('aria-pressed', 'true');
    expect(blockElement).toHaveAttribute('aria-label', defaultProps.ariaLabel);
  });
});
