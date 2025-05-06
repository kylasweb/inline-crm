import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Info,
  Check,
  Lock,
  Star,
  Target,
  ChevronRight,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface KnowledgeNode {
  id: string;
  label: string;
  category: string;
  mastery: number;
  status: 'completed' | 'in_progress' | 'locked';
  dependencies: string[];
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: number;
  position: { x: number; y: number };
}

interface NodeConnection {
  from: string;
  to: string;
}

const COLORS = {
  completed: '#10B981',
  in_progress: '#3B82F6',
  locked: '#6B7280'
};

export function KnowledgeMap() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [filter, setFilter] = useState('all');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockNodes: KnowledgeNode[] = [
        {
          id: 'js-basics',
          label: 'JavaScript Basics',
          category: 'Programming',
          mastery: 100,
          status: 'completed',
          dependencies: [],
          description: 'Core JavaScript concepts and syntax',
          estimatedHours: 20,
          difficulty: 'beginner',
          resources: 5,
          position: { x: 100, y: 100 }
        },
        {
          id: 'react-fundamentals',
          label: 'React Fundamentals',
          category: 'Frontend',
          mastery: 75,
          status: 'in_progress',
          dependencies: ['js-basics'],
          description: 'Basic React concepts and component patterns',
          estimatedHours: 30,
          difficulty: 'intermediate',
          resources: 8,
          position: { x: 300, y: 100 }
        },
        {
          id: 'advanced-react',
          label: 'Advanced React',
          category: 'Frontend',
          mastery: 0,
          status: 'locked',
          dependencies: ['react-fundamentals'],
          description: 'Advanced patterns and performance optimization',
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: 12,
          position: { x: 500, y: 100 }
        }
      ];

      setNodes(mockNodes);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load knowledge map',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev * 0.8, 0.5));
  };

  const handleFit = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getConnections = (): NodeConnection[] => {
    const connections: NodeConnection[] = [];
    const filteredNodes = nodes.filter(node => 
      filter === 'all' || node.status === filter
    );

    for (const node of filteredNodes) {
      for (const depId of node.dependencies) {
        if (filteredNodes.some(n => n.id === depId)) {
          connections.push({
            from: depId,
            to: node.id
          });
        }
      }
    }

    return connections;
  };

  const getDifficultyColor = (difficulty: KnowledgeNode['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
    }
  };

  const renderNode = (node: KnowledgeNode) => {
    const style = {
      transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      backgroundColor: COLORS[node.status],
      cursor: 'pointer'
    };

    return (
      <div
        key={node.id}
        className="absolute p-4 rounded-lg border shadow-sm w-[150px] text-center"
        style={style}
        onClick={() => handleNodeClick(node)}
      >
        <div className="text-sm font-medium">{node.label}</div>
        <div className="text-xs mt-1">{node.mastery}% complete</div>
      </div>
    );
  };

  const renderConnections = () => {
    const connections = getConnections();
    return connections.map((conn, index) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return null;

      const startX = fromNode.position.x + 75;
      const startY = fromNode.position.y + 30;
      const endX = toNode.position.x;
      const endY = toNode.position.y + 30;

      return (
        <svg
          key={index}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
        </svg>
      );
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Knowledge Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={filter}
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter nodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nodes</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFit}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
              <Card className="relative h-[600px] overflow-hidden">
                <div
                  ref={mapRef}
                  className="relative w-full h-full cursor-grab"
                  style={{
                    transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <svg width="0" height="0">
                    <defs>
                      <marker
                        id="arrow"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
                      </marker>
                    </defs>
                  </svg>

                  {renderConnections()}
                  {nodes
                    .filter(node => filter === 'all' || node.status === filter)
                    .map(renderNode)}
                </div>
              </Card>

              {selectedNode ? (
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-medium">{selectedNode.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedNode.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {selectedNode.category}
                      </Badge>
                      <Badge className={getDifficultyColor(selectedNode.difficulty)}>
                        {selectedNode.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mastery</span>
                        <span>{selectedNode.mastery}%</span>
                      </div>
                      <Progress value={selectedNode.mastery} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {selectedNode.estimatedHours}h
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Estimated Time
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {selectedNode.resources}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Resources
                        </div>
                      </div>
                    </div>

                    {selectedNode.dependencies.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">
                          Prerequisites
                        </div>
                        <div className="space-y-2">
                          {selectedNode.dependencies.map(depId => {
                            const dep = nodes.find(n => n.id === depId);
                            return dep ? (
                              <div
                                key={dep.id}
                                className="flex items-center justify-between p-2 bg-muted rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  {dep.status === 'completed' ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="text-sm">{dep.label}</span>
                                </div>
                                <Badge variant="secondary">
                                  {dep.mastery}%
                                </Badge>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      disabled={selectedNode.status === 'locked'}
                    >
                      {selectedNode.status === 'completed' ? (
                        <>Review Content</>
                      ) : selectedNode.status === 'in_progress' ? (
                        <>Continue Learning</>
                      ) : (
                        <>Start Learning</>
                      )}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex items-center justify-center text-center text-muted-foreground">
                    <div>
                      <Info className="h-8 w-8 mx-auto mb-2" />
                      <p>Select a node to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}