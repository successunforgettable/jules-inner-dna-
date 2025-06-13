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
