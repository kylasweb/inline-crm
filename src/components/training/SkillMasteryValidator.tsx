import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Star,
  CheckCircle2,
  XCircle,
  Trophy,
  Loader2,
  ChevronRight,
  Code,
  FileCheck,
  HelpCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  validationCriteria: ValidationCriterion[];
  dependencies?: string[];
  lastValidated?: Date;
  masteryScore?: number;
}

interface ValidationCriterion {
  id: string;
  type: 'quiz' | 'project' | 'code_challenge';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  score?: number;
  feedback?: string;
}

interface ValidationTest {
  skillId: string;
  criteria: ValidationCriterion[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function SkillMasteryValidator() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [currentTest, setCurrentTest] = useState<ValidationTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  const loadSkillData = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock skills data
      const mockSkills: Skill[] = [
        {
          id: 'react',
          name: 'React',
          level: 'intermediate',
          category: 'Frontend',
          description: 'Modern React development with hooks and patterns',
          lastValidated: new Date('2025-04-15'),
          masteryScore: 85,
          validationCriteria: [
            {
              id: 'vc-1',
              type: 'quiz',
              description: 'React fundamentals assessment',
              status: 'completed',
              score: 90
            },
            {
              id: 'vc-2',
              type: 'code_challenge',
              description: 'Build a custom hook',
              status: 'completed',
              score: 85
            },
            {
              id: 'vc-3',
              type: 'project',
              description: 'Create a React application',
              status: 'pending'
            }
          ],
          dependencies: ['javascript', 'html']
        }
      ];

      setSkills(mockSkills);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load skill data',
        variant: 'destructive'
      });
    }
  };

  const startValidation = async (skill: Skill) => {
    setSelectedSkill(skill);
    setValidating(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentTest({
        skillId: skill.id,
        criteria: skill.validationCriteria,
        timeLimit: 60,
        difficulty: 'medium'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start validation',
        variant: 'destructive'
      });
      setValidating(false);
    }
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return '';
    }
  };

  const getCriterionIcon = (type: ValidationCriterion['type']) => {
    switch (type) {
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'project': return <FileCheck className="h-4 w-4" />;
      case 'code_challenge': return <Code className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ValidationCriterion['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Skill Mastery Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : currentTest ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{selectedSkill?.name} Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete the following criteria to validate your mastery
                  </p>
                </div>
                <Badge variant="outline">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentTest.timeLimit} minutes
                </Badge>
              </div>

              <div className="space-y-4">
                {currentTest.criteria.map((criterion, index) => (
                  <Card key={criterion.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {getCriterionIcon(criterion.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge variant="secondary">
                                {criterion.type}
                              </Badge>
                              <h4 className="font-medium mt-1">
                                {criterion.description}
                              </h4>
                            </div>
                            {getStatusIcon(criterion.status)}
                          </div>
                          {criterion.score && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Score</span>
                                <span>{criterion.score}%</span>
                              </div>
                              <Progress value={criterion.score} />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {skills.map(skill => (
                    <Card key={skill.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{skill.name}</h3>
                              <Badge className={getLevelColor(skill.level)}>
                                {skill.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {skill.description}
                            </p>
                            
                            {skill.dependencies && (
                              <div className="flex gap-2 mt-2">
                                {skill.dependencies.map(dep => (
                                  <Badge key={dep} variant="outline">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {skill.lastValidated && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Last validated: {format(skill.lastValidated, 'PP')}
                              </p>
                            )}
                          </div>

                          <div className="text-center">
                            {skill.masteryScore && (
                              <div className="mb-2">
                                <div className="text-2xl font-bold">
                                  {skill.masteryScore}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Mastery Score
                                </div>
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startValidation(skill)}
                            >
                              Validate
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}