import type { Priority } from '../types/task';
import { AlertCircle, Minus, CheckCircle2 } from 'lucide-react';

export const getPriorityConfig = (priority: Priority) => {
  const configs = {
    high: {
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-300 dark:border-red-700',
      label: 'Alta',
      icon: AlertCircle,
      order: 0
    },
    medium: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-300 dark:border-yellow-700',
      label: 'Média',
      icon: Minus,
      order: 1
    },
    low: {
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-300 dark:border-green-700',
      label: 'Baixa',
      icon: CheckCircle2,
      order: 2
    }
  };

  return configs[priority];
};

export const sortByPriority = (a: Priority, b: Priority): number => {
  return getPriorityConfig(a).order - getPriorityConfig(b).order;
};
