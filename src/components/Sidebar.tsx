
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  Square, 
  Circle, 
  Hexagon, 
  Triangle, 
  Diamond, 
  Minus, 
  ArrowRight,
  ArrowUpRight,
  Palette,
  ImageIcon,
  PencilLine
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  mindMap: {
    id: string;
    title: string;
    background_type: string;
    background_value: string;
  };
  onUpdateSettings: (updates: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const NODE_SHAPES = [
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'hexagon', name: 'Hexagon', icon: Hexagon },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'diamond', name: 'Diamond', icon: Diamond },
];

const LINE_STYLES = [
  { id: 'straight', name: 'Straight', icon: Minus },
  { id: 'arrow', name: 'Arrow', icon: ArrowRight },
  { id: 'curved', name: 'Curved', icon: ArrowUpRight },
];

const BACKGROUND_COLORS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#F8F9FA', label: 'Light Gray' },
  { value: '#F0F4FF', label: 'Light Blue' },
  { value: '#F0FFF4', label: 'Light Green' },
  { value: '#FFF5F5', label: 'Light Red' },
];

const NODE_COLORS = [
  { value: '#F2FCE2', label: 'Light Green' },
  { value: '#FEF7CD', label: 'Light Yellow' },
  { value: '#FEC6A1', label: 'Light Orange' },
  { value: '#E5DEFF', label: 'Light Purple' },
  { value: '#FFDEE2', label: 'Light Pink' },
  { value: '#D3E4FD', label: 'Light Blue' },
  { value: '#F1F0FB', label: 'Light Gray' },
  { value: '#FFFFFF', label: 'White' },
];

const Sidebar: React.FC<SidebarProps> = ({ mindMap, onUpdateSettings, isOpen, onToggle }) => {
  const [title, setTitle] = useState(mindMap.title);
  const [selectedShape, setSelectedShape] = useState('rectangle');
  const [selectedLineStyle, setSelectedLineStyle] = useState('straight');
  const [lineThickness, setLineThickness] = useState(2);
  const [fontSize, setFontSize] = useState(14);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (title !== mindMap.title) {
      onUpdateSettings({ title });
    }
  };

  const handleBackgroundChange = (value: string) => {
    onUpdateSettings({ background_value: value });
  };

  return (
    <>
      <div 
        className={`h-full border-r bg-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tools</h3>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Mind Map Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
            />
          </div>
          
          <Separator />
          
          <Tabs defaultValue="nodes">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="lines">Lines</TabsTrigger>
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
            </TabsList>
            
            {/* Nodes Tab */}
            <TabsContent value="nodes" className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Shape</Label>
                <div className="grid grid-cols-5 gap-2">
                  {NODE_SHAPES.map((shape) => {
                    const Icon = shape.icon;
                    return (
                      <Button
                        key={shape.id}
                        variant={selectedShape === shape.id ? "default" : "outline"}
                        size="icon"
                        className={`h-10 w-10 ${
                          selectedShape === shape.id ? 'bg-mindly-purple text-white' : ''
                        }`}
                        onClick={() => setSelectedShape(shape.id)}
                        title={shape.name}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="grid grid-cols-4 gap-2">
                  {NODE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      className="h-8 w-8 rounded-full border border-gray-200 transition-transform hover:scale-110"
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Font Size</Label>
                  <span className="text-sm text-gray-500">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  min={10}
                  max={24}
                  step={1}
                  onValueChange={(values) => setFontSize(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <PencilLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Lines Tab */}
            <TabsContent value="lines" className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Line Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {LINE_STYLES.map((style) => {
                    const Icon = style.icon;
                    return (
                      <Button
                        key={style.id}
                        variant={selectedLineStyle === style.id ? "default" : "outline"}
                        className={`${
                          selectedLineStyle === style.id ? 'bg-mindly-purple text-white' : ''
                        }`}
                        onClick={() => setSelectedLineStyle(style.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {style.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Thickness</Label>
                  <span className="text-sm text-gray-500">{lineThickness}px</span>
                </div>
                <Slider
                  value={[lineThickness]}
                  min={1}
                  max={6}
                  step={0.5}
                  onValueChange={(values) => setLineThickness(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['#000000', '#555555', '#0066FF', '#FF6600', '#00CC00'].map((color) => (
                    <button
                      key={color}
                      className="h-6 w-full rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Canvas Tab */}
            <TabsContent value="canvas" className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Background</Label>
                <Select 
                  defaultValue={mindMap.background_value}
                  onValueChange={handleBackgroundChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select background color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {BACKGROUND_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2 border border-gray-200" 
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Background Image</Label>
                <Button variant="outline" className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="colorful">Colorful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Grid</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Select grid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Collapsed Sidebar Toggle */}
      {!isOpen && (
        <div className="border-r bg-white flex items-center px-2">
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
