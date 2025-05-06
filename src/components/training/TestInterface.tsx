import { useState } from 'react';
import { Test, Question } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TestInterfaceProps {
  test: Test;
  onComplete: () => void;
}

export function TestInterface({ test, onComplete }: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredCount = test.questions.filter(q => !answers[q.id]).length;
    if (unansweredCount > 0) {
      toast({
        title: 'Incomplete Test',
        description: `Please answer all questions before submitting. ${unansweredCount} questions remaining.`,
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await trainingService.submitTestAnswers(test.id, answers);
      toast({
        title: 'Test Submitted',
        description: 'Your test has been submitted successfully.'
      });
      onComplete();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit test. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{test.name}</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium">{currentQuestion.text}</div>
          <RadioGroup
            value={answers[currentQuestion.id]}
            onValueChange={handleAnswerSelect}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {!isLastQuestion ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Submit Test
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}