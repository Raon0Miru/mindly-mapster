
import { NodeShape } from '@/hooks/useNodeShapes';

export interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  node_type: string;
  width: number;
  height: number;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  color: string;
  connection_type: string;
  thickness: number;
  style: string;
}

export interface MindMapState {
  nodes: Node[];
  connections: Connection[];
  selectedNodeId: string | null;
  connectMode: {
    active: boolean;
    sourceId: string | null;
  };
}

export interface UseMindMapProps {
  mindMapId: string;
}
