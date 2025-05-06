import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { trainingService } from '@/services/training/trainingService';
import { UserProgress } from '@/services/training/trainingTypes';

interface TrainingAuthContextType {
  isEnrolled: boolean;
  userProgress: UserProgress[];
  enrolledProgramIds: string[];
  canAccessModule: (moduleId: string) => boolean;
  canAccessProgram: (programId: string) => boolean;
  refreshProgress: () => Promise<void>;
}

const TrainingAuthContext = createContext<TrainingAuthContextType | null>(null);

export function TrainingAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [enrolledProgramIds, setEnrolledProgramIds] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshProgress();
    } else {
      setUserProgress([]);
      setEnrolledProgramIds([]);
    }
  }, [isAuthenticated, user]);

  const refreshProgress = async () => {
    if (!user) return;

    try {
      const progress = await trainingService.getUserProgress(user.id);
      setUserProgress(progress);
      
      // Extract unique program IDs from user progress
      const programIds = new Set<string>();
      progress.forEach(p => {
        const [programId] = p.moduleId.split('-');
        programIds.add(programId);
      });
      setEnrolledProgramIds(Array.from(programIds));
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  const canAccessModule = (moduleId: string): boolean => {
    if (!user || !isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return false;
    }

    // Check if the module's program is in enrolled programs
    const [programId] = moduleId.split('-');
    if (!enrolledProgramIds.includes(programId)) {
      return false;
    }

    // Check if prerequisites are completed
    const moduleProgress = userProgress.find(p => p.moduleId === moduleId);
    if (!moduleProgress) {
      // If no progress exists, check if it's the first module or if previous modules are completed
      const [, courseId, moduleNumber] = moduleId.split('-');
      if (moduleNumber === '1') return true;

      const previousModuleId = `${programId}-${courseId}-${parseInt(moduleNumber) - 1}`;
      const previousModuleProgress = userProgress.find(p => p.moduleId === previousModuleId);
      return previousModuleProgress?.completed ?? false;
    }

    return true;
  };

  const canAccessProgram = (programId: string): boolean => {
    if (!user || !isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return false;
    }

    return enrolledProgramIds.includes(programId);
  };

  const value = {
    isEnrolled: enrolledProgramIds.length > 0,
    userProgress,
    enrolledProgramIds,
    canAccessModule,
    canAccessProgram,
    refreshProgress,
  };

  return (
    <TrainingAuthContext.Provider value={value}>
      {children}
    </TrainingAuthContext.Provider>
  );
}

export function useTrainingAuth() {
  const context = useContext(TrainingAuthContext);
  if (!context) {
    throw new Error('useTrainingAuth must be used within a TrainingAuthProvider');
  }
  return context;
}

// Higher Order Component for protected training routes
export function withTrainingAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiresEnrollment: boolean = true
) {
  return function WithTrainingAuthComponent(props: P) {
    const { isAuthenticated } = useAuthStore();
    const { isEnrolled } = useTrainingAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: window.location.pathname } });
      } else if (requiresEnrollment && !isEnrolled) {
        navigate('/training/enroll');
      }
    }, [isAuthenticated, isEnrolled, navigate]);

    if (!isAuthenticated || (requiresEnrollment && !isEnrolled)) {
      return null;
    }

    return <Component {...props} />;
  };
}