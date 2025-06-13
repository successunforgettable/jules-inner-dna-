// src/components/Foundation/Stone.js
import React from 'react';
import './Stone.css';

const Stone = ({ 
  content, 
  selected, 
  onClick, 
  stoneIndex,
  position,
  isPlaced = false
}) => {
  // Calculate styles for stones placed around the foundation
  const placedStyle = isPlaced && position ? {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  } : {};

  // Extract content lines
  const contentLines = content ? content.split('•').filter(line => line.trim()) : [];
  
  return (
    <div 
      className={`stone ${selected ? 'selected' : ''} ${isPlaced ? 'placed' : ''}`}
      onClick={() => !isPlaced && onClick(stoneIndex)}
      style={placedStyle}
    >
      <div className="stone-content">
        {contentLines.map((line, index) => (
          <div key={index} className="stone-line">{line.trim()}</div>
        ))}
      </div>
      {selected && !isPlaced && <div className="stone-checkmark">✓</div>}
    </div>
  );
};

export default Stone;