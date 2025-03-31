
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node, Connection } from '@/types/mindMap';

interface UseMindMapDataProps {
  mindMapId: string;
}

interface UseMindMapDataReturn {
  nodes: Node[];
  connections: Connection[];
  isLoading: boolean;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}

export const useMindMapData = ({ mindMapId }: UseMindMapDataProps): UseMindMapDataReturn => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [mindMapId]);

  return {
    nodes,
    connections,
    isLoading,
    setNodes,
    setConnections,
  };
};
