export interface Subtask {
  id: number | null;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: number | null;
  title: string;
  description: string;
  status: string;
  columnId: number;
  subtasks: Subtask[];
}

export interface Column {
  id: number;
  name: string;
  color: string;
  tasks: Task[];
}

export interface Board {
  id: number | null;
  name: string;
  columns: Column[];
}