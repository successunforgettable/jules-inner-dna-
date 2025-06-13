## Client-Side Core CSS Files (GDS & Base Styles)

This document contains the content of core CSS files that establish the Global Design System (GDS) tokens and apply base styles to the client application.

---
**File Path:** `packages/client/src/styles/variables.css`
---
```css
/* packages/client/src/styles/variables.css - GDS Tokens */
:root {
  /* 0.0.2 Color Palette */
  --ui-text-primary: #1e293b;
  --ui-text-secondary: #64748b;
  --ui-text-on-dark: #FFFFFF;
  --ui-text-on-dark-rgb: 255,255,255;
  --ui-background-main: #f8fafc;
  --ui-background-welcome-gradient-start: #f8fafc;
  --ui-background-welcome-gradient-end: #e2e8f0;
  --ui-accent-primary: #7c3aed;
  --ui-accent-primary-rgb: 124, 58, 237;
  --ui-accent-secondary: #a78bfa;
  --ui-border-interactive: #FFFFFF;
  --ui-border-container-empty: #cbd5e1;
  --ui-border-medium: #94a3b8; /* For dashed borders in SubtypeContainer */
  --ui-border-token: rgba(255, 255, 255, 0.8);

  /* System Colors */
  --system-error-primary: #ef4444;
  --system-error-primary-rgb: 239, 68, 68;
  --system-error-background: #fee2e2;
  --system-success-primary: #22c55e;
  --system-success-background: #dcfce7;
  --system-warning-primary: #f97316;
  --system-warning-background: #ffedd5;

  /* State Palette Base Colors (Aligned with Sec 4.3.1) */
  --state-very-good-primary: #10b981;      /* Very Good (Fully Activated) */
  --state-very-good-light: #a7f3d0;
  --state-very-good-dark: #059669;
  --state-good-primary: #22c55e;           /* Good (Engaged) */
  --state-good-light: #bbf7d0;
  --state-good-dark: #16a34a;
  --state-average-primary: #64748b;        /* Average (Partially Activated) - Mapped from Neutral */
  --state-average-light: #cbd5e1;
  --state-average-dark: #475569;
  --state-below-average-primary: #f59e0b;  /* Below Average (Restricted) - Mapped from Challenging */
  --state-below-average-light: #fde68a;
  --state-below-average-dark: #d97706;
  --state-destructive-primary: #ef4444;    /* Destructive (Disconnected) - Mapped from Very Challenging */
  --state-destructive-light: #fecaca;
  --state-destructive-dark: #dc2626;

  /* UI Element Specific Colors */
  --ui-neumorphic-background: #e0e5ec;
  --ui-neumorphic-shadow-dark: #babecc;
  --ui-neumorphic-shadow-light: #ffffff;

  /* 0.0.3 Typography Scale - Font Family & Weights */
  --font-family-primary: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* 0.0.3a Typographic Scale - Font Sizes & Line Heights */
  --font-size-display-large-desktop: 48px; --font-size-display-large-mobile: 36px; --line-height-display-large: 1.2;
  --font-size-heading-h1-desktop: 36px; --font-size-heading-h1-mobile: 28px; --line-height-heading-h1: 1.3;
  --font-size-heading-h2-desktop: 32px; --font-size-heading-h2-mobile: 24px; --line-height-heading-h2: 1.4;
  --font-size-heading-h3-desktop: 24px; --font-size-heading-h3-mobile: 20px; --line-height-heading-h3: 1.4;
  --font-size-body-large-desktop: 18px; --font-size-body-large-mobile: 16px; --line-height-body-large: 1.5;
  --font-size-body-main-desktop: 16px; --font-size-body-main-mobile: 14px; --line-height-body-main: 1.6;
  --font-size-body-small-desktop: 14px; --font-size-body-small-mobile: 13px; --line-height-body-small: 1.5;
  --font-size-interactive-text-desktop: 16px; --font-size-interactive-text-mobile: 14px; --line-height-interactive-text: 1.4;
  --font-size-button-text-large-desktop: 18px; --font-size-button-text-large-mobile: 16px; --line-height-button-text-large: 1.2;
  --font-size-button-text-small-desktop: 14px; --font-size-button-text-small-mobile: 14px; --line-height-button-text-small: 1.2;
  --font-size-caption-text-desktop: 12px; --font-size-caption-text-mobile: 12px; --line-height-caption-text: 1.4;

  /* 0.0.4 Spacing System */
  --space-unit: 4px;
  --space-xxs: calc(var(--space-unit) * 1);  /* 4px */
  --space-xs: calc(var(--space-unit) * 2);   /* 8px */
  --space-sm: calc(var(--space-unit) * 3);   /* 12px */
  --space-md: calc(var(--space-unit) * 4);   /* 16px */
  --space-lg: calc(var(--space-unit) * 6);   /* 24px */
  --space-xl: calc(var(--space-unit) * 8);   /* 32px */
  --space-xxl: calc(var(--space-unit) * 10); /* 40px */
  --space-xxxl: calc(var(--space-unit) * 12);/* 48px */

  --max-width-welcome: 1200px;
  --max-width-stone-container: 800px;
  --max-width-block-container: 700px;
  --max-width-palette-container: calc( (200px * 3) + (var(--space-lg) * 2) );
  --max-width-content-s: 500px; /* For smaller content blocks like sliders */

  /* 0.0.5 Border Radius System */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-circular: 50%;
  --radius-pill: 9999px;

  /* 0.0.6 Shadow System */
  --shadow-stone: 0 4px 12px rgba(0,0,0,0.2);
  --shadow-block: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-token: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-modal: 0 8px 24px rgba(0,0,0,0.15);
  --shadow-dropdown: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-interactive-hover: 0px 8px 20px rgba(0,0,0,0.25);

  /* 0.0.10 Animation & Motion - Durations */
  --animation-duration-micro: 100ms;
  --animation-duration-short: 250ms;
  --animation-duration-medium: 400ms;
  --animation-duration-long: 2000ms;   /* For effects like gentle floating */
  --animation-duration-very-long: 10000ms; /* For very subtle, slow background animations */

  /* Specific element sizes referenced by JS/CSS */
  --placed-stone-size-desktop: 32px;
  --placed-stone-size-tablet: 28px;
  --placed-stone-size-mobile: 24px;
}
```

