
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MindMap from '@/components/MindMap';
import Modal from '@/components/Modal';

const Index = () => {
  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [mapTitle, setMapTitle] = useState("My Mind Map");
  const [mapCreated, setMapCreated] = useState(false);

  const handleNewMap = () => {
    setShowNewMapModal(true);
  };

  const handleCreateMap = (title: string) => {
    setMapTitle(title);
    setMapCreated(true);
    setShowNewMapModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNewMap={handleNewMap} />
      
      {mapCreated ? (
        <MindMap title={mapTitle} />
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col p-4">
          <div className="max-w-md text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold text-mindly-purple">
              Welcome to MindlyMapster
            </h1>
            <p className="text-lg text-gray-600">
              Create beautiful mind maps to organize your thoughts, ideas, and projects.
            </p>
            <button
              onClick={handleNewMap}
              className="px-6 py-3 bg-mindly-purple text-white rounded-lg hover:bg-mindly-deep-purple transition-colors"
            >
              Create Your First Mind Map
            </button>
          </div>
        </div>
      )}
      
      <Modal 
        isOpen={showNewMapModal} 
        onClose={() => setShowNewMapModal(false)}
        onConfirm={handleCreateMap}
      />
    </div>
  );
};

export default Index;
