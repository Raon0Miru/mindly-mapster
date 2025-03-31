
import React from 'react';

interface ConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
}

const Connection: React.FC<ConnectionProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY,
  color = "#D1D5DB" 
}) => {
  
  // Calculate control points for a curved line
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Path data for a curved line
  const path = `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`;
  
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
        d={path} 
        fill="none" 
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

export default Connection;
