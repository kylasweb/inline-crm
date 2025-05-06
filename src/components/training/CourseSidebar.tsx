import { useMemo } from 'react';
import { Course, UserProgress } from '@/services/training/trainingTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface CourseSidebarProps {
  courses: Course[];
  userProgress: UserProgress[];
  currentModuleId: string;
  onModuleSelect: (moduleId: string) => void;
}

export function CourseSidebar({
  courses,
  userProgress,
  currentModuleId,
  onModuleSelect
}: CourseSidebarProps) {
  const moduleProgress = useMemo(() => {
    return new Map(userProgress.map(p => [p.moduleId, p.completed]));
  }, [userProgress]);

  const calculateCourseProgress = (course: Course) => {
    const completedModules = course.modules.filter(module => 
      moduleProgress.get(module.id)
    ).length;
    return Math.round((completedModules / course.modules.length) * 100);
  };

  return (
    <div className="w-64 flex flex-col border-r h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Course Content</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="single" collapsible defaultValue={courses[0]?.id}>
            {courses.map(course => {
              const progress = calculateCourseProgress(course);
              
              return (
                <AccordionItem key={course.id} value={course.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{course.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent>
                    <div className="space-y-1 pl-1">
                      {course.modules.map((module, index) => {
                        const isCompleted = moduleProgress.get(module.id);
                        const isCurrent = module.id === currentModuleId;
                        
                        return (
                          <Button
                            key={module.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start gap-2 px-2",
                              isCurrent && "bg-accent",
                              !isCompleted && index > 0 && !moduleProgress.get(course.modules[index - 1].id) && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => onModuleSelect(module.id)}
                            disabled={!isCompleted && index > 0 && !moduleProgress.get(course.modules[index - 1].id)}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            ) : isCurrent ? (
                              <PlayCircle className="w-4 h-4 text-primary" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="text-sm truncate">
                              {module.name}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}