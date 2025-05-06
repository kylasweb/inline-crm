import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  Timer,
  BarChart2,
  HelpCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
}

interface QuizResult {
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  accuracy: number;
  improvements: string[];
  masteredTopics: string[];
  nextSteps: string[];
}

export function SkillAssessmentQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  const loadQuestions = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock questions data
      setQuestions([
        {
          id: 'q1',
          text: 'What is the purpose of React hooks?',
          options: [
            'To handle side effects in functional components',
            'To create class components',
            'To style components',
            'To configure webpack'
          ],
          correctAnswer: 0,
          explanation: 'React hooks allow you to use state and other React features in functional components.',
          difficulty: 'medium',
          topic: 'React Hooks',
          points: 10
        },
        // Add more questions...
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    const correctCount = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;

    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
    const earnedPoints = questions.reduce((acc, q) => 
      answers[q.id] === q.correctAnswer ? acc + q.points : acc, 0
    );

    const topicResults = questions.reduce<Record<string, { total: number; correct: number }>>(
      (acc, q) => {
        if (!acc[q.topic]) {
          acc[q.topic] = { total: 0, correct: 0 };
        }
        acc[q.topic].total++;
        if (answers[q.id] === q.correctAnswer) {
          acc[q.topic].correct++;
        }
        return acc;
      },
      {}
    );

    const masteredTopics = Object.entries(topicResults)
      .filter(([_, stats]) => (stats.correct / stats.total) >= 0.8)
      .map(([topic]) => topic);

    const improvements = Object.entries(topicResults)
      .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([topic]) => `Review ${topic} concepts`);

    setResult({
      score: earnedPoints,
      maxScore: totalPoints,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      timeTaken: 3600 - timeRemaining,
      accuracy: (correctCount / questions.length) * 100,
      improvements,
      masteredTopics,
      nextSteps: [
        'Practice with hands-on projects',
        'Review challenging topics',
        'Join study groups for discussion'
      ]
    });

    setQuizCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];

  const isAnswered = (questionId: string) => answers[questionId] !== undefined;

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'hard': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skill Assessment Quiz
            </div>
            {quizStarted && !quizCompleted && (
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !quizStarted ? (
            <div className="space-y-6 text-center">
              <div>
                <HelpCircle className="h-12 w-12 mx-auto text-primary" />
                <h2 className="text-2xl font-bold mt-4">Ready to Test Your Knowledge?</h2>
                <p className="text-muted-foreground mt-2">
                  This assessment contains {questions.length} questions and will take about 1 hour.
                </p>
              </div>
              <Button size="lg" onClick={handleStartQuiz}>
                Start Assessment
              </Button>
            </div>
          ) : quizCompleted && result ? (
            <div className="space-y-6">
              <div className="text-center">
                <Trophy className="h-12 w-12 mx-auto text-yellow-500" />
                <h2 className="text-2xl font-bold mt-4">Assessment Complete!</h2>
                <p className="text-muted-foreground mt-2">
                  Here's how you performed
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round(result.accuracy)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Accuracy
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {result.correctAnswers}/{result.totalQuestions}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Correct Answers
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatTime(result.timeTaken)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Time Taken
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mastered Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.masteredTopics.map(topic => (
                      <Badge key={topic} variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <Badge className={getDifficultyColor(getCurrentQuestion().difficulty)}>
                  {getCurrentQuestion().difficulty}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  {getCurrentQuestion().text}
                </h3>

                <RadioGroup
                  value={answers[getCurrentQuestion().id]?.toString()}
                  onValueChange={(value) => 
                    handleAnswer(getCurrentQuestion().id, parseInt(value))
                  }
                >
                  <div className="space-y-3">
                    {getCurrentQuestion().options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {getCurrentQuestion().points} points
                </div>
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered(getCurrentQuestion().id)}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? 'Complete Quiz'
                    : 'Next Question'}
                </Button>
              </div>

              <Progress
                value={(currentQuestionIndex / questions.length) * 100}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}