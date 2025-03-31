
import { useState } from 'react';
import { toast } from 'sonner';

export const useConnectMode = () => {
  const [connectMode, setConnectMode] = useState<{
    active: boolean;
    sourceId: string | null;
  }>({
    active: false,
    sourceId: null,
  });

  const startConnectionMode = (nodeId: string | null) => {
    if (!nodeId) return;
    
    setConnectMode({
      active: true,
      sourceId: nodeId,
    });
  };

  const cancelConnectionMode = () => {
    setConnectMode({
      active: false,
      sourceId: null,
    });
  };

  return {
    connectMode,
    startConnectionMode,
    cancelConnectionMode,
  };
};
