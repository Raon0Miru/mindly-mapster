import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { NodeShape } from './useNodeShapes';

interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  node_type: string;
  width: number;
  height: number;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  color: string;
  connection_type: string;
  thickness: number;
  style: string;
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

interface UseMindMapProps {
  mindMapId: string;
}

export const useMindMap = ({ mindMapId }: UseMindMapProps) => {
  const [state, setState] = useState<MindMapState>({
    nodes: [],
    connections: [],
    selectedNodeId: null,
    connectMode: {
      active: false,
      sourceId: null,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load nodes and connections on mount
  useEffect(() => {
    if (!mindMapId) return;

    const fetchMindMapData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch nodes
        const { data: nodesData, error: nodesError } = await supabase
          .from('nodes')
          .select('*')
          .eq('mindmap_id', mindMapId);
          
        if (nodesError) throw nodesError;
        
        // Fetch connections
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .eq('mindmap_id', mindMapId);
          
        if (connectionsError) throw connectionsError;
        
        // Transform connections to expected format
        const formattedConnections: Connection[] = connectionsData ? connectionsData.map(conn => ({
          id: conn.id,
          sourceId: conn.source_id,
          targetId: conn.target_id,
          color: conn.color,
          connection_type: conn.connection_type,
          thickness: conn.thickness,
          style: conn.style,
        })) : [];
        
        setState(prevState => ({
          ...prevState,
          nodes: nodesData || [],
          connections: formattedConnections,
        }));
      } catch (error: any) {
        toast.error(`Error loading mind map data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMindMapData();
  }, [mindMapId]);

  const addNode = async (x: number, y: number, nodeType: NodeShape = 'rectangle') => {
    try {
      const { data, error } = await supabase
        .from('nodes')
        .insert({
          mindmap_id: mindMapId,
          x,
          y,
          text: '',
          color: '#FFFFFF',
          node_type: nodeType,
          width: 140,
          height: nodeType === 'circle' ? 140 : 60,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setState(prevState => ({
          ...prevState,
          nodes: [...prevState.nodes, data],
          selectedNodeId: data.id,
        }));
        
        return data.id;
      }
      
      return null;
    } catch (error: any) {
      toast.error(`Error adding node: ${error.message}`);
      return null;
    }
  };

  const updateNodePosition = async (id: string, x: number, y: number) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, x, y } : node
      ),
    }));
    
    const updatePosition = async () => {
      try {
        const { error } = await supabase
          .from('nodes')
          .update({ x, y, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
      } catch (error: any) {
        toast.error(`Error updating node position: ${error.message}`);
      }
    };
    
    updatePosition();
  };

  const updateNodeText = async (id: string, text: string) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, text } : node
      ),
    }));
    
    const updateText = async () => {
      try {
        const { error } = await supabase
          .from('nodes')
          .update({ text, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
      } catch (error: any) {
        toast.error(`Error updating node text: ${error.message}`);
      }
    };
    
    updateText();
  };

  const updateNodeType = async (id: string, nodeType: string) => {
    let width = 140;
    let height = nodeType === 'circle' ? 140 : 60;
    
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, node_type: nodeType, width, height } : node
      ),
    }));
    
    try {
      const { error } = await supabase
        .from('nodes')
        .update({ 
          node_type: nodeType, 
          width, 
          height, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Error updating node type: ${error.message}`);
    }
  };

  const updateNodeColor = async (id: string, color: string) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => 
        node.id === id ? { ...node, color } : node
      ),
    }));
    
    try {
      const { error } = await supabase
        .from('nodes')
        .update({ color, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Error updating node color: ${error.message}`);
    }
  };

  const selectNode = (id: string | null) => {
    setState(prevState => {
      if (prevState.connectMode.active && id && id !== prevState.connectMode.sourceId) {
        createConnection(prevState.connectMode.sourceId!, id);
        
        return {
          ...prevState,
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

  const deleteSelectedNode = async () => {
    setState(prevState => {
      if (!prevState.selectedNodeId) return prevState;
      
      const nodeId = prevState.selectedNodeId;
      
      const deleteNode = async () => {
        try {
          const { error } = await supabase
            .from('nodes')
            .delete()
            .eq('id', nodeId);
          
          if (error) throw error;
        } catch (error: any) {
          toast.error(`Error deleting node: ${error.message}`);
        }
      };
      
      deleteNode();
      
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

  const createConnection = async (sourceId: string, targetId: string) => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .insert({
          mindmap_id: mindMapId,
          source_id: sourceId,
          target_id: targetId,
          color: '#D1D5DB',
          connection_type: 'straight',
          thickness: 2,
          style: 'solid',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newConnection: Connection = {
          id: data.id,
          sourceId: data.source_id,
          targetId: data.target_id,
          color: data.color,
          connection_type: data.connection_type,
          thickness: data.thickness,
          style: data.style,
        };
        
        setState(prevState => ({
          ...prevState,
          connections: [...prevState.connections, newConnection],
        }));
        
        toast.success('Connection created');
      }
    } catch (error: any) {
      toast.error(`Error creating connection: ${error.message}`);
    }
  };

  const getNodeCenter = (id: string) => {
    const node = state.nodes.find(node => node.id === id);
    if (!node) return { x: 0, y: 0 };
    
    return {
      x: node.x + (node.width / 2),
      y: node.y + (node.height / 2),
    };
  };

  return {
    nodes: state.nodes,
    connections: state.connections,
    selectedNodeId: state.selectedNodeId,
    connectMode: state.connectMode,
    isLoading,
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeColor,
    updateNodeType,
    selectNode,
    deleteSelectedNode,
    startConnectionMode,
    cancelConnectionMode,
    getNodeCenter,
  };
};
