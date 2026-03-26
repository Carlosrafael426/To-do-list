import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const high = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  const stats = [
    {
      label: 'Total',
      value: total,
      icon: Circle,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Concluídas',
      value: completed,
      icon: CheckCircle2,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Pendentes',
      value: pending,
      icon: Circle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Alta Prioridade',
      value: high,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
