
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface NavbarProps {
  onNewMap: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewMap }) => {
  return (
    <header className="w-full bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 h-16">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-mindly-purple">
            Mindly<span className="text-mindly-deep-purple">Mapster</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={onNewMap}
            variant="outline"
            className="flex items-center gap-2 border-mindly-purple text-mindly-purple hover:bg-mindly-purple hover:text-white"
          >
            <PlusCircle size={18} />
            <span>New Map</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
