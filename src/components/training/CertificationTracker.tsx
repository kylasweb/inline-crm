import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Award,
  Calendar,
  Clock,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  BookOpen,
  DollarSign,
  Plus,
  Loader2,
  Verified,
  Medal,
  Hourglass
} from 'lucide-react';
import { format, addDays, isPast, differenceInDays } from 'date-fns';

interface Certification {
  id: string;
  name: string;
  provider: string;
  status: 'planned' | 'in_progress' | 'completed' | 'expired';
  type: 'professional' | 'technical' | 'methodology';
  level: 'foundation' | 'associate' | 'professional' | 'expert';
  description: string;
  examDate?: Date;
  expiryDate?: Date;
  progress: number;
  prerequisites: string[];
  cost: {
    amount: number;
    currency: string;
  };
  validity: number; // months
  materials: {
    id: string;
    title: string;
    type: string;
    completed: boolean;
  }[];
  modules: {
    id: string;
    title: string;
    progress: number;
    status: 'not_started' | 'in_progress' | 'completed';
    estimatedHours: number;
    completedHours: number;
  }[];
  practiceExams: {
    id: string;
    date: Date;
    score: number;
    totalQuestions: number;
    duration: number;
  }[];
  credential?: {
    id: string;
    url: string;
    issueDate: Date;
    verificationId: string;
  };
}

export function CertificationTracker() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'expired'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockCertifications: Certification[] = [
        {
          id: 'cert-1',
          name: 'React Developer Certification',
          provider: 'Meta',
          status: 'in_progress',
          type: 'technical',
          level: 'professional',
          description: 'Professional certification for React developers',
          examDate: addDays(new Date(), 30),
          progress: 65,
          prerequisites: ['JavaScript Fundamentals', 'Web Development Basics'],
          cost: {
            amount: 299,
            currency: 'USD'
          },
          validity: 24,
          materials: [
            {
              id: 'mat-1',
              title: 'React Fundamentals Course',
              type: 'course',
              completed: true
            },
            {
              id: 'mat-2',
              title: 'Advanced React Patterns',
              type: 'course',
              completed: false
            }
          ],
          modules: [
            {
              id: 'mod-1',
              title: 'Core Concepts',
              progress: 100,
              status: 'completed',
              estimatedHours: 10,
              completedHours: 10
            },
            {
              id: 'mod-2',
              title: 'Advanced Patterns',
              progress: 30,
              status: 'in_progress',
              estimatedHours: 15,
              completedHours: 4.5
            }
          ],
          practiceExams: [
            {
              id: 'exam-1',
              date: new Date(),
              score: 75,
              totalQuestions: 60,
              duration: 90
            }
          ]
        }
      ];

      setCertifications(mockCertifications);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load certifications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Certification['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
    }
  };

  const getLevelColor = (level: Certification['level']) => {
    switch (level) {
      case 'foundation': return 'text-green-500';
      case 'associate': return 'text-blue-500';
      case 'professional': return 'text-purple-500';
      case 'expert': return 'text-yellow-500';
    }
  };

  const formatCost = (cost: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cost.currency
    }).format(cost.amount);
  };

  const filteredCertifications = certifications.filter(cert => {
    switch (filter) {
      case 'active': return cert.status === 'in_progress';
      case 'completed': return cert.status === 'completed';
      case 'expired': return cert.status === 'expired';
      default: return true;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certification Tracker
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select
                value={filter}
                onValueChange={(value: typeof filter) => setFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certifications</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCertifications.map(cert => (
                <Card key={cert.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{cert.name}</h3>
                            <Badge className={getStatusColor(cert.status)}>
                              {cert.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            by {cert.provider}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getLevelColor(cert.level)}
                        >
                          {cert.level}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {cert.examDate && `Exam: ${format(cert.examDate, 'PP')}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {cert.validity} months validity
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {formatCost(cert.cost)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {cert.modules.length} modules
                          </div>
                        </div>
                      </div>

                      {/* Modules Progress */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Modules</div>
                        <div className="grid gap-2">
                          {cert.modules.map(module => (
                            <div
                              key={module.id}
                              className="flex items-center justify-between p-2 bg-muted rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                {module.status === 'completed' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : module.status === 'in_progress' ? (
                                  <Timer className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm">{module.title}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                  {module.completedHours}/{module.estimatedHours}h
                                </div>
                                <Progress
                                  value={module.progress}
                                  className="w-24 h-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practice Exam Results */}
                      {cert.practiceExams.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Practice Exams</div>
                          <div className="grid gap-2">
                            {cert.practiceExams.map(exam => (
                              <div
                                key={exam.id}
                                className="flex items-center justify-between p-2 bg-muted rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                                  <div className="text-sm">
                                    {format(exam.date, 'PP')}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-sm text-muted-foreground">
                                    {exam.duration} mins
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={
                                      exam.score >= 70
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }
                                  >
                                    {exam.score}%
                                  </Badge>
                                </div>
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