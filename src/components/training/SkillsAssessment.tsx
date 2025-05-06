import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Trophy,
  Loader2,
  BarChart2
} from 'lucide-react';

interface SkillQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Skill {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  questions: SkillQuestion[];
}

interface AssessmentResult {
  skillId: string;
  score: number;
  questionsAttempted: number;
  correctAnswers: number;
  timestamp: Date;
  recommendations: string[];
}

export function SkillsAssessment() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<SkillQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock skills data
      setSkills([
        {
          id: 'react',
          name: 'React',
          description: 'Modern React development including hooks and patterns',
          level: 'intermediate',
          prerequisites: ['JavaScript', 'HTML', 'CSS'],
          questions: [
            {
              id: 'q1',
              skillId: 'react',
              question: 'What is the purpose of useEffect?',
              options: [
                'To handle side effects in components',
                'To create custom hooks',
                'To optimize rendering',
                'To manage state'
              ],
              correctAnswer: 0,
              explanation: 'useEffect is used for handling side effects like data fetching, subscriptions, or DOM mutations.',
              difficulty: 'intermediate'
            }
            // Add more questions...
          ]
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load skills assessment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (skill: Skill) => {
    setSelectedSkill(skill);
    setCurrentQuestion(skill.questions[0]);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (!selectedSkill || !currentQuestion) return;

    const currentIndex = selectedSkill.questions.findIndex(q => q.id === currentQuestion.id);
    
    if (currentIndex < selectedSkill.questions.length - 1) {
      setCurrentQuestion(selectedSkill.questions[currentIndex + 1]);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    if (!selectedSkill) return;

    const totalQuestions = selectedSkill.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = selectedSkill.questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Generate recommendations based on performance
    const recommendations = [];
    if (score < 50) {
      recommendations.push('Review core concepts');
      recommendations.push('Practice with basic examples');
    } else if (score < 80) {
      recommendations.push('Focus on advanced topics');
      recommendations.push('Work on real-world projects');
    } else {
      recommendations.push('Ready for advanced challenges');
      recommendations.push('Consider mentoring others');
    }

    setResult({
      skillId: selectedSkill.id,
      score,
      questionsAttempted: answeredQuestions,
      correctAnswers,
      timestamp: new Date(),
      recommendations
    });
  };

  const getDifficultyColor = (difficulty: SkillQuestion['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-blue-500';
      case 'advanced': return 'text-purple-500';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Skills Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !selectedSkill ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skills.map(skill => (
                <Card key={skill.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {skill.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {skill.level}
                        </Badge>
                        {skill.prerequisites.map(prereq => (
                          <Badge key={prereq} variant="secondary">
                            {prereq}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => handleStartAssessment(skill)}
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : result ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Trophy className="h-12 w-12 mx-auto text-yellow-500" />
                <h2 className="text-2xl font-bold">Assessment Complete!</h2>
                <p className="text-muted-foreground">
                  Here's how you performed in {selectedSkill.name}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium">{result.score.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.score} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {result.correctAnswers}/{result.questionsAttempted}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Correct Answers
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {selectedSkill.level}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Skill Level
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Button
                  className="w-full"
                  onClick={() => setSelectedSkill(null)}
                >
                  Try Another Assessment
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  Question {selectedSkill.questions.findIndex(q => q.id === currentQuestion.id) + 1} of {selectedSkill.questions.length}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

                <RadioGroup
                  value={answers[currentQuestion.id]?.toString()}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
              >
                {selectedSkill.questions.findIndex(q => q.id === currentQuestion.id) === selectedSkill.questions.length - 1 ? (
                  'Complete Assessment'
                ) : (
                  'Next Question'
                )}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}