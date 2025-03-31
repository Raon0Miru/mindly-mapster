
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MindMap from '@/components/MindMap';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Share } from 'lucide-react';
import { toast } from "sonner";

interface MindMapData {
  id: string;
  title: string;
  description: string | null;
  background_type: string;
  background_value: string;
}

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mindMap, setMindMap] = useState<MindMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch mind map data
  useEffect(() => {
    if (!id || !user) return;

    const fetchMindMap = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('mindmaps')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setMindMap(data);
      } catch (error: any) {
        toast.error(`Error loading mind map: ${error.message}`);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMindMap();
  }, [id, user, navigate]);

  // Save mind map title or background
  const handleSaveMindMapSettings = async (
    updates: Partial<{ title: string, background_type: string, background_value: string }>
  ) => {
    if (!id || !mindMap) return;
    
    try {
      const { error } = await supabase
        .from('mindmaps')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setMindMap({ ...mindMap, ...updates });
      toast.success('Mind map updated');
    } catch (error: any) {
      toast.error(`Error updating mind map: ${error.message}`);
    }
  };

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" />;
  }

  if (isLoading || !mindMap) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        mindMap={mindMap} 
        onUpdateSettings={handleSaveMindMapSettings} 
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <h1 className="text-lg font-medium truncate max-w-md">{mindMap.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" className="bg-mindly-purple hover:bg-mindly-deep-purple">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </header>

        {/* Mind Map Canvas */}
        <MindMap 
          mindMapId={id}
          title={mindMap.title}
          backgroundColor={mindMap.background_value}
        />
      </div>
    </div>
  );
};

export default Editor;
