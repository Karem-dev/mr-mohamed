export type SectionId = 'home' | 'about' | 'lessons' | 'simulators' | 'quizzes' | 'resources' | 'contact';

export interface Lesson {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

export interface QuizLevel {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
}

export interface SimulatorProps {
  isActive: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}