
import { useState } from 'react';

export type NodeShape = 'rectangle' | 'circle' | 'hexagon' | 'triangle' | 'diamond';

export const useNodeShapes = (initialShape: NodeShape = 'rectangle') => {
  const [currentShape, setCurrentShape] = useState<NodeShape>(initialShape);
  
  const shapeOptions = [
    { id: 'rectangle', name: 'Rectangle' },
    { id: 'circle', name: 'Circle' },
    { id: 'hexagon', name: 'Hexagon' },
    { id: 'triangle', name: 'Triangle' },
    { id: 'diamond', name: 'Diamond' },
  ] as const;
  
  const changeShape = (shape: NodeShape) => {
    setCurrentShape(shape);
  };
  
  return {
    currentShape,
    shapeOptions,
    changeShape
  };
};
