
import { useState } from 'react';

export const useNodeSelection = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectNode = (id: string | null) => {
    setSelectedNodeId(id);
  };

  return {
    selectedNodeId,
    selectNode,
  };
};
