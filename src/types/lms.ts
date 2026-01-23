export interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'facilitator' | 'admin';
  avatar?: string;
  enrolledCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  progress: number;
  instructor: string;
  duration: string;
  enrolledCount: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'task';
  duration: string;
  isCompleted: boolean;
  content?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  submissionUrl?: string;
  grade?: number;
  feedback?: string;
  moduleId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'normal' | 'important' | 'urgent';
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}
