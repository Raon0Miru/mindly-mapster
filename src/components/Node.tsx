
import React, { useState, useRef } from 'react';

interface NodeProps {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  nodeType: string;
  width: number;
  height: number;
  selected: boolean;
  connecting?: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onTextChange: (id: string, text: string) => void;
  onGetCenter: (id: string) => { x: number, y: number };
}

const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  text,
  color,
  nodeType,
  width,
  height,
  selected,
  connecting = false,
  onSelect,
  onMove,
  onTextChange,
  onGetCenter
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onSelect(id);
    }
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && nodeRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onMove(id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Determine the shape CSS classes based on the nodeType
  const getShapeClass = () => {
    switch (nodeType) {
      case 'circle':
        return 'rounded-full';
      case 'hexagon':
        return 'node-hexagon';
      case 'triangle':
        return 'node-triangle';
      case 'diamond':
        return 'node-diamond';
      default:
        return 'rounded-md';
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`node ${selected ? 'node-selected' : ''} ${connecting ? 'node-connecting' : ''} ${getShapeClass()}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        borderColor: selected ? 'transparent' : '#e5e7eb',
      }}
      onClick={() => onSelect(id)}
      onMouseDown={handleMouseDown}
    >
      <textarea
        className="w-full h-full bg-transparent outline-none resize-none text-center"
        value={text}
        onChange={(e) => onTextChange(id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="Add text..."
      />
    </div>
  );
};

export default Node;
