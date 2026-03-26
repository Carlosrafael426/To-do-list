import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { Task, Category, TaskContextType } from '../types/task';
import { storage, getDefaultCategories } from '../utils/storage';

// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TaskProviderComponent: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [categories, setCategories] = useState<Category[]>(() => {
    const loaded = storage.getCategories();
    return loaded.length > 0 ? loaded : getDefaultCategories();
  });

  // Salvar tarefas quando mudam
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('task-mate-tasks')) {
      storage.saveTasks(tasks);
    }
  }, [tasks]);

  // Salvar categorias quando mudam
  useEffect(() => {
    storage.saveCategories(categories);
  }, [categories]);

  const addTask = useCallback((newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const addCategory = useCallback((newCategory: Omit<Category, 'id'> & { id?: string }) => {
    const category: Category = {
      ...newCategory,
      id: newCategory.id || Date.now().toString()
    };
    setCategories(prev => [...prev, category]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Remove category from tasks
    setTasks(prev =>
      prev.map(task =>
        task.category === id ? { ...task, category: '' } : task
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  const value: TaskContextType = {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addCategory,
    deleteCategory,
    clearCompleted
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TaskProviderComponent>{children}</TaskProviderComponent>
);
