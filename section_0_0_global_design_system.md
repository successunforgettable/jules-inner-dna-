```markdown
## Section 0.0: Global Design System & Tokens

### 0.0.1 Introduction

This section outlines the global design system and foundational tokens for the Inner DNA Assessment System. These tokens provide a consistent and unified visual language across all components and phases of the application. Utilizing these tokens will ensure brand consistency, improve development efficiency, and facilitate future updates. The system is designed to be responsive and adaptable to various screen sizes.

### 0.0.2 Color Palette

Color is a fundamental aspect of the Inner DNA's visual identity, used to guide users, convey meaning, and create an engaging experience.

**Primary UI Colors:**

*   `ui-text-primary`: `#1e293b` (Deep Slate - For primary text, titles)
*   `ui-text-secondary`: `#64748b` (Cool Gray - For secondary text, subtitles, descriptions)
*   `ui-text-on-dark`: `#FFFFFF` (White - For text on dark backgrounds, like stones or dark buttons)
*   `ui-background-main`: `#f8fafc` (Light Cool Gray - Primary background for sections and containers)
*   `ui-background-welcome-gradient-start`: `#f8fafc` (For Welcome screen background)
*   `ui-background-welcome-gradient-end`: `#e2e8f0` (For Welcome screen background)
*   `ui-accent-primary`: `#7c3aed` (Deep Purple - From Home Page spec, for primary buttons, icons, highlights - assuming consistency from `Inner DNA Assessment Home Page UI_UX Design.md`)
*   `ui-accent-secondary`: `#a78bfa` (Medium Purple - From Home Page spec, for secondary accents - assuming consistency)
*   `ui-border-interactive`: `#FFFFFF` (White - For borders on stones, blocks, palettes)
*   `ui-border-container-empty`: `#94a3b8` (Dashed - For empty token containers)
*   `ui-border-token`: `rgba(255,255,255,0.8)` (For token elements)

**System Colors:**

*   `system-error-primary`: `#ef4444` (Red - For error messages, destructive actions)
*   `system-error-background`: `#fee2e2` (Light Red - For error message backgrounds)
*   `system-success-primary`: `#22c55e` (Green - For success messages, confirmations, e.g., Phase 3 state color)
*   `system-success-background`: `#dcfce7` (Light Green - For success message backgrounds)
*   `system-warning-primary`: `#f97316` (Orange - For warnings, alerts)
*   `system-warning-background`: `#ffedd5` (Light Orange - For warning message backgrounds)

**State Colors (from Section 4.3.1 & Phase 3 examples):**

These colors are used for the Color Palette Experience and influence the tower's final appearance. Each state has a primary, light, and dark variant.
*   `state-very-good-primary`: `#10b981` (Example, from Phase 3)
*   `state-very-good-light`: (Lighter variant of `#10b981`)
*   `state-very-good-dark`: (Darker variant of `#10b981`)
*   `state-good-primary`: `#22c55e` (Example, from Phase 3)
*   `state-good-light`: (Lighter variant of `#22c55e`)
*   `state-good-dark`: (Darker variant of `#22c55e`)
*   `state-neutral-primary`: `#64748b` (Example, placeholder)
*   `state-neutral-light`: (Lighter variant)
*   `state-neutral-dark`: (Darker variant)
*   `state-challenging-primary`: `#f59e0b` (Example, placeholder)
*   `state-challenging-light`: (Lighter variant)
*   `state-challenging-dark`: (Darker variant)
*   `state-very-challenging-primary`: `#ef4444` (Example, placeholder)
*   `state-very-challenging-light`: (Lighter variant)
*   `state-very-challenging-dark`: (Darker variant)

*(Note: Specific light/dark variants for state colors should be defined based on a consistent algorithm, e.g., +/- 20% lightness from the primary shade.)*

**Dynamic & Thematic Gradients:**

Many elements (Foundation Stones, Building Blocks, Color Palettes, Detail Tokens) utilize dynamically generated gradients. These gradients are often based on personality types, user choices, or inherent characteristics of the element. While the exact color stops will vary, the *style* of these gradients (e.g., smooth transitions, angle, general vibrancy or subtlety) should be consistent. Utility functions like `getTypeSpecificGradient` (referenced in Sec 4.3.2) will manage the generation of these gradients, potentially modifying base colors or applying predefined schemes according to type.

### 0.0.3 Typography Scale

**Font Family:**

