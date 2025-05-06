import { useState, useEffect, useMemo } from 'react';
import { Course, Module, TrainingProgram } from '@/services/training/trainingTypes';
import { useTrainingAuth } from '@/contexts/TrainingAuthContext';
import { trainingService } from '@/services/training/trainingService';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface ModuleWithMeta extends Module {
  courseName: string;
  programName: string;
  programId: string;
  courseId: string;
  completed: boolean;
}

export function ModuleSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const { userProgress, enrolledProgramIds } = useTrainingAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const loadedPrograms = await Promise.all(
        enrolledProgramIds.map(id => trainingService.getTrainingProgram(id))
      );
      setPrograms(loadedPrograms.filter((p): p is TrainingProgram => p !== null));
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const allModules = useMemo(() => {
    const modules: ModuleWithMeta[] = [];
    
    programs.forEach(program => {
      program.courses.forEach(course => {
        course.modules.forEach(module => {
          const isCompleted = userProgress.some(
            p => p.moduleId === module.id && p.completed
          );
          
          modules.push({
            ...module,
            courseName: course.name,
            programName: program.name,
            programId: program.id,
            courseId: course.id,
            completed: isCompleted
          });
        });
      });
    });
    
    return modules;
  }, [programs, userProgress]);

  const filteredModules = useMemo(() => {
    return allModules.filter(module => {
      const matchesSearch = 
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.courseName.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesProgram = selectedProgram === 'all' || module.programId === selectedProgram;
      
      const matchesFilter = 
        filter === 'all' ||
        (filter === 'completed' && module.completed) ||
        (filter === 'incomplete' && !module.completed);
        
      return matchesSearch && matchesProgram && matchesFilter;
    });
  }, [allModules, searchTerm, selectedProgram, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={selectedProgram}
            onValueChange={setSelectedProgram}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter}
            onValueChange={(value: 'all' | 'completed' | 'incomplete') => setFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map(module => (
          <Card key={module.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{module.name}</CardTitle>
                {module.completed && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <CardDescription>
                {module.courseName} - {module.programName}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {module.description}
              </p>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/training/programs/${module.programId}/modules/${module.id}`)}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {module.completed ? 'Review Module' : 'Start Module'}
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredModules.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No modules found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}