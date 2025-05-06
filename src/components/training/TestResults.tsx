import { Result, Test } from '@/services/training/trainingTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TestResultsProps {
  test: Test;
  result: Result;
  onRetake?: () => void;
  onContinue: () => void;
}

export function TestResults({ test, result, onRetake, onContinue }: TestResultsProps) {
  const percentageScore = Math.round((result.score / test.questions.length) * 100);
  const passingScore = 70; // This could be configurable per test
  const passed = percentageScore >= passingScore;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test Results
          {passed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>{test.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Score</span>
            <span className="font-medium">{percentageScore}%</span>
          </div>
          <Progress
            value={percentageScore}
            className={passed ? 'bg-green-100' : 'bg-red-100'}
          />
          <p className={`text-sm ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? 'Congratulations! You passed the test.' : 'You did not meet the passing score.'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-sm">
            <div className="font-medium mb-2">Summary:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Questions Attempted: {test.questions.length}</li>
              <li>Correct Answers: {Math.round((result.score / 100) * test.questions.length)}</li>
              <li>Passing Score Required: {passingScore}%</li>
              <li>Test Date: {result.dateTaken.toLocaleDateString()}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {!passed && onRetake && (
            <Button variant="outline" onClick={onRetake}>
              Retake Test
            </Button>
          )}
          <Button onClick={onContinue}>
            {passed ? 'Continue to Next Module' : 'Review Material'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}