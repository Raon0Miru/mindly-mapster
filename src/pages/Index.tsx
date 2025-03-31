
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNewMap={handleGetStarted} />
      
      <div className="flex-1 flex items-center justify-center flex-col p-4">
        <div className="max-w-md text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl font-bold text-mindly-purple">
            Welcome to MindlyMapster
          </h1>
          <p className="text-lg text-gray-600">
            Create beautiful mind maps to organize your thoughts, ideas, and projects.
          </p>
          <Button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-mindly-purple text-white rounded-lg hover:bg-mindly-deep-purple transition-colors"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
