import { fetchData, postData, updateData, deleteData } from '../api';
import {
  Certification,
  Course,
  Module,
  Question,
  Result,
  Test,
  TrainingProgram,
  UserProgress
} from './trainingTypes';

class TrainingService {
  private readonly baseUrl = '/api/training';

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    const response = await fetchData<Certification[]>(`${this.baseUrl}/certifications`);
    return response.data || [];
  }

  async getCertification(id: string): Promise<Certification | null> {
    const response = await fetchData<Certification>(`${this.baseUrl}/certifications/${id}`);
    return response.data || null;
  }

  // Training Programs
  async getTrainingPrograms(certificationId: string): Promise<TrainingProgram[]> {
    const response = await fetchData<TrainingProgram[]>(`${this.baseUrl}/certifications/${certificationId}/programs`);
    return response.data || [];
  }

  async getTrainingProgram(id: string): Promise<TrainingProgram | null> {
    const response = await fetchData<TrainingProgram>(`${this.baseUrl}/programs/${id}`);
    return response.data || null;
  }

  // Courses
  async getCourses(programId: string): Promise<Course[]> {
    const response = await fetchData<Course[]>(`${this.baseUrl}/programs/${programId}/courses`);
    return response.data || [];
  }

  async getCourse(id: string): Promise<Course | null> {
    const response = await fetchData<Course>(`${this.baseUrl}/courses/${id}`);
    return response.data || null;
  }

  // Modules
  async getModules(courseId: string): Promise<Module[]> {
    const response = await fetchData<Module[]>(`${this.baseUrl}/courses/${courseId}/modules`);
    return response.data || [];
  }

  async getModule(id: string): Promise<Module | null> {
    const response = await fetchData<Module>(`${this.baseUrl}/modules/${id}`);
    return response.data || null;
  }

  // Tests
  async getTests(moduleId: string): Promise<Test[]> {
    const response = await fetchData<Test[]>(`${this.baseUrl}/modules/${moduleId}/tests`);
    return response.data || [];
  }

  async getTest(id: string): Promise<Test | null> {
    const response = await fetchData<Test>(`${this.baseUrl}/tests/${id}`);
    return response.data || null;
  }

  async submitTestAnswers(testId: string, answers: { [questionId: string]: string }): Promise<Result> {
    const response = await postData<Result>(`${this.baseUrl}/tests/${testId}/submit`, answers);
    if (!response.data) {
      throw new Error('Failed to submit test answers');
    }
    return response.data;
  }

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const response = await fetchData<UserProgress[]>(`${this.baseUrl}/users/${userId}/progress`);
    return response.data || [];
  }

  async updateUserProgress(progress: UserProgress): Promise<UserProgress> {
    const response = await updateData<UserProgress>(
      `${this.baseUrl}/progress`,
      { ...progress } as unknown as Record<string, unknown>
    );
    if (!response.data) {
      throw new Error('Failed to update user progress');
    }
    return response.data;
  }

  // Enrollment
  async enrollInProgram(userId: string, programId: string): Promise<void> {
    await postData(`${this.baseUrl}/users/${userId}/enroll`, { userId, programId });
  }

  async unenrollFromProgram(userId: string, programId: string): Promise<void> {
    await postData(`${this.baseUrl}/users/${userId}/unenroll`, { userId, programId });
  }
}

export const trainingService = new TrainingService();