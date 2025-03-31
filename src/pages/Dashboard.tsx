
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, PlusCircle, MoreVertical, Trash2, Edit, Clock, SortAsc } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface MindMap {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updated_at' | 'title'>('updated_at');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [newMapTitle, setNewMapTitle] = useState('');
  const [newMapDescription, setNewMapDescription] = useState('');

  // Fetch user's mind maps
  useEffect(() => {
    if (!user) return;

    const fetchMindMaps = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('mindmaps')
          .select('*')
          .order(sortBy, { ascending: sortBy === 'title' });
        
        if (error) throw error;
        setMindMaps(data || []);
      } catch (error: any) {
        toast.error(`Error fetching mind maps: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMindMaps();
  }, [user, sortBy]);

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" />;
  }

  const handleCreateMindMap = async () => {
    if (!newMapTitle.trim()) {
      toast.error('Please enter a title for your mind map');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mindmaps')
        .insert({
          title: newMapTitle,
          description: newMapDescription || null,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Mind map created successfully!');
      setShowNewMapModal(false);
      setNewMapTitle('');
      setNewMapDescription('');
      
      // Navigate to the editor with the new mind map ID
      navigate(`/editor/${data.id}`);
    } catch (error: any) {
      toast.error(`Error creating mind map: ${error.message}`);
    }
  };

  const handleDeleteMindMap = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mindmaps')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMindMaps(mindMaps.filter(map => map.id !== id));
      toast.success('Mind map deleted successfully!');
    } catch (error: any) {
      toast.error(`Error deleting mind map: ${error.message}`);
    }
  };

  const filteredMindMaps = mindMaps.filter(map => 
    map.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-mindly-purple">My Mind Maps</h1>
          <Button 
            onClick={() => setShowNewMapModal(true)} 
            className="bg-mindly-purple hover:bg-mindly-deep-purple"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Mind Map
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search mind maps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-4">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('updated_at')}>
                <Clock className="mr-2 h-4 w-4" />
                Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                <SortAsc className="mr-2 h-4 w-4" />
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredMindMaps.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500 mb-4">No mind maps found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try a different search term' : 'Create your first mind map to get started'}
            </p>
            <Button 
              onClick={() => setShowNewMapModal(true)} 
              className="bg-mindly-purple hover:bg-mindly-deep-purple"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a Mind Map
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMindMaps.map((mindMap) => (
              <Card key={mindMap.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-lg font-medium">{mindMap.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/editor/${mindMap.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMindMap(mindMap.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {mindMap.description || 'No description'}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/editor/${mindMap.id}`)}
                    className="text-mindly-purple hover:text-mindly-deep-purple hover:bg-mindly-purple/10 p-0"
                  >
                    Open
                  </Button>
                  <span className="text-xs text-gray-400 ml-auto">
                    Updated {formatDate(mindMap.updated_at)}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* New Mind Map Modal */}
      <Dialog open={showNewMapModal} onOpenChange={setShowNewMapModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Mind Map</DialogTitle>
            <DialogDescription>
              Give your mind map a title and optional description to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newMapTitle}
                onChange={(e) => setNewMapTitle(e.target.value)}
                placeholder="My Awesome Mind Map"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                id="description"
                value={newMapDescription}
                onChange={(e) => setNewMapDescription(e.target.value)}
                placeholder="What's this mind map about?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMapModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMindMap} 
              className="bg-mindly-purple hover:bg-mindly-deep-purple"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
