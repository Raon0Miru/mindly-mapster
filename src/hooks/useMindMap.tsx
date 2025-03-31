
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MindMapState, UseMindMapProps } from '@/types/mindMap';
import { useNodes } from './useNodes';
import { useConnections } from './useConnections';
import { NodeShape } from './useNodeShapes';

export const useMindMap = ({ mindMapId }: UseMindMapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState<{
    active: boolean;
    sourceId: string | null;
  }>({
    active: false,
    sourceId: null,
  });

  const {
    nodes,
    setNodes,
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeType,
    updateNodeColor,
    deleteNode,
    getNodeCenter,
  } = useNodes(mindMapId);

  const {
    connections,
    setConnections,
    createConnection,
    deleteConnectionsByNodeId,
  } = useConnections(mindMapId);

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
        const formattedConnections = connectionsData ? connectionsData.map(conn => ({
          id: conn.id,
          sourceId: conn.source_id,
          targetId: conn.target_id,
          color: conn.color,
          connection_type: conn.connection_type,
          thickness: conn.thickness,
          style: conn.style,
        })) : [];
        
        setNodes(nodesData || []);
        setConnections(formattedConnections);
      } catch (error: any) {
        toast.error(`Error loading mind map data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMindMapData();
  }, [mindMapId, setNodes, setConnections]);

  const selectNode = (id: string | null) => {
    if (connectMode.active && id && id !== connectMode.sourceId) {
      createConnection(connectMode.sourceId!, id);
      
      setSelectedNodeId(id);
      setConnectMode({ active: false, sourceId: null });
    } else {
      setSelectedNodeId(id);
    }
  };

  const deleteSelectedNode = async () => {
    if (!selectedNodeId) return;
    
    const deleted = await deleteNode(selectedNodeId);
    
    if (deleted) {
      deleteConnectionsByNodeId(selectedNodeId);
      setSelectedNodeId(null);
    }
  };

  const startConnectionMode = () => {
    setConnectMode({
      active: true,
      sourceId: selectedNodeId,
    });
  };

  const cancelConnectionMode = () => {
    setConnectMode({
      active: false,
      sourceId: null,
    });
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
    selectNode,
    deleteSelectedNode,
    startConnectionMode,
    cancelConnectionMode,
    getNodeCenter,
  };
};
