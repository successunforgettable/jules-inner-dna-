```markdown
## Design System Clarifications & Additions

This document provides clarifications and proposed additions to the design system, building upon "Section 0.0: Global Design System & Tokens" and the overall design specifications in `attached_assets/corrected_personality_spec.md`.

### 1. Navigation Control Styling

**(Proposed for: "Section 0.0: Global Design System & Tokens" under a new subsection like "0.0.7 Button Styles" or as a note in relevant UI sections.)**

To ensure consistent user experience for site navigation, the following button styles should be applied:

*   **Primary Actions (Next, Continue, Submit, Begin, View Results):** These buttons should utilize the `PrimaryButton` style defined in the Global Design System.
    *   **Props Interface:** (Reference `PrimaryButtonProps` from `component_props_interfaces.md`)
    *   **Visuals:** Large, prominent, using `ui-accent-primary` background, `ui-text-on-dark` text, `font-weight-semibold`, `button-text-large` size, `radius-lg`.

*   **Secondary Actions (Back, Cancel, Previous Step):** These buttons should use a `SecondaryButton` style.
    *   **Definition:** A `SecondaryButton` would typically be less prominent than a primary button.
    *   **Suggested Styling:** White background (or transparent), `ui-accent-primary` text and border, `font-weight-medium`, `button-text-large` or `button-text-small` size, `radius-lg`.
    *   **Props Interface (Example for `SecondaryButtonProps`):**
        ```typescript
        interface SecondaryButtonProps extends Omit<PrimaryButtonProps, 'size'> {
          size?: 'large' | 'medium'; // Default could be medium or same as primary
        }
        ```

*   **Tertiary/Text Actions (Learn More, Skip - if applicable):** For less critical or alternative actions, a `TertiaryButton` or text link style should be used.
    *   **Suggested Styling:** Minimal styling, often just text colored with `ui-accent-primary` or `ui-text-secondary`, `font-weight-medium`, no prominent background or border. Hover states should provide clear feedback (e.g., underline or slight color change).

Standard `NavigationControls` components (e.g., Section 5.6) should compose these button types consistently.

### 2. SVG Icon Management

**(Proposed for: "Section 0.0: Global Design System & Tokens" under a new subsection like "0.0.8 Iconography".)**

A consistent approach to iconography is crucial for visual clarity and professional presentation.

*   **Sourcing & Storage:**
    *   All UI icons are to be sourced from a pre-approved library (e.g., Heroicons v2.x.x, Material Symbols, or a custom-designed set). The specific library and version must be documented.
    *   Alternatively, individual, optimized SVG files can be stored in `client/src/assets/icons/`.
*   **Implementation:**
    *   Icons should be imported as React components (e.g., using SVGR or a similar tool). This allows for easier manipulation of props like `className`, `fill`, `stroke`, and `size`.
    *   Example: `import { ArrowRightIcon } from '@/assets/icons/ArrowRightIcon';`
*   **Visual Style:**
    *   A consistent visual style must be maintained across all icons (e.g., stroke width of 1.5px or 2px, fill vs. outline style, rounded vs. sharp line caps/joins). This should align with the overall UI aesthetic.
    *   Default icon color should typically be `currentColor` to inherit text color, or explicitly set using `ui-text-primary`, `ui-text-secondary`, or `ui-accent-primary` as appropriate.
*   **Key Icons:**
    *   Ensure icons for "Feature Highlights" (Welcome Screen 0.1.2) and "Report Sections" (6.2.2) adhere to this system.
    *   Common navigation icons (e.g., arrows, chevrons, close) should also be standardized.
*   **Accessibility:**
    *   Icons used purely for decoration should have `aria-hidden="true"`.
    *   Interactive icons (icon buttons) must have appropriate ARIA labels (e.g., via `aria-label` or visually hidden text).

### 3. Error/Validation Message Styling

**(Proposed for: "Section 0.0: Global Design System & Tokens" under a new subsection like "0.0.9 Notification & Message Styles" or integrated within Section 8: Error Handling.)**

Consistent styling for error and validation messages is essential for clear user feedback.

*   **Inline Validation Messages:**
    *   Displayed near the form field or element causing the error.
    *   **Text Color:** `system-error-primary` (e.g., `#ef4444`).
    *   **Font Size:** `caption-text` (e.g., 12px) or `body-small` (e.g., 14px/13px).
    *   **Font Weight:** `font-weight-regular` or `font-weight-medium`.
    *   **Icon (Optional):** A small error icon (e.g., circled exclamation mark) may precede the text, colored with `system-error-primary`.
    *   **Layout:** Should not significantly disrupt the layout; appears beneath or alongside the relevant input.

