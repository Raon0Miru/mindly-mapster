
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Node } from '@/types/mindMap';
import { NodeShape } from './useNodeShapes';

export const useNodes = (mindMapId: string, initialNodes: Node[] = []) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);

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
        setNodes(prevNodes => [...prevNodes, data]);
        return data.id;
      }
      
      return null;
    } catch (error: any) {
      toast.error(`Error adding node: ${error.message}`);
      return null;
    }
  };

  const updateNodePosition = async (id: string, x: number, y: number) => {
    setNodes(prevNodes => 
      prevNodes.map(node => node.id === id ? { ...node, x, y } : node)
    );
    
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

  const updateNodeText = async (id: string, text: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => node.id === id ? { ...node, text } : node)
    );
    
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

  const updateNodeType = async (id: string, nodeType: string) => {
    let width = 140;
    let height = nodeType === 'circle' ? 140 : 60;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === id ? { ...node, node_type: nodeType, width, height } : node
      )
    );
    
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
    setNodes(prevNodes => 
      prevNodes.map(node => node.id === id ? { ...node, color } : node)
    );
    
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

  const deleteNode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
      return true;
    } catch (error: any) {
      toast.error(`Error deleting node: ${error.message}`);
      return false;
    }
  };

  const getNodeCenter = (id: string) => {
    const node = nodes.find(node => node.id === id);
    if (!node) return { x: 0, y: 0 };
    
    return {
      x: node.x + (node.width / 2),
      y: node.y + (node.height / 2),
    };
  };

  return {
    nodes,
    setNodes,
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeType,
    updateNodeColor,
    deleteNode,
    getNodeCenter,
  };
};
