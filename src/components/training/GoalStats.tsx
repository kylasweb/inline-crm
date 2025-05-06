import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, CheckCircle2, Calendar } from 'lucide-react';

interface GoalStatsProps {
  stats: {
    totalGoals: number;
    completedGoals: number; 
    upcomingDeadlines: number;
    hoursInvested: number;
    avgCompletion: number;
  };
}

export function GoalStats({ stats }: GoalStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">
                Active Goals
              </div>
              <div className="text-2xl font-bold">
                {stats.totalGoals - stats.completedGoals}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">
                Hours Invested
              </div>
              <div className="text-2xl font-bold">
                {stats.hoursInvested}h
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
              <div className="text-2xl font-bold">
                {Math.round(stats.avgCompletion)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">
                Upcoming Deadlines
              </div>
              <div className="text-2xl font-bold">
                {stats.upcomingDeadlines}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}