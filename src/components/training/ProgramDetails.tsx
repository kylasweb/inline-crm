import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TrainingProgram, Course } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { useTrainingAuth } from '@/contexts/TrainingAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, BookOpen, GraduationCap, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export function ProgramDetails() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { programId } = useParams();
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { userProgress, canAccessProgram, refreshProgress } = useTrainingAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (programId) {
      loadProgramDetails();
    }
  }, [programId]);

  const loadProgramDetails = async () => {
    try {
      if (!programId) return;
      const data = await trainingService.getTrainingProgram(programId);
      setProgram(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load program details.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!program) return;
    setEnrolling(true);
    try {
      await trainingService.enrollInProgram(userId, program.id);
      await refreshProgress();
      toast({
        title: 'Success',
        description: 'Successfully enrolled in the program.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enroll in the program.',
        variant: 'destructive'
      });
    } finally {
      setEnrolling(false);
    }
  };

  const calculateCourseProgress = (course: Course) => {
    const completedModules = course.modules.filter(module =>
      userProgress.some(p => p.moduleId === module.id && p.completed)
    ).length;
    return (completedModules / course.modules.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Program not found</p>
      </div>
    );
  }

  const isEnrolled = canAccessProgram(program.id);
  const totalModules = program.courses.reduce((sum, course) => sum + course.modules.length, 0);
  const completedModules = userProgress.filter(p => 
    program.courses.some(course => 
      course.modules.some(module => module.id === p.moduleId && p.completed)
    )
  ).length;
  const overallProgress = (completedModules / totalModules) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{program.name}</h1>
          <p className="text-muted-foreground mt-2">{program.description}</p>
        </div>
        {!isEnrolled && (
          <Button onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            Enroll Now
          </Button>
        )}
      </div>

      {isEnrolled && (
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Total Courses</div>
                  <div className="text-2xl font-bold">{program.courses.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="text-2xl font-bold">{completedModules}/{totalModules} Modules</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                  <Progress value={overallProgress} className="w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Course Content</TabsTrigger>
          <TabsTrigger value="info">Program Information</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="space-y-4">
            {program.courses.map((course, index) => {
              const progress = isEnrolled ? calculateCourseProgress(course) : 0;
              
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        Course {index + 1}: {course.name}
                      </span>
                      {progress === 100 && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {course.modules.length} Modules
                        </span>
                        {isEnrolled && (
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-32" />
                            <span className="text-sm font-medium">{Math.round(progress)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="py-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <p className="text-sm text-muted-foreground">
                  No prerequisites required for this program.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Learning Outcomes</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Understand core concepts and principles</li>
                  <li>Develop practical skills through hands-on exercises</li>
                  <li>Apply knowledge to real-world scenarios</li>
                  <li>Earn industry-recognized certification</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get assistance from our expert instructors through discussion forums and live sessions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}