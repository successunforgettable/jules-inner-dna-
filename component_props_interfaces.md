```markdown
## Example Component Props Interfaces

Below are example props interfaces for key reusable components, `Stone` and `PrimaryButton`, derived from the design specifications in `attached_assets/corrected_personality_spec.md`. These interfaces are illustrative and would typically be defined in TypeScript.

### Stone Component Props Interface

The `Stone` component is a core interactive element in the Foundation Stone Experience (Section 2.2.1). It displays descriptive text and allows users to make selections.

```typescript
interface StoneProps {
  /**
   * Unique identifier for the stone.
   */
  id: string;

  /**
   * An array of strings, where each string is a line of text to be displayed on the stone.
   * Example: ["Trait A", "Trait B", "Trait C"]
   */
  content: string[];

  /**
   * Indicates whether the stone is currently selected.
   * Controls visual states like glow effect and checkmark icon.
   */
  isSelected: boolean;

  /**
   * Callback function invoked when the stone is clicked.
   * Passes the stone's `id` as an argument.
   */
  onSelect: (id: string) => void;

  /**
   * Defines the background gradient for the stone.
   * This can be a direct CSS gradient string or an object that a utility function can parse.
   * Example: "linear-gradient(to bottom right, #ff0000, #00ff00)" or { type: 'fire', angle: 45 }
   */
  gradientStyle: string | object; // Or a more specific type for gradient objects

  /**
   * Current display context, affecting text size and potentially layout within the stone.
   * Based on responsive design needs (e.g., text 16px desktop / 14px mobile).
   */
  sizeContext: 'desktop' | 'mobile';

  /**
   * ARIA label for accessibility, especially if content is not sufficiently descriptive
   * or for screen reader users to understand the element's purpose and state.
   * Example: "Foundation Stone: Courage, Resilience, Determination. Currently not selected."
   */
  ariaLabel: string;

  /**
   * If true, the stone is visually styled as disabled and the `onSelect` callback will not be triggered.
   * Optional, defaults to false.
   */
  isDisabled?: boolean;

  /**
   * Optional custom CSS class for additional styling.
   */
  className?: string;
}
```

### PrimaryButton Component Props Interface

The `PrimaryButton` component represents the main call-to-action buttons, such as "Begin Your Assessment" (Welcome Screen, Section 0.1.2) and various "Continue" or "Submit" buttons throughout the assessment. It's designed to be prominent.

```typescript
interface PrimaryButtonProps {
  /**
   * The text content to be displayed on the button.
   */
  text: string;

  /**
   * Callback function invoked when the button is clicked.
   */
  onClick: () => void;

  /**
   * If true, the button is visually styled as disabled and the `onClick` callback will not be triggered.
   * Optional, defaults to false.
   */
  isDisabled?: boolean;

  /**
   * If true, the button displays a loading indicator (e.g., spinner) and is typically disabled.
   * Useful for indicating asynchronous operations.
   * Optional, defaults to false.
   */
  isLoading?: boolean;

  /**
   * Defines the button's size. 'large' is for prominent CTAs, 'medium' for less critical actions.
   * Defaults to 'large'.
   */
  size?: 'large' | 'medium';

  /**
   * Optional ARIA label for accessibility. Useful if the button text is not fully descriptive
   * (e.g., an icon-only button, though not typical for primary buttons) or to provide more context.
   */
  ariaLabel?: string;

  /**
   * Optional SVG component or ReactNode to be rendered before the button text.
   */
  iconBefore?: React.ReactNode;

  /**
   * Optional SVG component or ReactNode to be rendered after the button text.
   */
  iconAfter?: React.ReactNode;

  /**
   * Standard HTML button type attribute.
   * Optional, defaults to 'button'.
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * If true, the button will attempt to occupy the full width of its parent container.
   * Optional, defaults to false.
   */
  fullWidth?: boolean;

  /**
   * Optional custom CSS class for additional styling.
   */
  className?: string;
}
```
```
