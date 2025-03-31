
import React from 'react';

interface ConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  thickness?: number;
  style?: string;
  type?: string;
}

const Connection: React.FC<ConnectionProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY,
  color = "#D1D5DB",
  thickness = 2,
  style = "solid",
  type = "straight"
}) => {
  
  // Get dash array based on style
  const getDashArray = () => {
    switch (style) {
      case 'dashed':
        return '5,5';
      case 'dotted':
        return '2,2';
      default:
        return 'none';
    }
  };
  
  // Calculate path based on type
  const getPath = () => {
    if (type === 'curved') {
      // Curved line with control points
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      return `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`;
    } else {
      // Straight line
      return `M${startX},${startY} L${endX},${endY}`;
    }
  };
  
  // Determine if we need an arrow
  const needsArrow = type === 'arrow';
  
  // Calculate arrow points if needed
  const calculateArrowPoints = () => {
    if (!needsArrow) return null;
    
    const angle = Math.atan2(endY - startY, endX - startX);
    const length = 10;
    
    const x1 = endX - length * Math.cos(angle - Math.PI / 6);
    const y1 = endY - length * Math.sin(angle - Math.PI / 6);
    const x2 = endX - length * Math.cos(angle + Math.PI / 6);
    const y2 = endY - length * Math.sin(angle + Math.PI / 6);
    
    return `M${endX},${endY} L${x1},${y1} L${x2},${y2} Z`;
  };
  
  return (
    <svg 
      className="connection" 
      style={{
        left: Math.min(startX, endX) - 50,
        top: Math.min(startY, endY) - 50,
        width: Math.abs(endX - startX) + 100,
        height: Math.abs(endY - startY) + 100
      }}
    >
      <path 
        d={getPath()} 
        fill="none" 
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={getDashArray()}
      />
      {needsArrow && (
        <path 
          d={calculateArrowPoints()} 
          fill={color} 
          stroke={color} 
          strokeWidth="1"
        />
      )}
    </svg>
  );
};

export default Connection;
