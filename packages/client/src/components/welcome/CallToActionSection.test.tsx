import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CallToActionSection from './CallToActionSection';

// Mock the AuthButtons as they are simple wrappers and might have their own tests
// Or let them render if their styling/structure is part of what you want to test here.
vi.mock('../auth/AuthButtons', () => ({
  PrimaryButton: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={`mock-primary-button ${className || ''}`} {...props}>
      {children}
    </button>
  ),
  SecondaryButton: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={`mock-secondary-button ${className || ''}`} {...props}>
      {children}
    </button>
  ),
}));


describe('CallToActionSection', () => {
  it('renders the primary and secondary buttons with correct text', () => {
    render(
      <CallToActionSection
        onBeginAssessmentClick={() => {}}
        onLoginClick={() => {}}
      />
    );

    expect(screen.getByText('Begin Your Assessment')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('calls onBeginAssessmentClick when "Begin Your Assessment" is clicked', () => {
    const handleBeginClick = vi.fn();
    render(
      <CallToActionSection
        onBeginAssessmentClick={handleBeginClick}
        onLoginClick={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Begin Your Assessment'));
    expect(handleBeginClick).toHaveBeenCalledTimes(1);
  });

  it('calls onLoginClick when "Login" is clicked', () => {
    const handleLoginClick = vi.fn();
    render(
      <CallToActionSection
        onBeginAssessmentClick={() => {}}
        onLoginClick={handleLoginClick}
      />
    );
    fireEvent.click(screen.getByText('Login'));
    expect(handleLoginClick).toHaveBeenCalledTimes(1);
  });

  it('renders the "Learn More" link', () => {
    render(
      <CallToActionSection
        onBeginAssessmentClick={() => {}}
        onLoginClick={() => {}}
      />
    );
    const learnMoreLink = screen.getByText('Learn More');
    expect(learnMoreLink).toBeInTheDocument();
    expect(learnMoreLink.closest('a')).toHaveAttribute('href', '#feature-highlights-section');
  });
});
