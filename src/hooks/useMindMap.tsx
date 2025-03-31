
import { useState } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  color: string;
}

interface MindMapState {
  nodes: Node[];
  connections: Connection[];
  selectedNodeId: string | null;
  connectMode: {
    active: boolean;
    sourceId: string | null;
  };
}

export const useMindMap = () => {
  const [state, setState] = useState<MindMapState>({
    nodes: [],
    connections: [],
    selectedNodeId: null,
    connectMode: {
      active: false,
      sourceId: null,
    },
  });

  const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const addNode = (x: number, y: number) => {
    const newNode: Node = {
      id: generateId(),
      x,
      y,
      text: '',
      color: '#FFFFFF',
    };
    
    setState(prevState => ({
      ...prevState,
      nodes: [...prevState.nodes, newNode],
      selectedNodeId: newNode.id,
    }));
    
    return newNode.id;
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, x, y } : node
      ),
    }));
  };

  const updateNodeText = (id: string, text: string) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, text } : node
      ),
    }));
  };

  const updateNodeColor = (id: string, color: string) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, color } : node
      ),
    }));
  };

  const selectNode = (id: string | null) => {
    setState(prevState => {
      // If in connect mode and selecting a target node
      if (prevState.connectMode.active && id && id !== prevState.connectMode.sourceId) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          sourceId: prevState.connectMode.sourceId!,
          targetId: id,
          color: '#D1D5DB',
        };
        
        return {
          ...prevState,
          connections: [...prevState.connections, newConnection],
          selectedNodeId: id,
          connectMode: { active: false, sourceId: null },
        };
      }
      
      return {
        ...prevState,
        selectedNodeId: id,
      };
    });
  };

  const deleteSelectedNode = () => {
    setState(prevState => {
      if (!prevState.selectedNodeId) return prevState;
      
      const nodeId = prevState.selectedNodeId;
      
      return {
        ...prevState,
        nodes: prevState.nodes.filter(node => node.id !== nodeId),
        connections: prevState.connections.filter(
          conn => conn.sourceId !== nodeId && conn.targetId !== nodeId
        ),
        selectedNodeId: null,
      };
    });
  };

  const startConnectionMode = () => {
    setState(prevState => ({
      ...prevState,
      connectMode: {
        active: true,
        sourceId: prevState.selectedNodeId,
      },
    }));
  };

  const cancelConnectionMode = () => {
    setState(prevState => ({
      ...prevState,
      connectMode: {
        active: false,
        sourceId: null,
      },
    }));
  };

  const getNodeCenter = (id: string) => {
    const node = state.nodes.find(node => node.id === id);
    if (!node) return { x: 0, y: 0 };
    
    // Assuming node dimensions, would need to be adjusted for real node sizes
    return {
      x: node.x + 70, // Half of assumed width
      y: node.y + 30, // Half of assumed height
    };
  };

  return {
    nodes: state.nodes,
    connections: state.connections,
    selectedNodeId: state.selectedNodeId,
    connectMode: state.connectMode,
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeColor,
    selectNode,
    deleteSelectedNode,
    startConnectionMode,
    cancelConnectionMode,
    getNodeCenter,
  };
};
