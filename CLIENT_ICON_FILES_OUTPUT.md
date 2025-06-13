## Client-Side SVG Icon Component Files

This document contains the content of placeholder SVG icon components for the client application.

---
**File Path:** `packages/client/src/assets/icons/CheckmarkIcon.tsx`
---
```tsx
import React from 'react';

interface CheckmarkIconProps extends React.SVGProps<SVGSVGElement> {
  // No specific new props needed, inherits from SVGProps
}

const CheckmarkIcon: React.FC<CheckmarkIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3" // Made thicker for visibility
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props} // Spread additional props like className, width, height
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default CheckmarkIcon;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconExecutiveSummary.tsx`
---
```tsx
import React from 'react';

const IconExecutiveSummary: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Document with a star or highlight */}
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M12 11.5l-1.172 2.372a1 1 0 00.756 1.628h2.832a1 1 0 00.756-1.628L12 11.5z" strokeWidth="1" fill="currentColor" opacity="0.7"/>
    <line x1="9" y1="18" x2="15" y2="18"></line>
  </svg>
);
export default IconExecutiveSummary;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconCoreType.tsx`
---
```tsx
import React from 'react';

const IconCoreType: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Abstract representation of a core or center */}
    <circle cx="12" cy="12" r="4"></circle>
    <circle cx="12" cy="12" r="8" opacity="0.5"></circle>
    <line x1="12" y1="2" x2="12" y2="4"></line>
    <line x1="12" y1="20" x2="12" y2="22"></line>
    <line x1="2" y1="12" x2="4" y2="12"></line>
    <line x1="20" y1="12" x2="22" y2="12"></line>
  </svg>
);
export default IconCoreType;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconWing.tsx`
---
```tsx
import React from 'react';

const IconWing: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Abstract wing shape or two connected circles */}
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2"></path>
    <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10"></path>
    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" fill="currentColor" opacity="0.3"></path>
    <path d="M17 12h-2l-1-1-1 1H7" opacity="0.6"></path>
  </svg>
);
export default IconWing;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconArrows.tsx`
---
```tsx
import React from 'react';

const IconArrows: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Two arrows, one up, one down, or in a cycle */}
    <path d="M12 20V4"></path>
    <polyline points="8 8 12 4 16 8"></polyline>
    <path d="M12 4v16" opacity="0.6"></path>
    <polyline points="16 16 12 20 8 16" opacity="0.6"></polyline>
  </svg>
);
export default IconArrows;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconStates.tsx`
---
```tsx
import React from 'react';

// Renamed from IconOperatingStates to IconStates to match ResultsPage.tsx usage
const IconStates: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Abstract representation of blending or levels */}
    <path d="M12 21V3"></path>
    <path d="M18 15l-6 6-6-6"></path>
    <path d="M6 9l6-6 6 6"></path>
    <line x1="3" y1="12" x2="21" y2="12" opacity="0.3"></line>
  </svg>
);
export default IconStates;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconSubtype.tsx`
---
```tsx
import React from 'react';

// Renamed from IconInstinctualStack to IconSubtype to match ResultsPage.tsx usage
const IconSubtype: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Three stacked or layered elements */}
    <path d="M4 18h16"></path>
    <path d="M4 12h16" opacity="0.7"></path>
    <path d="M4 6h16" opacity="0.4"></path>
    <rect x="2" y="3" width="20" height="18" rx="1" stroke="none" fill="currentColor" opacity="0.05"></rect>
  </svg>
);
export default IconSubtype;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconGrowthPlan.tsx`
---
```tsx
import React from 'react';

const IconGrowthPlan: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Upward arrow or plant growing */}
    <path d="M12 22V8"></path>
    <path d="M5 14l7-7 7 7"></path>
    <path d="M12 8H8a4 4 0 00-4 4v0a4 4 0 004 4h8a4 4 0 004-4v0a4 4 0 00-4-4h-4" opacity="0.5"></path>
  </svg>
);
export default IconGrowthPlan;
```

---
**File Path:** `packages/client/src/assets/icons/report/IconRelationships.tsx`
---
```tsx
import React from 'react';

const IconRelationships: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Two interconnected shapes or figures */}
    <path d="M17 18a5 5 0 00-10 0"></path>
    <path d="M12 14v4"></path>
    <path d="M12 2a5 5 0 00-5 5c0 2.044.836 3.883 2.18 5.19"></path>
    <path d="M12 2a5 5 0 015 5c0 2.044-.836 3.883-2.18 5.19"></path>
    <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.3"></circle>
    <circle cx="17" cy="7" r="2" fill="currentColor" opacity="0.3"></circle>
  </svg>
);
export default IconRelationships;
```

This markdown contains the requested client-side SVG icon component files.
```
