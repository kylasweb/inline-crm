import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Target,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Rocket,
  Star,
  Clock,
  Award,
  Trophy,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  lastAssessed?: Date;
  nextAssessment?: Date;
  history: Assessment[];
  prerequisites: string[];
  subskills: {
    name: string;
    level: number;
  }[];
  recommendations: {
    type: string;
    title: string;
    url: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

interface Assessment {
  id: string;
  date: Date;
  score: number;
  level: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  duration: number;
  questionCount: number;
  accuracyByTopic: {
    topic: string;
    accuracy: number;
  }[];
}

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export function SkillAssessment() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSkillsData();
  }, []);

  const loadSkillsData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockSkills: Skill[] = [
        {
          id: 'skill-1',
          name: 'React Development',
          category: 'Frontend',
          level: 75,
          lastAssessed: addDays(new Date(), -14),
          nextAssessment: addDays(new Date(), 16),
          history: [
            {
              id: 'assessment-1',
              date: addDays(new Date(), -14),
              score: 75,
              level: 3,
              strengths: ['Component Design', 'Hooks Usage'],
              weaknesses: ['Performance Optimization', 'Testing'],
              feedback: 'Good understanding of core concepts, focus on advanced patterns',
              duration: 45,
              questionCount: 30,
              accuracyByTopic: [
                { topic: 'Components', accuracy: 85 },
                { topic: 'Hooks', accuracy: 80 },
                { topic: 'Performance', accuracy: 65 }
              ]
            }
          ],
          prerequisites: ['JavaScript', 'HTML', 'CSS'],
          subskills: [
            { name: 'Components', level: 85 },
            { name: 'Hooks', level: 80 },
            { name: 'State Management', level: 70 }
          ],
          recommendations: [
            {
              type: 'course',
              title: 'Advanced React Patterns',
              url: 'https://example.com/course',
              priority: 'high'
            }
          ]
        }
      ];

      const mockCategories: SkillCategory[] = [
        {
          id: 'cat-1',
          name: 'Frontend',
          description: 'Frontend development technologies',
          skills: ['React Development', 'TypeScript', 'CSS']
        }
      ];

      setSkills(mockSkills);
      setCategories(mockCategories);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load skills data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (skillId: string) => {
    try {
      setActiveAssessment(skillId);
      // TODO: Implement assessment logic
      toast({
        title: 'Assessment Started',
        description: 'Preparing your skill assessment...'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start assessment',
        variant: 'destructive'
      });
    }
  };

  const getLevelLabel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const getLevelColor = (level: number) => {
    if (level >= 90) return 'text-purple-500';
    if (level >= 70) return 'text-blue-500';
    if (level >= 40) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getProgressTrend = (skill: Skill) => {
    if (skill.history.length < 2) return 0;
    const latest = skill.history[skill.history.length - 1].score;
    const previous = skill.history[skill.history.length - 2].score;
    return latest - previous;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skill Assessment
            </CardTitle>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {skills
                .filter(skill => 
                  selectedCategory === 'all' || 
                  categories.find(c => c.id === selectedCategory)?.skills.includes(skill.name)
                )
                .map(skill => (
                  <Card key={skill.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{skill.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getLevelColor(skill.level)}>
                                {getLevelLabel(skill.level)}
                              </Badge>
                              {getProgressTrend(skill) !== 0 && (
                                <Badge 
                                  variant="outline"
                                  className={getProgressTrend(skill) > 0 ? 'text-green-500' : 'text-red-500'}
                                >
                                  {getProgressTrend(skill) > 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  )}
                                  {Math.abs(getProgressTrend(skill))}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => startAssessment(skill.id)}
                            disabled={activeAssessment === skill.id}
                          >
                            Start Assessment
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Proficiency</span>
                            <span className={getLevelColor(skill.level)}>
                              {skill.level}%
                            </span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Subskills</div>
                            <div className="space-y-2">
                              {skill.subskills.map(subskill => (
                                <div
                                  key={subskill.name}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{subskill.name}</span>
                                  <Progress
                                    value={subskill.level}
                                    className="w-24 h-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Last Assessment</div>
                            {skill.lastAssessed ? (
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div>Date: {format(skill.lastAssessed, 'PP')}</div>
                                <div>Score: {skill.history[skill.history.length - 1].score}%</div>
                                <div>Duration: {skill.history[skill.history.length - 1].duration} mins</div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No assessments yet
                              </div>
                            )}
                          </div>
                        </div>

                        {skill.recommendations.length > 0 && (
                          <div className="border-t pt-4">
                            <div className="text-sm font-medium mb-2">Recommended Next Steps</div>
                            <div className="space-y-2">
                              {skill.recommendations.map((rec, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    <span className="text-sm">{rec.title}</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={
                                      rec.priority === 'high'
                                        ? 'text-red-500'
                                        : rec.priority === 'medium'
                                        ? 'text-yellow-500'
                                        : 'text-green-500'
                                    }
                                  >
                                    {rec.priority}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}