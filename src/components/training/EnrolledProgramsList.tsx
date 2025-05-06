import { useEffect, useState } from 'react';
import { TrainingProgram, UserProgress } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function EnrolledProgramsList() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEnrolledPrograms() {
      try {
        const userId = 'current-user'; // TODO: Get from auth context
        const userProgress = await trainingService.getUserProgress(userId);
        setProgress(userProgress);
        
        // TODO: Fetch actual program details based on progress
        setPrograms([]);
        setError(null);
      } catch (err) {
        setError('Failed to load enrolled programs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadEnrolledPrograms();
  }, []);

  if (loading) {
    return <div>Loading enrolled programs...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No enrolled programs found.</p>
        <p className="text-sm">Enroll in a program to get started with your training.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => {
        const programProgress = progress.filter(p => p.moduleId.startsWith(program.id));
        const completedModules = programProgress.filter(p => p.completed).length;
        const totalModules = program.courses.reduce((total, course) => total + course.modules.length, 0);
        const percentComplete = (completedModules / totalModules) * 100;

        return (
          <Card key={program.id}>
            <CardHeader>
              <CardTitle>{program.name}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={percentComplete} />
                <div className="text-sm text-gray-500">
                  {completedModules} of {totalModules} modules completed
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}