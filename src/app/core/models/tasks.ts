export interface TaskComment {
  author: string;
  text: string;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus   = 'not-started' | 'in-progress' | 'completed';

export interface Task {
  id: number;
  eventId: number;

  title: string;
  description?: string;
  assignedTo: string;

  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;

  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}
