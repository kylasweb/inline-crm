import { useEffect, useState } from 'react';
import { TrainingProgram, UserProgress, Result } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CompletedProgramsList() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompletedPrograms() {
      try {
        const userId = 'current-user'; // TODO: Get from auth context
        const userProgress = await trainingService.getUserProgress(userId);
        
        // Filter for completed programs
        const completedProgress = userProgress.filter(p => p.completed);
        
        // TODO: Fetch actual program details and test results
        setPrograms([]);
        setResults([]);
        setError(null);
      } catch (err) {
        setError('Failed to load completed programs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCompletedPrograms();
  }, []);

  if (loading) {
    return <div>Loading completed programs...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No completed programs yet.</p>
        <p className="text-sm">Complete your enrolled programs to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => {
        const programResults = results.filter(r => r.testId.startsWith(program.id));
        const averageScore = programResults.reduce((sum, r) => sum + r.score, 0) / programResults.length;
        const completionDate = new Date(Math.max(...programResults.map(r => r.dateTaken.getTime())));

        return (
          <Card key={program.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {program.name}
                <Badge variant="secondary">Completed</Badge>
              </CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Average Score:</span>
                  <span className="font-medium">{averageScore.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed On:</span>
                  <span className="font-medium">{completionDate.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}