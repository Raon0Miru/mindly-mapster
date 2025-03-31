
import React, { useRef, useState } from 'react';
import Node from './Node';
import Connection from './Connection';
import Toolbar from './Toolbar';
import { useMindMap } from '@/hooks/useMindMap';
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';
import { useNodeShapes, NodeShape } from '@/hooks/useNodeShapes';

interface MindMapProps {
  mindMapId: string;
  title: string;
  backgroundColor?: string;
}

const MindMap: React.FC<MindMapProps> = ({ mindMapId, title, backgroundColor = '#FFFFFF' }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentShape, changeShape } = useNodeShapes('rectangle');
  
  const { 
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
    getNodeCenter
  } = useMindMap({ mindMapId });

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

  const handleAddNode = (shape?: NodeShape) => {
    // Add node at the center of the canvas
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      addNode(
        rect.width / 2 - 70, // Half of assumed node width
        rect.height / 2 - 30, // Half of assumed node height
        shape || currentShape
      );
    }
  };

  const handleAddConnection = () => {
    if (selectedNodeId) {
      startConnectionMode();
      toast.info("Select another node to connect");
    }
  };

  const handleShapeChange = (shape: NodeShape) => {
    changeShape(shape);
    
    // If a node is selected, also update its shape
    if (selectedNodeId) {
      updateNodeType(selectedNodeId, shape);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={canvasRef}
        className="mindmap-canvas flex-1"
        onClick={handleCanvasClick}
        style={{ backgroundColor }}
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
              thickness={connection.thickness}
              style={connection.style}
              type={connection.connection_type}
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
            text={node.text || ''}
            color={node.color}
            nodeType={node.node_type}
            width={node.width}
            height={node.height}
            selected={node.id === selectedNodeId}
            connecting={connectMode.active && connectMode.sourceId === node.id}
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
          onShapeChange={handleShapeChange}
          currentShape={currentShape}
          canDelete={!!selectedNodeId}
          canConnect={!!selectedNodeId && !connectMode.active}
        />
      </div>
    </div>
  );
};

export default MindMap;
