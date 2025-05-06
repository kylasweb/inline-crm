export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'certification' | 'project';
  priority: 'high' | 'medium' | 'low';
  deadline: Date;
  targetHours: number;
  completedHours: number;
  milestones: Milestone[];
  status: 'not_started' | 'in_progress' | 'completed';
  tags: string[];
  metrics: Metric[];
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
}

export interface Metric {
  type: string;
  target: number;
  current: number;
}

export interface GoalStats {
  totalGoals: number;
  completedGoals: number;
  upcomingDeadlines: number;
  hoursInvested: number;
  avgCompletion: number;
}