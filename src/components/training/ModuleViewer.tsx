import { useState, useEffect } from 'react';
import { Module, Test, UserProgress } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestInterface } from './TestInterface';
import { TestResults } from './TestResults';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

interface ModuleViewerProps {
  module: Module;
  userId: string;
  onComplete: () => void;
}

type ViewState = 'content' | 'test' | 'results';

export function ModuleViewer({ module, userId, onComplete }: ModuleViewerProps) {
  const [viewState, setViewState] = useState<ViewState>('content');
  const [test, setTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTest();
    loadProgress();
  }, [module.id]);

  const loadTest = async () => {
    try {
      const tests = await trainingService.getTests(module.id);
      if (tests.length > 0) {
        setTest(tests[0]); // Assuming one test per module
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load module test.',
        variant: 'destructive'
      });
    }
  };

  const loadProgress = async () => {
    try {
      const userProgress = await trainingService.getUserProgress(userId);
      const moduleProgress = userProgress.find(p => p.moduleId === module.id);
      if (moduleProgress) {
        setProgress(moduleProgress);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const handleStartTest = () => {
    setViewState('test');
  };

  const handleTestComplete = async () => {
    setViewState('results');
    await loadProgress(); // Refresh progress after test completion
  };

  const handleContinue = async () => {
    if (!progress?.completed) {
      setIsLoading(true);
      try {
        await trainingService.updateUserProgress({
          userId,
          moduleId: module.id,
          completed: true
        });
        toast({
          title: 'Progress Updated',
          description: 'Module marked as completed.'
        });
        onComplete();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update progress.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      onComplete();
    }
  };

  const renderContent = () => (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: module.content }} />
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {module.name}
          {progress?.completed && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </CardTitle>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {viewState === 'content' && renderContent()}
        {viewState === 'test' && test && (
          <TestInterface
            test={test}
            onComplete={handleTestComplete}
          />
        )}
        {viewState === 'results' && test && progress && (
          <TestResults
            test={test}
            result={{
              userId,
              testId: test.id,
              score: 85, // This should come from the actual test result
              dateTaken: new Date()
            }}
            onRetake={() => setViewState('test')}
            onContinue={handleContinue}
          />
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {viewState === 'content' && test && !progress?.completed && (
          <Button onClick={handleStartTest}>Start Test</Button>
        )}
        {viewState === 'content' && !test && !progress?.completed && (
          <Button onClick={handleContinue} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Mark as Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}