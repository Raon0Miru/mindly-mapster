
import React, { useRef } from 'react';
import Node from './Node';
import Connection from './Connection';
import Toolbar from './Toolbar';
import { useMindMap } from '@/hooks/useMindMap';
import { toast } from "sonner";

interface MindMapProps {
  title: string;
}

const MindMap: React.FC<MindMapProps> = ({ title }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { 
    nodes, 
    connections, 
    selectedNodeId, 
    connectMode,
    addNode,
    updateNodePosition,
    updateNodeText,
    updateNodeColor,
    selectNode,
    deleteSelectedNode,
    startConnectionMode,
    cancelConnectionMode,
    getNodeCenter
  } = useMindMap();

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if we clicked directly on the canvas (not on a node)
    if (e.target === canvasRef.current) {
      selectNode(null);
      
      if (connectMode.active) {
        cancelConnectionMode();
        toast.error("Connection cancelled");
      }
    }
  };

  const handleAddNode = () => {
    // Add node at the center of the canvas
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      addNode(
        rect.width / 2 - 70, // Half of assumed node width
        rect.height / 2 - 30, // Half of assumed node height
      );
    }
  };

  const handleAddConnection = () => {
    if (selectedNodeId) {
      startConnectionMode();
      toast.info("Select another node to connect");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-mindly-grey bg-opacity-50 p-2 flex items-center">
        <h2 className="text-lg font-medium text-mindly-deep-purple">{title}</h2>
      </div>
      
      <div 
        ref={canvasRef}
        className="mindmap-canvas"
        onClick={handleCanvasClick}
      >
        {/* Render connections */}
        {connections.map((connection) => {
          const sourceCenter = getNodeCenter(connection.sourceId);
          const targetCenter = getNodeCenter(connection.targetId);
          
          return (
            <Connection
              key={connection.id}
              startX={sourceCenter.x}
              startY={sourceCenter.y}
              endX={targetCenter.x}
              endY={targetCenter.y}
              color={connection.color}
            />
          );
        })}
        
        {/* Render nodes */}
        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            text={node.text}
            color={node.color}
            selected={node.id === selectedNodeId}
            onSelect={selectNode}
            onMove={updateNodePosition}
            onTextChange={updateNodeText}
            onGetCenter={getNodeCenter}
          />
        ))}
        
        {/* Toolbar */}
        <Toolbar
          onAddNode={handleAddNode}
          onDeleteNode={deleteSelectedNode}
          onAddConnection={handleAddConnection}
          onColorChange={(color) => {
            if (selectedNodeId) {
              updateNodeColor(selectedNodeId, color);
            }
          }}
          canDelete={!!selectedNodeId}
          canConnect={!!selectedNodeId && !connectMode.active}
        />
      </div>
    </div>
  );
};

export default MindMap;
