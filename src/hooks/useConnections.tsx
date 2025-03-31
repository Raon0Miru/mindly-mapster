
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Connection } from '@/types/mindMap';

export const useConnections = (mindMapId: string, initialConnections: Connection[] = []) => {
  const [connections, setConnections] = useState<Connection[]>(initialConnections);

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
        
        setConnections(prevConnections => [...prevConnections, newConnection]);
        toast.success('Connection created');
        return newConnection.id;
      }
      return null;
    } catch (error: any) {
      toast.error(`Error creating connection: ${error.message}`);
      return null;
    }
  };

  const deleteConnectionsByNodeId = (nodeId: string) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => 
        conn.sourceId !== nodeId && conn.targetId !== nodeId
      )
    );
  };

  return {
    connections,
    setConnections,
    createConnection,
    deleteConnectionsByNodeId,
  };
};
