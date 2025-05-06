import { format, isPast } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  CheckCircle2,
  Edit2,
  Flag,
  Star,
  Target,
  Trophy
} from 'lucide-react';

interface Goal {
  id: string;
  title: string; 
  description: string;
  category: 'skill' | 'certification' | 'project';
  priority: 'high' | 'medium' | 'low';
  deadline: Date;
  targetHours: number;
  completedHours: number;
  milestones: {
    id: string;
    title: string;
    dueDate: Date;
    completed: boolean;
  }[];
  status: 'not_started' | 'in_progress' | 'completed';
  tags: string[];
  metrics: {
    type: string;
    target: number;
    current: number;
  }[];
}

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (goalId: string, hours: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
}

export function GoalCard({ goal, onUpdateProgress, onToggleMilestone }: GoalCardProps) {
  
  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'skill': return <Star className="h-4 w-4" />;
      case 'certification': return <Trophy className="h-4 w-4" />;
      case 'project': return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                {getCategoryIcon(goal.category)}
                <h3 className="font-medium">{goal.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {goal.description}
              </p>
            </div>
            <Badge className={getPriorityColor(goal.priority)}>
              {goal.priority}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {goal.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {goal.completedHours}/{goal.targetHours} hours
              </span>
            </div>
            <Progress
              value={(goal.completedHours / goal.targetHours) * 100}
            />
          </div>

          {goal.milestones.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Milestones</div>
              <div className="space-y-2">
                {goal.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0"
                        onClick={() => onToggleMilestone(goal.id, milestone.id)}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            milestone.completed
                              ? 'text-green-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                      <span className="text-sm">{milestone.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(milestone.dueDate, 'MMM d')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Due {format(goal.deadline, 'PP')}
                  {isPast(goal.deadline) && goal.status !== 'completed' && (
                    <span className="text-red-500 ml-1">
                      (Overdue)
                    </span>
                  )}
                </span>
              </div>
              {goal.metrics.map(metric => (
                <div
                  key={metric.type}
                  className="flex items-center gap-1"
                >
                  <Target className="h-4 w-4" />
                  <span>
                    {metric.current}/{metric.target} {metric.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateProgress(goal.id, 1)}
                disabled={goal.status === 'completed'}
              >
                Log Progress
              </Button>
              <Button
                variant="ghost"
                size="icon"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}