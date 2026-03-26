import type { Task, Category } from '../types/task';

const TASKS_KEY = 'task-mate-tasks';
const CATEGORIES_KEY = 'task-mate-categories';
const THEME_KEY = 'task-mate-theme';

export const storage = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  },

  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : getDefaultCategories();
    } catch {
      return getDefaultCategories();
    }
  },

  saveCategories: (categories: Category[]): void => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
    }
  },

  getTheme: (): 'light' | 'dark' => {
    try {
      const theme = localStorage.getItem(THEME_KEY);
      return (theme as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  },

  saveTheme: (theme: 'light' | 'dark'): void => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
    }
  }
};

export const getDefaultCategories = (): Category[] => [
  { id: '1', name: 'Trabalho', color: 'bg-blue-500' },
  { id: '2', name: 'Pessoal', color: 'bg-purple-500' },
  { id: '3', name: 'Saúde', color: 'bg-green-500' },
  { id: '4', name: 'Casa', color: 'bg-yellow-500' },
  { id: '5', name: 'Compras', color: 'bg-pink-500' }
];
