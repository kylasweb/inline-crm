export interface Certification {
  id: string;
  name: string;
  description: string;
  trainingPrograms: TrainingProgram[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  courses: Course[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  content: string;
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  completed: boolean;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Result {
  userId: string;
  testId: string;
  score: number;
  dateTaken: Date;
}

export type QuestionType = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
};