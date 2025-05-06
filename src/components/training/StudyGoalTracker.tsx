import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Target,
  Calendar,
  Trophy,
  Clock,
  Plus,
  CheckCircle2,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { format, addDays, isAfter, differenceInDays } from 'date-fns';

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  type: 'course' | 'skill' | 'certification';
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  milestones: Milestone[];
  priority: 'low' | 'medium' | 'high';
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: Date;
}

export function StudyGoalTracker() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    type: 'course',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    milestones: []
  });
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock goals data
      setGoals([
        {
          id: 'goal-1',
          title: 'Complete React Advanced Course',
          description: 'Master advanced React concepts and patterns',
          deadline: addDays(new Date(), 30),
          type: 'course',
          status: 'in_progress',
          progress: 35,
          priority: 'high',
          milestones: [
            {
              id: 'ms-1',
              title: 'Finish Components Module',
              completed: true,
              targetDate: addDays(new Date(), 7)
            },
            {
              id: 'ms-2',
              title: 'Complete State Management',
              completed: false,
              targetDate: addDays(new Date(), 14)
            }
          ]
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load study goals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.deadline) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const goal: StudyGoal = {
        id: `goal-${Date.now()}`,
        title: newGoal.title,
        description: newGoal.description || '',
        deadline: new Date(newGoal.deadline),
        type: newGoal.type || 'course',
        status: 'pending',
        progress: 0,
        priority: newGoal.priority || 'medium',
        milestones: []
      };

      setGoals(prev => [...prev, goal]);
      setNewGoal({
        type: 'course',
        status: 'pending',
        priority: 'medium',
        progress: 0,
        milestones: []
      });
      setIsAddingGoal(false);

      toast({
        title: 'Success',
        description: 'Study goal added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add study goal',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setGoals(prev =>
        prev.map(goal =>
          goal.id === goalId
            ? {
                ...goal,
                progress: newProgress,
                status: newProgress === 100 ? 'completed' : 'in_progress'
              }
            : goal
        )
      );

      toast({
        title: 'Success',
        description: 'Progress updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
    }
  };

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    try {
      setGoals(prev =>
        prev.map(goal =>
          goal.id === goalId
            ? {
                ...goal,
                milestones: goal.milestones.map(ms =>
                  ms.id === milestoneId
                    ? { ...ms, completed: !ms.completed }
                    : ms
                )
              }
            : goal
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update milestone',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: StudyGoal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return '';
    }
  };

  const getStatusBadge = (status: StudyGoal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Study Goals
            </CardTitle>
            <Button onClick={() => setIsAddingGoal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {isAddingGoal && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Goal Title"
                        value={newGoal.title || ''}
                        onChange={(e) =>
                          setNewGoal(prev => ({ ...prev, title: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Description"
                        value={newGoal.description || ''}
                        onChange={(e) =>
                          setNewGoal(prev => ({ ...prev, description: e.target.value }))
                        }
                      />
                      <div className="grid gap-4 md:grid-cols-3">
                        <Select
                          value={newGoal.type}
                          onValueChange={(value: StudyGoal['type']) =>
                            setNewGoal(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Goal Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="course">Course</SelectItem>
                            <SelectItem value="skill">Skill</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={newGoal.priority}
                          onValueChange={(value: StudyGoal['priority']) =>
                            setNewGoal(prev => ({ ...prev, priority: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          type="date"
                          onChange={(e) =>
                            setNewGoal(prev => ({ ...prev, deadline: new Date(e.target.value) }))
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingGoal(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddGoal}>
                          Add Goal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <ScrollArea className="h-[600px]">
                <div className="space-y-4 pr-4">
                  {goals.map(goal => (
                    <Card key={goal.id}>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {goal.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${getPriorityColor(goal.priority)}`}>
                                {goal.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(goal.status)}`}>
                                {goal.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Due {format(goal.deadline, 'PP')}
                                {isAfter(new Date(), goal.deadline) && (
                                  <span className="text-red-500 ml-2">
                                    Overdue
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {differenceInDays(goal.deadline, new Date())} days left
                              </span>
                            </div>
                          </div>

                          {goal.milestones.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Milestones</h4>
                              <div className="space-y-2">
                                {goal.milestones.map(milestone => (
                                  <div
                                    key={milestone.id}
                                    className="flex items-center gap-2"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-0"
                                      onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                                    >
                                      <CheckCircle2
                                        className={`h-4 w-4 ${
                                          milestone.completed
                                            ? 'text-green-500'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    </Button>
                                    <span className="text-sm">
                                      {milestone.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateProgress(
                                goal.id,
                                Math.min(goal.progress + 10, 100)
                              )}
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Update Progress
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}