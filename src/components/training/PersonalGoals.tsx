import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDays, differenceInDays } from 'date-fns';
import { GoalCard } from './GoalCard';
import { GoalStats } from './GoalStats';
import { AddGoalForm } from './AddGoalForm';
import { Goal, GoalStats as GoalStatsType } from './types';

export function PersonalGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: 'skill',
    priority: 'medium',
    status: 'not_started',
    milestones: [],
    tags: [],
    metrics: []
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockGoals: Goal[] = [
        {
          id: 'goal-1',
          title: 'Master React Advanced Patterns',
          description: 'Deep dive into advanced React concepts and patterns',
          category: 'skill',
          priority: 'high',
          deadline: addDays(new Date(), 30),
          targetHours: 40,
          completedHours: 15,
          status: 'in_progress',
          tags: ['React', 'Frontend', 'Advanced'],
          milestones: [
            {
              id: 'ms-1',
              title: 'Complete Custom Hooks Module',
              dueDate: addDays(new Date(), 7),
              completed: true
            },
            {
              id: 'ms-2',
              title: 'Build Performance Optimization Project',
              dueDate: addDays(new Date(), 14),
              completed: false
            }
          ],
          metrics: [
            {
              type: 'Practice Projects',
              target: 5,
              current: 2
            },
            {
              type: 'Code Reviews',
              target: 10,
              current: 4
            }
          ]
        }
      ];

      setGoals(mockGoals);
      updateStats(mockGoals);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load goals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (currentGoals: Goal[]) => {
    const stats: GoalStatsType = {
      totalGoals: currentGoals.length,
      completedGoals: currentGoals.filter(g => g.status === 'completed').length,
      upcomingDeadlines: currentGoals.filter(g => 
        differenceInDays(g.deadline, new Date()) <= 7 &&
        g.status !== 'completed'
      ).length,
      hoursInvested: currentGoals.reduce((sum, g) => sum + g.completedHours, 0),
      avgCompletion: currentGoals.reduce((sum, g) => 
        sum + (g.completedHours / g.targetHours) * 100, 0
      ) / currentGoals.length || 0
    };
    setStats(stats);
  };

  const handleUpdateProgress = async (goalId: string, hours: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setGoals(prev => {
        const updated = prev.map(goal => {
          if (goal.id !== goalId) return goal;

          const newCompletedHours = Math.min(goal.completedHours + hours, goal.targetHours);
          const newStatus: Goal['status'] = 
            newCompletedHours >= goal.targetHours
              ? 'completed'
              : newCompletedHours > 0
                ? 'in_progress'
                : goal.status;

          return {
            ...goal,
            completedHours: newCompletedHours,
            status: newStatus
          };
        });

        updateStats(updated);
        return updated;
      });

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

      toast({
        title: 'Success',
        description: 'Milestone updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update milestone',
        variant: 'destructive'
      });
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.deadline || !newGoal.targetHours) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const goal: Goal = {
        id: `goal-${Date.now()}`,
        title: newGoal.title,
        description: newGoal.description ?? '',
        category: newGoal.category ?? 'skill',
        priority: newGoal.priority ?? 'medium',
        deadline: new Date(newGoal.deadline),
        targetHours: newGoal.targetHours,
        completedHours: 0,
        status: 'not_started',
        tags: newGoal.tags ?? [],
        milestones: newGoal.milestones ?? [],
        metrics: newGoal.metrics ?? []
      };

      setGoals(prev => {
        const updated = [...prev, goal];
        updateStats(updated);
        return updated;
      });

      setNewGoal({
        category: 'skill',
        priority: 'medium',
        status: 'not_started',
        milestones: [],
        tags: [],
        metrics: []
      });
      setIsAddingGoal(false);

      toast({
        title: 'Success',
        description: 'Goal added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add goal',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personal Goals
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
              {stats && <GoalStats stats={stats} />}

              {isAddingGoal && (
                <AddGoalForm
                  goal={newGoal}
                  onUpdate={updates => setNewGoal(prev => ({ ...prev, ...updates }))}
                  onSubmit={handleAddGoal}
                  onCancel={() => setIsAddingGoal(false)}
                />
              )}

              <div className="space-y-4">
                {goals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdateProgress={handleUpdateProgress}
                    onToggleMilestone={handleToggleMilestone}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}