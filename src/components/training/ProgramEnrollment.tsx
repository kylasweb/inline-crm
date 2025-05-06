import { useState, useEffect } from 'react';
import { Certification, TrainingProgram } from '@/services/training/trainingTypes';
import { trainingService } from '@/services/training/trainingService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, BookOpen, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';

interface ProgramEnrollmentProps {
  userId: string;
  onEnrollmentComplete: (programId: string) => void;
}

export function ProgramEnrollment({ userId, onEnrollmentComplete }: ProgramEnrollmentProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await trainingService.getCertifications();
      setCertifications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load training programs.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (programId: string) => {
    setEnrolling(programId);
    try {
      await trainingService.enrollInProgram(userId, programId);
      toast({
        title: 'Success',
        description: 'Successfully enrolled in the program.'
      });
      onEnrollmentComplete(programId);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enroll in the program.',
        variant: 'destructive'
      });
    } finally {
      setEnrolling(null);
    }
  };

  const calculateProgramMetrics = (program: TrainingProgram) => {
    const totalModules = program.courses.reduce((sum, course) => sum + course.modules.length, 0);
    const estimatedHours = totalModules * 2; // Assuming 2 hours per module
    
    return {
      modules: totalModules,
      hours: estimatedHours,
      level: program.courses.length <= 2 ? 'Beginner' :
             program.courses.length <= 4 ? 'Intermediate' : 'Advanced'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Available Training Programs</h2>
        <p className="text-muted-foreground">
          Explore our comprehensive training programs and start your learning journey
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-6 pr-4">
          {certifications.map((certification) => (
            <Card key={certification.id}>
              <CardHeader>
                <CardTitle>{certification.name}</CardTitle>
                <CardDescription>{certification.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {certification.trainingPrograms.map((program) => {
                    const metrics = calculateProgramMetrics(program);
                    
                    return (
                      <AccordionItem key={program.id} value={program.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-medium">{program.name}</span>
                            <Badge variant="secondary">{metrics.level}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 py-2">
                            <p className="text-sm text-muted-foreground">
                              {program.description}
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{program.courses.length} Courses</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{metrics.modules} Modules</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{metrics.hours} Hours</span>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                onClick={() => handleEnroll(program.id)}
                                disabled={enrolling === program.id}
                              >
                                {enrolling === program.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 mr-2" />
                                )}
                                Enroll Now
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}