*   `font-family-primary`: '"Inter", sans-serif'

**Font Weights:**

*   `font-weight-regular`: 400
*   `font-weight-medium`: 500
*   `font-weight-semibold`: 600
*   `font-weight-bold`: 700

**Responsive Font Sizing (using px for clarity, consider rems for implementation: 1rem = 16px base):**

| Token Name          | Desktop Size | Mobile Size | Line Height (approx) | Weight                      | Notes                                  |
|---------------------|--------------|-------------|----------------------|-----------------------------|----------------------------------------|
| `display-large`     | 48px         | 36px        | 1.2                  | Bold (`font-weight-bold`)   | Welcome Screen Logo/Title              |
| `heading-h1`        | 36px         | 28px        | 1.3                  | Bold (`font-weight-bold`)   | Major section titles                   |
| `heading-h2`        | 28px         | 24px        | 1.4                  | SemiBold (`font-weight-semibold`) | Sub-section titles                     |
| `heading-h3`        | 20px         | 18px        | 1.4                  | SemiBold (`font-weight-semibold`) | E.g., Instruction Panel Title          |
| `body-large`        | 18px         | 16px        | 1.5                  | Regular (`font-weight-regular`) | E.g., Stone/Block Instruction Text     |
| `body-main`         | 16px         | 14px        | 1.6                  | Regular (`font-weight-regular`) | Default body text                      |
| `body-small`        | 14px         | 13px        | 1.6                  | Regular (`font-weight-regular`) | E.g., Token Container Description      |
| `interactive-text`  | 16px         | 14px        | 1.4                  | Medium (`font-weight-medium`) | Text on Stones, Blocks, Palettes       |
| `button-text-large` | 18px         | 16px        | 1.2                  | SemiBold (`font-weight-semibold`) | Primary buttons                        |
| `button-text-small` | 14px         | 14px        | 1.2                  | Medium (`font-weight-medium`) | Secondary/smaller buttons              |
| `caption-text`      | 12px         | 12px        | 1.4                  | Regular (`font-weight-regular`) | Helper text, fine print                |

### 0.0.4 Spacing System

A consistent spacing scale is used for padding, margins, and gaps between elements.
Base unit: `space-unit: 4px`

*   `space-xxs`: `calc(var(--space-unit) * 1)` (4px)
*   `space-xs`: `calc(var(--space-unit) * 2)` (8px)
*   `space-sm`: `calc(var(--space-unit) * 3)` (12px)
*   `space-md`: `calc(var(--space-unit) * 4)` (16px) - e.g., Mobile padding, Stone Set mobile spacing
*   `space-lg`: `calc(var(--space-unit) * 6)` (24px) - e.g., Stone Set desktop spacing, Block Pair mobile spacing
*   `space-xl`: `calc(var(--space-unit) * 8)` (32px)
*   `space-xxl`: `calc(var(--space-unit) * 10)` (40px) - e.g., Block Pair desktop spacing
*   `space-xxxl`: `calc(var(--space-unit) * 12)` (48px)

Max Widths:
*   `max-width-welcome`: 1200px
*   `max-width-stone-container`: 800px
*   `max-width-block-container`: 600px
*   `max-width-palette-container`: 600px

### 0.0.5 Border Radius System

*   `radius-sm`: 4px (General small elements)
*   `radius-md`: 6px (For Building Blocks)
*   `radius-lg`: 8px (For Foundation Stones, Color Palettes)
*   `radius-xl`: 12px (For larger cards or containers, if any)
*   `radius-circular`: `50%` (For circular elements like Detail Tokens)
*   `radius-pill`: `9999px` (For pill-shaped elements)

### 0.0.6 Shadow System

Shadows are used to create depth and hierarchy, especially for interactive elements.

*   `shadow-stone`: `0 4px 12px rgba(0,0,0,0.2)` (For Foundation Stones, selected state may intensify)
*   `shadow-block`: `0 4px 8px rgba(0,0,0,0.15)` (For Building Blocks, Color Palettes)
*   `shadow-token`: `0 2px 4px rgba(0,0,0,0.1)` (For Detail Tokens)
*   `shadow-interactive-hover`: (Slightly larger/darker version of the base shadow for hover states)
*   `shadow-modal`: `0 8px 24px rgba(0,0,0,0.15)` (For modal dialogs, if any)
*   `shadow-dropdown`: `0 4px 12px rgba(0,0,0,0.1)` (For dropdown menus, if any)

```
