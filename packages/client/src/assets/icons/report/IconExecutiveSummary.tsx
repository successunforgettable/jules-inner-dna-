import React from 'react';

const IconExecutiveSummary: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"  // Default width, can be overridden by CSS or props
    height="24" // Default height, can be overridden by CSS or props
    fill="none" // Use 'none' for fill if only using stroke, or 'currentColor'
    stroke="currentColor" // Use 'currentColor' to inherit color from parent CSS
    strokeWidth="1.5" // Thinner stroke for icons
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Simple "document with star" or "summary" icon */}
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
    {/* A small star or highlight element */}
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor" opacity="0.3"/>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" transform="scale(0.3) translate(25 28)" />

  </svg>
);

// A simpler info icon that was in the prompt:
// <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/>

export default IconExecutiveSummary;
