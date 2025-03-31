
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash, Link } from "lucide-react";
import { toast } from "sonner";

interface ToolbarProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onAddConnection: () => void;
  onColorChange: (color: string) => void;
  canDelete: boolean;
  canConnect: boolean;
}

const NODE_COLORS = [
  "#F2FCE2", // Light Green
  "#FEF7CD", // Light Yellow
  "#FEC6A1", // Light Orange
  "#E5DEFF", // Light Purple
  "#FFDEE2", // Light Pink
  "#D3E4FD", // Light Blue
  "#F1F0FB", // Light Gray
  "#FFFFFF", // White
];

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  onDeleteNode,
  onAddConnection,
  onColorChange,
  canDelete,
  canConnect
}) => {
  const handleAddNode = () => {
    onAddNode();
    toast.success("New node added");
  };

  return (
    <div className="toolbar">
      <Button
        variant="outline"
        size="icon"
        onClick={handleAddNode}
        title="Add node"
        className="bg-white hover:bg-mindly-purple hover:text-white"
      >
        <Plus size={18} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onDeleteNode}
        disabled={!canDelete}
        title="Delete node"
        className={`bg-white ${
          canDelete 
            ? "hover:bg-destructive hover:text-white" 
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <Trash size={18} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onAddConnection}
        disabled={!canConnect}
        title="Connect nodes"
        className={`bg-white ${
          canConnect 
            ? "hover:bg-mindly-purple hover:text-white" 
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <Link size={18} />
      </Button>
      
      <div className="h-px w-full bg-gray-200 my-2" />
      
      <div className="grid grid-cols-2 gap-2">
        {NODE_COLORS.map((color) => (
          <button
            key={color}
            className="color-button"
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title="Change node color"
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
