export type Priority = 'high' | 'medium' | 'low';
export type SortBy = 'date' | 'priority' | 'title';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  createdAt: number;
  dueDate?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'> & { id?: string }) => void;
  deleteCategory: (id: string) => void;
  clearCompleted: () => void;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedPriority: Priority | null;
  showCompleted: boolean;
  sortBy: SortBy;
}
