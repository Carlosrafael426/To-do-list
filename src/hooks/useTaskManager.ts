import { useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';
import type { TaskContextType } from '../types/task';

export const useTaskManager = (): TaskContextType => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      'useTaskManager deve ser usado dentro de um TaskProvider'
    );
  }

  return context;
};
