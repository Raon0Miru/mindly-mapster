
import { useState } from 'react';
import { MindMapState, UseMindMapProps } from '@/types/mindMap';
import { useNodes } from './useNodes';
import { useConnections } from './useConnections';
import { useNodeSelection } from './useNodeSelection';
import { useConnectMode } from './useConnectMode';
import { useMindMapData } from './useMindMapData';
import { NodeShape } from './useNodeShapes';

export const useMindMap = ({ mindMapId }: UseMindMapProps) => {
  const { 
    nodes, 
    connections, 
    isLoading, 
    setNodes, 
    setConnections 
  } = useMindMapData({ mindMapId });
  
  const { selectedNodeId, selectNode } = useNodeSelection();
  const { connectMode, startConnectionMode, cancelConnectionMode } = useConnectMode();

  const {
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeType,
    updateNodeColor,
    deleteNode,
    getNodeCenter,
  } = useNodes(mindMapId, nodes);

  const {
    createConnection,
    deleteConnectionsByNodeId,
  } = useConnections(mindMapId, connections);

  const handleNodeSelect = (id: string | null) => {
    if (connectMode.active && id && id !== connectMode.sourceId) {
      createConnection(connectMode.sourceId!, id);
      
      selectNode(id);
      cancelConnectionMode();
    } else {
      selectNode(id);
    }
  };

  const deleteSelectedNode = async () => {
    if (!selectedNodeId) return;
    
    const deleted = await deleteNode(selectedNodeId);
    
    if (deleted) {
      deleteConnectionsByNodeId(selectedNodeId);
      selectNode(null);
    }
  };

  const handleStartConnectionMode = () => {
    startConnectionMode(selectedNodeId);
  };

  return {
    nodes,
    connections,
    selectedNodeId,
    connectMode,
    isLoading,
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeColor,
    updateNodeType,
    selectNode: handleNodeSelect,
    deleteSelectedNode,
    startConnectionMode: handleStartConnectionMode,
    cancelConnectionMode,
    getNodeCenter,
  };
};
