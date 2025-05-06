import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Compass,
  Trophy,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  Star,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TrainingProgram } from '@/services/training/trainingTypes';

interface LearningGoal {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  estimatedTime: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RecommendedPath {
  goalId: string;
  programs: TrainingProgram[];
  totalDuration: number;
  expectedOutcome: string;
  prerequisites: string[];
  skillsGained: string[];
}

export function LearningPathRecommender() {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [recommendedPath, setRecommendedPath] = useState<RecommendedPath | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock learning goals
  const learningGoals: LearningGoal[] = [
    {
      id: 'goal-1',
      name: 'Full-Stack Web Development',
      description: 'Master both frontend and backend web development',
      requiredSkills: ['HTML/CSS', 'JavaScript', 'Node.js', 'Databases'],
      estimatedTime: 120,
      difficulty: 'advanced'
    },
    {
      id: 'goal-2',
      name: 'Cloud Architecture',
      description: 'Design and implement cloud-based solutions',
      requiredSkills: ['AWS', 'Azure', 'DevOps', 'Security'],
      estimatedTime: 90,
      difficulty: 'intermediate'
    },
    {
      id: 'goal-3',
      name: 'Data Science Fundamentals',
      description: 'Learn essential data science concepts and tools',
      requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'Data Analysis'],
      estimatedTime: 100,
      difficulty: 'intermediate'
    }
  ];

  const handleGoalSelect = async (goalId: string) => {
    setSelectedGoal(goalId);
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock recommended path with properly typed programs
      const mockPrograms: TrainingProgram[] = [
        {
          id: 'prog-1',
          name: 'Frontend Fundamentals',
          description: 'Master HTML, CSS, and JavaScript',
          courses: [{
            id: 'course-1',
            name: 'Getting Started',
            description: 'Introduction to core concepts',
            modules: []
          }]
        },
        {
          id: 'prog-2',
          name: 'Backend Development',
          description: 'Learn Node.js and Express',
          courses: [{
            id: 'course-2',
            name: 'Server Basics',
            description: 'Introduction to backend development',
            modules: []
          }]
        },
        {
          id: 'prog-3',
          name: 'Database Management',
          description: 'Work with SQL and NoSQL databases',
          courses: [{
            id: 'course-3',
            name: 'Database Fundamentals',
            description: 'Introduction to databases',
            modules: []
          }]
        }
      ];

      setRecommendedPath({
        goalId,
        programs: mockPrograms,
        totalDuration: 120,
        expectedOutcome: 'Ability to build full-stack web applications',
        prerequisites: ['Basic programming knowledge', 'Problem-solving skills'],
        skillsGained: [
          'Frontend Development',
          'Backend Development',
          'Database Design',
          'API Development',
          'Web Security'
        ]
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate learning path.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollPath = () => {
    if (!recommendedPath) return;
    navigate(`/training/programs/${recommendedPath.programs[0].id}`);
  };

  const getDifficultyColor = (difficulty: LearningGoal['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-6 w-6" />
            Learning Path Recommender
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium">Select Your Learning Goal</label>
              <Select
                value={selectedGoal}
                onValueChange={handleGoalSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  {learningGoals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedGoal && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : recommendedPath ? (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-blue-500" />
                            <div>
                              <div className="text-sm font-medium">Duration</div>
                              <div className="text-2xl font-bold">
                                {recommendedPath.totalDuration}h
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Target className="h-8 w-8 text-green-500" />
                            <div>
                              <div className="text-sm font-medium">Programs</div>
                              <div className="text-2xl font-bold">
                                {recommendedPath.programs.length}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Trophy className="h-8 w-8 text-yellow-500" />
                            <div>
                              <div className="text-sm font-medium">Skills Gained</div>
                              <div className="text-2xl font-bold">
                                {recommendedPath.skillsGained.length}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold">Prerequisites</h3>
                          <div className="flex flex-wrap gap-2">
                            {recommendedPath.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold">Recommended Path</h3>
                          <div className="space-y-4">
                            {recommendedPath.programs.map((program, index) => (
                              <Card key={program.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                      <h4 className="font-medium">
                                        {index + 1}. {program.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {program.description}
                                      </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold">Skills You'll Gain</h3>
                          <div className="flex flex-wrap gap-2">
                            {recommendedPath.skillsGained.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleEnrollPath}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Start Learning Path
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}