*   **Prominent Error Notifications (e.g., Toasts, Banners, Form-level Summaries):**
    *   Used for more general errors (e.g., API failures, form submission errors not tied to a single field).
    *   **Background Color:** `system-error-background` (e.g., `#fee2e2`).
    *   **Text Color:** `system-error-primary` or a darker shade for better contrast on the light background (e.g., `#b91c1c`).
    *   **Border:** Optional 1px solid border using `system-error-primary`.
    *   **Icon:** May include a more prominent error icon.
    *   **Padding:** Consistent padding using the spacing scale (e.g., `space-sm` or `space-md`).
    *   **Border Radius:** `radius-md` or `radius-lg`.
    *   **Shadow:** Optional `shadow-dropdown` or a similar subtle shadow.

Success and warning messages should follow similar principles using `system-success-primary`/`system-success-background` and `system-warning-primary`/`system-warning-background` respectively.

### 4. Animation Principles

**(Proposed for: "Section 0.0: Global Design System & Tokens" under a new subsection like "0.0.10 Animation & Motion".)**

Thoughtful animation enhances user experience by providing visual feedback, guiding attention, and creating a sense of fluidity. Framer Motion is the preferred library for complex animations, while CSS transitions can be used for simpler effects.

*   **Easing Functions:**
    *   **Default Easing:** `ease-in-out` (cubic-bezier(0.4, 0, 0.2, 1)) should be used for most UI transitions (e.g., hover effects, conditional rendering fades, panel slides) to provide smooth acceleration and deceleration.
    *   **Exit Animations:** `ease-in` (cubic-bezier(0.4, 0, 1, 1)) can be used for elements animating out of view.
    *   **Enter Animations:** `ease-out` (cubic-bezier(0, 0, 0.2, 1)) can be used for elements animating into view.

*   **Animation Durations:**
    *   `duration-micro: 100ms` (For very subtle feedback, like minor color shifts on hover)
    *   `duration-short: 200ms-250ms` (For fades, subtle shifts, small element transitions like button hover effects)
    *   `duration-medium: 350ms-400ms` (For panel transitions, element fly-ins, more significant visual changes like stone placement or block integration)
    *   `duration-long: 500ms+` (For larger modal transitions or full-screen animations; use sparingly)

*   **Motion Principles with Framer Motion:**
    *   **Spring Physics:** Encourage the use of Framer Motion's `spring` animations for interactions that should feel natural and responsive (e.g., tower element assembly, draggable elements, complex interactive feedback). Adjust `stiffness`, `damping`, and `mass` properties to achieve desired effects.
    *   **Staggering:** For lists or groups of elements appearing or disappearing, use `staggerChildren` to create a more appealing and understandable sequence.
    *   **Layout Animations:** Utilize `AnimatePresence` for enter/exit animations and Framer Motion's layout animation capabilities (`layout` prop) for smooth transitions when items are added, removed, or reordered.
*   **Performance:**
    *   Prioritize animations that are hardware-accelerated (primarily `transform` and `opacity`).
    *   Be mindful of animation complexity on performance, especially for low-powered devices. Test animations across different devices.
*   **Accessibility:**
    *   Ensure animations do not impede usability for users with motion sensitivities. Provide mechanisms to reduce or disable non-essential animations (`prefers-reduced-motion` media query).
    *   Animations should not be the sole means of conveying critical information.
```
