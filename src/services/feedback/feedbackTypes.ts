export interface Feedback {
  id: string;
  userId: string;
  surveyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum QuestionType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  CHOICE = "CHOICE",
  RATING = "RATING",
}

export interface Response {
  id: string;
  feedbackId: string;
  questionId: string;
  value: string | number | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metrics {
  surveyId: string;
  responseRate: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}