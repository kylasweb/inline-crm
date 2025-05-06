import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssignmentStore } from '@/stores/assignment.store';
import type { AssignmentHistory, TeamMemberCapacity, AssignmentMetrics } from '@/services/assignment/assignmentTypes';

interface StatsData {
  totalAssignments: number;
  successRate: number;
  typeDistribution: Record<string, number>;
  teamWorkload: TeamMemberCapacity[];
  metrics: AssignmentMetrics[];
}

const calculateTypeDistribution = (history: AssignmentHistory[]) => {
  return history.reduce((acc, curr) => {
    const type = curr.assignmentType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const calculateSuccessRate = (history: AssignmentHistory[]) => {
  if (history.length === 0) return 0;
  const successful = history.filter(h => h.assignedTo).length;
  return (successful / history.length) * 100;
};

export function AssignmentStats() {
  const { history, teamCapacity, fetchHistory, fetchTeamCapacity, isLoading } = useAssignmentStore();

  useEffect(() => {
    fetchHistory();
    fetchTeamCapacity();
  }, [fetchHistory, fetchTeamCapacity]);

  const stats = {
    totalAssignments: history.length,
    successRate: calculateSuccessRate(history),
    typeDistribution: calculateTypeDistribution(history),
    teamWorkload: teamCapacity || [],
    metrics: [] // To be implemented in future
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Success Rate */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
        <div className="mt-2 flex items-center">
          <span className="text-2xl font-bold">
            {stats.successRate.toFixed(1)}%
          </span>
        </div>
        <Progress value={stats.successRate} className="mt-2" />
      </Card>

      {/* Total Assignments */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Assignments
        </h3>
        <div className="mt-2">
          <span className="text-2xl font-bold">{stats.totalAssignments}</span>
        </div>
      </Card>

      {/* Assignment Type Distribution */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Distribution
        </h3>
        <div className="mt-2 space-y-1">
          {Object.entries(stats.typeDistribution).map(([type, count]) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="capitalize">{type.replace('_', ' ')}</span>
              <span className="font-medium">
                {((count / stats.totalAssignments) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Workload */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Team Workload
        </h3>
        <div className="mt-2 space-y-2">
          {stats.teamWorkload.map((member) => (
            <div key={member.userId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>User {member.userId}</span>
                <span className="font-medium">
                  {member.currentLeads}/{member.maxLeads}
                </span>
              </div>
              <Progress
                value={(member.currentLeads / member.maxLeads) * 100}
                className="h-1"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}