---
**File Path:** `packages/client/src/styles/globals.css`
---
```css
/* packages/client/src/styles/globals.css - Base styles with GDS variables */

/* Basic CSS Reset/Normalization */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth; /* Added for "Learn More" link */
}

body {
  font-family: var(--font-family-primary);
  color: var(--ui-text-primary);
  background-color: var(--ui-background-main);
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  min-height: 100vh;
}

/* Base Typographic Element Styling using GDS Variables */
h1, .h1-style {
  font-size: var(--font-size-heading-h1-mobile);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading-h1);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-md);
}
h2, .h2-style {
  font-size: var(--font-size-heading-h2-mobile);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading-h2);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-sm);
}
h3, .h3-style {
  font-size: var(--font-size-heading-h3-mobile);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading-h3);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-xs);
}
h4, .h4-style { /* Typically smaller than H3, maps to body-large bolded */
  font-size: var(--font-size-body-large-mobile);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-body-large);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-xs);
}
h5, .h5-style { /* Example for smaller heading, maps to body-main bolded */
  font-size: var(--font-size-body-main-mobile);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-body-main);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-xs);
}
h6, .h6-style { /* Example for smallest heading, maps to body-small bolded */
  font-size: var(--font-size-body-small-mobile);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-body-small);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-xs);
}

p, .p-style, li, div { /* Default text containers */
  font-size: var(--font-size-body-main-mobile);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body-main);
  /* margin-bottom: var(--space-sm); /* Applied by specific components usually */
}
/* p:last-child, li:last-child, div:last-child { margin-bottom: 0; } */

small, .small-style {
  font-size: var(--font-size-caption-text-mobile);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-caption-text);
  color: var(--ui-text-secondary);
}

strong, b {
  font-weight: var(--font-weight-bold); /* Ensure strong uses GDS bold */
}

ul, ol {
  padding-left: var(--space-lg); /* Standard padding for lists */
  margin-bottom: var(--space-sm);
}
li {
  margin-bottom: var(--space-xs); /* Spacing between list items */
}


@media (min-width: 768px) { /* Desktop Overrides */
  body { font-size: var(--font-size-body-main-desktop); }
  h1, .h1-style { font-size: var(--font-size-heading-h1-desktop); }
  h2, .h2-style { font-size: var(--font-size-heading-h2-desktop); }
  h3, .h3-style { font-size: var(--font-size-heading-h3-desktop); }
  h4, .h4-style { font-size: var(--font-size-body-large-desktop); }
  h5, .h5-style { font-size: var(--font-size-body-main-desktop); }
  h6, .h6-style { font-size: var(--font-size-body-small-desktop); }
  p, .p-style, li, div { font-size: var(--font-size-body-main-desktop); }
  small, .small-style { font-size: var(--font-size-caption-text-desktop); }
}

/* Global Link Styles */
a {
  color: var(--ui-accent-primary);
  text-decoration: none;
  transition: color var(--animation-duration-micro) ease-in-out;
}
a:hover, a:focus {
  text-decoration: underline;
  color: var(--ui-accent-secondary);
}

/* Utility classes */
.text-center { text-align: center; }
.container {
  width: 100%;
  margin-left: auto; margin-right: auto;
  padding-left: var(--space-md); padding-right: var(--space-md);
}
@media (min-width: 640px) { .container { max-width: 640px; } }
@media (min-width: 768px) { .container { max-width: 768px; } }
/* Larger containers defined by max-width variables in variables.css */

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* Accessibility: Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---
**File Path:** `packages/client/src/App.css`
---
```css
/* App.css - For styles specific to the main App component or global layout overrides */
/* Many global styles are now in styles/globals.css and variables in styles/variables.css */

/* Example: If App component itself needed a specific layout override not part of Layout.module.css */
/*
#root > div { // Assuming App component is the direct child of #root after Layout
  width: 100%;
}
*/

/* Ensure Layout takes full height if needed, though Layout.module.css handles this */
/* html, body, #root { height: 100%; } */
```

---
**File Path:** `packages/client/src/index.css`
---
```css
/* index.css - Minimal root/body styles if not fully covered by globals.css */
/* Most base styles are in globals.css. This file can be for very early, minimal resets or #root styling. */

/* Ensure #root takes full height if not already handled by App/Layout structure */
/* This is often better handled by ensuring Layout component and its parents correctly fill height. */
/*
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
*/

/* Example: If you need to ensure #root is a flex container for some global layout reason,
   but typically App.tsx or Layout.tsx would handle its own internal layout.
#root {
  display: flex;
  flex-direction: column;
}
*/
```

This markdown contains the requested client-side core CSS files.
```
